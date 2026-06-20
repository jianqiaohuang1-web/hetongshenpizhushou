import { ReviewWorkbench } from "@/components/review-workbench"
import { ScanText, Zap } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ScanText className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">
                AI合同审批助手
              </p>
              <p className="text-xs text-muted-foreground">
                AI Contract Risk Review Platform
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Zap className="size-3 text-primary" />
            合同风控 · Demo
          </span>
        </div>
      </header>

      {/* 主体流程 */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ReviewWorkbench />
      </div>

      <footer className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          本页面为产品演示 Demo，预审结果仅用于风险提示，不构成正式法律意见或法务审批结论。
        </p>
      </footer>
    </main>
  )
}
