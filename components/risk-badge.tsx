import type { RiskLevel } from "@/lib/contract-review"
import { RISK_META } from "@/lib/contract-review"
import { cn } from "@/lib/utils"

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel
  className?: string
}) {
  const meta = RISK_META[level]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        meta.bg,
        meta.text,
        meta.border,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden />
      {meta.label}
    </span>
  )
}
