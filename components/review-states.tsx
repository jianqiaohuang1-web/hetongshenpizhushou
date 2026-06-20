import { Loader2, ScanText } from "lucide-react"

const LOADING_STEPS = [
  "解析合同结构",
  "识别合同类型",
  "比对风险规则库",
  "生成审核建议",
]

export function LoadingState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center">
      <div className="relative flex size-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
          <ScanText className="size-7" />
        </div>
      </div>
      <h3 className="mt-5 text-base font-semibold text-foreground">
        AI 正在审核合同…
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">预计耗时数秒，请稍候</p>

      <div className="mt-6 w-full max-w-xs space-y-2.5">
        {LOADING_STEPS.map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-2.5 rounded-lg bg-muted/60 px-3 py-2 text-left"
            style={{ animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }}
          >
            <Loader2 className="size-3.5 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
