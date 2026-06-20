"use client"

import { CAPABILITIES } from "@/lib/contract-review"
import { FileUpload, type UploadedFile } from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { AlertCircle, ScanText, Sparkles, Wand2 } from "lucide-react"

export function UploadPage({
  file,
  onFileChange,
  onStart,
  error,
}: {
  file: UploadedFile | null
  onFileChange: (file: UploadedFile | null) => void
  onStart: () => void
  error?: string | null
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* 标题区 */}
      <div className="text-center">
        <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          上传合同，AI 自动完成预审
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          上传 Word / PDF 合同文件，AI 自动解析合同内容、识别合同类型与关键风险，并生成结构化预审报告，帮助业务团队在提交法务前完成合同自查，减少低质量审批和反复沟通。
        </p>
      </div>

      {/* 核心能力卡片 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {CAPABILITIES.map((cap) => (
          <div
            key={cap.title}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
              <Sparkles className="size-4" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {cap.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {cap.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 上传区 */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <ScanText className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">上传合同文件</h2>
        </div>

        <FileUpload file={file} onFileChange={onFileChange} />

        <div className="mt-5">
          <Button
            onClick={onStart}
            disabled={!file}
            className="w-full gap-2"
            size="lg"
          >
            <Wand2 className="size-4" />
            开始审核
          </Button>
          {!file && (
            <p className="mt-2.5 text-center text-xs text-muted-foreground">
              请先上传合同文件后再开始审核
            </p>
          )}
          {error && (
            <div className="mt-3 flex gap-2 rounded-lg border border-risk-high/30 bg-risk-high-bg px-3 py-2 text-left">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-risk-high" />
              <p className="text-xs leading-relaxed text-foreground">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
