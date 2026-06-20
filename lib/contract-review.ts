export type RiskLevel = "high" | "medium" | "low"

export interface RiskItem {
  id: string
  type: string
  level: RiskLevel
  problem: string
  suggestion: string
  clause?: string
}

export interface ReviewResult {
  detectedType: string
  overallLevel: RiskLevel
  score: number
  summary: string
  counts: {
    high: number
    medium: number
    low: number
  }
  risks: RiskItem[]
  finalSuggestion: string
}

export interface Capability {
  title: string
  desc: string
}

// 首页核心能力卡片
export const CAPABILITIES: Capability[] = [
  {
    title: "自动识别合同类型",
    desc: "无需手动选择，AI 解析全文后自动判定采购、服务、租赁等合同类型。",
  },
  {
    title: "结构化风险预审",
    desc: "按签约主体、法律条款、商业条款、履约交付四大维度逐项扫描风险。",
  },
  {
    title: "可落地修改建议",
    desc: "针对每项风险给出具体修订方案，业务自查后再提交法务，减少返工。",
  },
]

// 支持的文件格式
export const ACCEPTED_FORMATS = ".docx,.pdf"

// 模拟解析出的合同内容预览（Demo 用，不做真实解析）
export const MOCK_CONTRACT_PREVIEW = `甲方（采购方）：某某科技有限公司
乙方（供应方）：某某贸易有限责任公司

第一条 合作内容
乙方向甲方供应办公设备一批，具体型号及数量见附件清单。

第四条 付款方式
甲方在收到货物后付款。

第七条 违约责任
甲方未按时付款的，应向乙方支付违约金。

第十条 争议解决
本合同履行过程中发生争议，由双方协商解决。`

export const RISK_META: Record<
  RiskLevel,
  { label: string; text: string; bg: string; dot: string; border: string }
> = {
  high: {
    label: "高风险",
    text: "text-risk-high",
    bg: "bg-risk-high-bg",
    dot: "bg-risk-high",
    border: "border-risk-high/30",
  },
  medium: {
    label: "中风险",
    text: "text-risk-medium",
    bg: "bg-risk-medium-bg",
    dot: "bg-risk-medium",
    border: "border-risk-medium/30",
  },
  low: {
    label: "低风险",
    text: "text-risk-low",
    bg: "bg-risk-low-bg",
    dot: "bg-risk-low",
    border: "border-risk-low/30",
  },
}
