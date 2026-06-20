import { NextResponse, type NextRequest } from "next/server"
import mammoth from "mammoth"
import pdfParse from "pdf-parse"
import type { ReviewResult, RiskItem, RiskLevel } from "@/lib/contract-review"

export const runtime = "nodejs"

type CozeWorkflowResponse = {
  code?: number
  msg?: string
  message?: string
  data?: unknown
  [key: string]: unknown
}

const COZE_API_URL = "https://api.coze.cn/v1/workflow/run"

function normalizeRiskLevel(value: unknown): RiskLevel {
  const text = String(value ?? "").toLowerCase()
  if (["high", "高", "高风险", "严重"].some((key) => text.includes(key))) {
    return "high"
  }
  if (["medium", "middle", "中", "中风险", "一般"].some((key) => text.includes(key))) {
    return "medium"
  }
  return "low"
}

function pickString(source: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === "string" && value.trim()) return value.trim()
    if (typeof value === "number") return String(value)
  }
  return fallback
}

function parseJsonLike(value: unknown): unknown {
  if (typeof value !== "string") return value

  const trimmed = value.trim()
  if (!trimmed) return value

  try {
    return JSON.parse(trimmed)
  } catch {
    return value
  }
}

function unwrapCozeData(response: CozeWorkflowResponse): unknown {
  let data: unknown = response.data ?? response

  for (let i = 0; i < 4; i += 1) {
    data = parseJsonLike(data)

    if (!data || typeof data !== "object" || Array.isArray(data)) break

    const objectData = data as Record<string, unknown>
    const next =
      objectData.output ??
      objectData.result ??
      objectData.review_result ??
      objectData.answer ??
      objectData.data

    if (next === undefined || next === data) break
    data = next
  }

  return parseJsonLike(data)
}

function normalizeRisks(value: unknown): RiskItem[] {
  if (!Array.isArray(value)) return []

  return value.map((item, index) => {
    const risk = item && typeof item === "object" ? (item as Record<string, unknown>) : {}

    return {
      id: pickString(risk, ["id"], `risk-${index + 1}`),
      type: pickString(risk, ["type", "risk_type", "category", "title"], "合同风险"),
      level: normalizeRiskLevel(risk.level ?? risk.risk_level ?? risk.severity),
      problem: pickString(risk, ["problem", "issue", "description", "risk_desc", "content"], "工作流未返回具体问题描述。"),
      suggestion: pickString(risk, ["suggestion", "advice", "recommendation", "fix"], "建议提交法务进一步确认。"),
      clause: pickString(risk, ["clause", "clause_name", "location", "article"]),
    }
  })
}

function normalizeReviewResult(rawData: unknown): ReviewResult {
  const parsed = parseJsonLike(rawData)
  const data = parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? (parsed as Record<string, unknown>)
    : { summary: String(parsed ?? "") }

  const risks = normalizeRisks(
    data.risks ?? data.risk_items ?? data.riskList ?? data.items,
  )
  const counts = risks.reduce(
    (acc, risk) => {
      acc[risk.level] += 1
      return acc
    },
    { high: 0, medium: 0, low: 0 },
  )

  return {
    detectedType: pickString(data, ["detectedType", "detected_type", "contract_type", "contractType"], "未识别"),
    overallLevel: normalizeRiskLevel(data.overallLevel ?? data.overall_level ?? data.risk_level),
    score: 0,
    summary: pickString(data, ["summary", "risk_summary", "conclusion"], "AI 工作流已返回审核结果，请查看下方风险明细。"),
    counts,
    risks,
    finalSuggestion: pickString(data, ["finalSuggestion", "final_suggestion", "suggestion", "action"], "建议修改关键条款后提交法务。"),
  }
}

async function extractContractText(file: File) {
  const fileName = file.name
  const ext = fileName.split(".").pop()?.toLowerCase()
  const buffer = Buffer.from(await file.arrayBuffer())

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ buffer })
    return result.value.trim()
  }

  if (ext === "pdf") {
    const result = await pdfParse(buffer)
    return result.text.trim()
  }

  if (ext === "doc") {
    throw new Error("暂不支持 .doc 格式的正文解析，请先转换为 .docx 或 PDF 后上传。")
  }

  throw new Error("仅支持上传 .docx 或 .pdf 合同文件。")
}

export async function POST(request: NextRequest) {
  try {
    const token = process.env.COZE_TOKEN
    const workflowId = process.env.COZE_WORKFLOW_ID
    const contractTextField = process.env.COZE_CONTRACT_TEXT_FIELD || "contract_text"
    const fileNameField = process.env.COZE_FILE_NAME_FIELD || "file_name"

    if (!token || !workflowId) {
      return NextResponse.json(
        { error: "服务端未配置 COZE_TOKEN 或 COZE_WORKFLOW_ID，请先填写 .env.local。" },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请上传合同文件。" }, { status: 400 })
    }

    const contractText = await extractContractText(file)

    if (!contractText) {
      return NextResponse.json(
        { error: "未能从文件中解析出合同正文，请确认文件内容可复制或改用 .docx / PDF 文本版。" },
        { status: 422 },
      )
    }

    const parameters = {
      contract_text: contractText,
      file_name: file.name,
      input: contractText,
      text: contractText,
      query: contractText,
      fileName: file.name,
      [contractTextField]: contractText,
      [fileNameField]: file.name,
    }

    const cozeResponse = await fetch(COZE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        parameters,
      }),
    })

    const cozeText = await cozeResponse.text()
    const cozeJson = parseJsonLike(cozeText) as CozeWorkflowResponse

    if (!cozeResponse.ok) {
      return NextResponse.json(
        { error: `扣子工作流调用失败：${cozeText || cozeResponse.statusText}` },
        { status: 502 },
      )
    }

    if (typeof cozeJson === "object" && cozeJson?.code && cozeJson.code !== 0) {
      return NextResponse.json(
        {
          error: cozeJson.msg ?? cozeJson.message ?? "扣子工作流返回失败状态。",
          sentParameterNames: Object.keys(parameters),
        },
        { status: 502 },
      )
    }

    const result = normalizeReviewResult(unwrapCozeData(cozeJson))

    return NextResponse.json({
      result,
      parsedTextLength: contractText.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "合同预审失败，请稍后重试。"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
