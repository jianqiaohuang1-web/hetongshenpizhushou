"use client"

import type { ReviewResult } from "@/lib/contract-review"
import { RISK_META } from "@/lib/contract-review"
import type { UploadedFile } from "@/components/file-upload"
import { RiskCard } from "@/components/risk-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  RotateCcw,
  ShieldAlert,
  Tag,
} from "lucide-react"

function StatCard({
  label,
  count,
  level,
}: {
  label: string
  count: number
  level: "high" | "medium" | "low"
}) {
  const meta = RISK_META[level]
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-card p-4",
        meta.border,
      )}
    >
      <div
        className={cn(
          "flex size-11 items-center justify-center rounded-lg text-lg font-bold",
          meta.bg,
          meta.text,
        )}
      >
        {count}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{count} 项待关注</p>
      </div>
    </div>
  )
}

export function ResultPanel({
  result,
  file,
  onReset,
}: {
  result: ReviewResult
  file: UploadedFile | null
  onReset: () => void
}) {
  const meta = RISK_META[result.overallLevel]
  const reviewConclusion = "建议修改后再提交法务"
  const handlingPriority = "高"
  const suggestedAction = "修改关键条款后提交法务"

  function handleExport() {
    // Demo：导出为文本报告
    const lines = [
      `合同预审报告`,
      `文件名称：${file?.name ?? "—"}`,
      `合同类型：${result.detectedType}`,
      `预审结论：${reviewConclusion}`,
      `总体风险等级：${meta.label}`,
      `处理优先级：${handlingPriority}`,
      `建议动作：${suggestedAction}`,
      ``,
      `风险摘要：${result.summary}`,
      ``,
      `风险明细（共 ${result.risks.length} 项）：`,
      ...result.risks.map(
        (r, i) =>
          `${i + 1}. [${RISK_META[r.level].label}] ${r.type}（${r.clause ?? ""}）\n   问题：${r.problem}\n   建议：${r.suggestion}`,
      ),
      ``,
      `最终修改建议：${result.finalSuggestion}`,
    ]
    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `合同预审报告_${file?.name ?? "demo"}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* 报告头部：文件信息 + 操作 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">
              {file?.name ?? "合同文件"}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Tag className="size-3" />
              <span>AI 识别合同类型：</span>
              <span className="font-medium text-foreground">
                {result.detectedType}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button onClick={onReset} variant="outline" size="sm" className="gap-1.5">
            <RotateCcw className="size-3.5" />
            重新上传合同
          </Button>
          <Button onClick={handleExport} size="sm" className="gap-1.5">
            <Download className="size-3.5" />
            导出预审报告
          </Button>
        </div>
      </div>

      {/* 预审结论概览 */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div
          className={cn(
            "flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between",
            meta.bg,
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-xl bg-card shadow-sm",
                meta.text,
              )}
            >
              <ShieldAlert className="size-7" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                预审结论
              </p>
              <p className={cn("text-2xl font-bold", meta.text)}>
                {reviewConclusion}
              </p>
            </div>
          </div>
          <div className="grid gap-2 text-left sm:min-w-64 sm:text-right">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                总体风险等级
              </p>
              <p className={cn("text-sm font-semibold", meta.text)}>
                {meta.label}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                处理优先级
              </p>
              <p className="text-sm font-semibold text-foreground">
                {handlingPriority}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                建议动作
              </p>
              <p className="text-sm font-semibold text-foreground">
                {suggestedAction}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-border p-5">
          <p className="text-xs font-medium text-muted-foreground">风险摘要</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground">
            {result.summary}
          </p>
        </div>
      </div>

      {/* 风险数量统计 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="高风险" count={result.counts.high} level="high" />
        <StatCard label="中风险" count={result.counts.medium} level="medium" />
        <StatCard label="低风险" count={result.counts.low} level="low" />
      </div>

      {/* 风险明细 */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <ClipboardCheck className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            风险明细
            <span className="ml-1.5 text-muted-foreground">
              （共 {result.risks.length} 项）
            </span>
          </h3>
        </div>
        <div className="space-y-3">
          {result.risks.map((risk, i) => (
            <RiskCard key={risk.id} risk={risk} index={i + 1} />
          ))}
        </div>
      </div>

      {/* 最终修改建议 */}
      <div className="rounded-2xl border border-primary/30 bg-accent/50 p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-primary" />
          <h3 className="text-sm font-semibold text-accent-foreground">
            最终修改建议
          </h3>
        </div>
        <p className="mt-2.5 text-sm leading-relaxed text-foreground">
          {result.finalSuggestion}
        </p>
      </div>
    </div>
  )
}
