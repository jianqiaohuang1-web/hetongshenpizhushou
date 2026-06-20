import type { RiskItem } from "@/lib/contract-review"
import { RISK_META } from "@/lib/contract-review"
import { RiskBadge } from "@/components/risk-badge"
import { cn } from "@/lib/utils"
import { FileWarning, Lightbulb } from "lucide-react"

export function RiskCard({ risk, index }: { risk: RiskItem; index: number }) {
  const meta = RISK_META[risk.level]
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5",
        meta.border,
      )}
    >
      {/* 左侧风险色条 */}
      <span
        className={cn("absolute inset-y-0 left-0 w-1", meta.dot)}
        aria-hidden
      />
      <div className="flex flex-wrap items-center justify-between gap-2 pl-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
            {index}
          </span>
          <h4 className="text-sm font-semibold text-foreground">{risk.type}</h4>
          {risk.clause && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              {risk.clause}
            </span>
          )}
        </div>
        <RiskBadge level={risk.level} />
      </div>

      <div className="mt-3 space-y-3 pl-2">
        <div className="flex gap-2.5">
          <FileWarning
            className={cn("mt-0.5 size-4 shrink-0", meta.text)}
            aria-hidden
          />
          <div>
            <p className="text-xs font-medium text-muted-foreground">发现的问题</p>
            <p className="mt-0.5 text-sm leading-relaxed text-foreground">
              {risk.problem}
            </p>
          </div>
        </div>
        <div className="flex gap-2.5 rounded-lg bg-muted/60 p-3">
          <Lightbulb
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden
          />
          <div>
            <p className="text-xs font-medium text-primary">修改建议</p>
            <p className="mt-0.5 text-sm leading-relaxed text-foreground">
              {risk.suggestion}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
