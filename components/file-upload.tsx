"use client"

import { useRef, useState, type DragEvent } from "react"
import { ACCEPTED_FORMATS, MOCK_CONTRACT_PREVIEW } from "@/lib/contract-review"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  FileText,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react"

export interface UploadedFile {
  name: string
  size: number
  type: string
  file: File
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function fileTypeLabel(name: string) {
  const ext = name.split(".").pop()?.toLowerCase()
  if (ext === "pdf") return "PDF 文档"
  if (ext === "doc" || ext === "docx") return "Word 文档"
  return "未知格式"
}

type ParseStatus = "parsing" | "done"

export function FileUpload({
  file,
  onFileChange,
}: {
  file: UploadedFile | null
  onFileChange: (file: UploadedFile | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [parseStatus, setParseStatus] = useState<ParseStatus>("done")
  const [pageCount, setPageCount] = useState(0)

  function acceptFile(f: File) {
    const ext = f.name.split(".").pop()?.toLowerCase()
    if (!["docx", "pdf"].includes(ext ?? "")) return
    onFileChange({ name: f.name, size: f.size, type: f.type, file: f })
    // Demo 使用固定模拟页数，不做真实文件解析。
    setPageCount(8)
    setParseStatus("parsing")
    setTimeout(() => setParseStatus("done"), 1200)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (f) acceptFile(f)
  }

  if (file) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {file.name}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs">
                {parseStatus === "parsing" ? (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Loader2 className="size-3 animate-spin text-primary" />
                    正在解析合同内容…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-risk-low">
                    <CheckCircle2 className="size-3" />
                    合同正文解析完成
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onFileChange(null)}
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="移除文件"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          {/* 文件解析信息 */}
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg bg-muted/60 px-4 py-3 sm:grid-cols-5">
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">文件名</dt>
              <dd className="mt-0.5 truncate text-xs font-medium text-foreground">
                {file.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">文件类型</dt>
              <dd className="mt-0.5 text-xs font-medium text-foreground">
                {fileTypeLabel(file.name)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">文件大小</dt>
              <dd className="mt-0.5 text-xs font-medium text-foreground">
                {formatSize(file.size)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">解析状态</dt>
              <dd className="mt-0.5 text-xs font-medium text-foreground">
                {parseStatus === "parsing" ? "解析中…" : "合同正文解析完成"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">识别页数</dt>
              <dd className="mt-0.5 text-xs font-medium text-foreground">
                {parseStatus === "parsing" ? "解析中…" : `${pageCount} 页`}
              </dd>
            </div>
          </dl>

          <p className="mt-3 text-xs text-muted-foreground">
            系统将自动提取合同正文，本 Demo 不保存原始文件。
          </p>
        </div>

        {/* 合同内容预览 */}
        {parseStatus === "done" && (
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <p className="text-xs font-medium text-muted-foreground">
                合同内容预览
              </p>
              <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                节选
              </span>
            </div>
            <pre className="max-h-44 overflow-y-auto whitespace-pre-wrap px-4 py-3 font-sans text-xs leading-relaxed text-muted-foreground">
              {MOCK_CONTRACT_PREVIEW}
            </pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragActive(true)
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card px-6 py-12 text-center transition-colors",
        dragActive
          ? "border-primary bg-accent/50"
          : "border-border hover:border-primary/50 hover:bg-accent/30",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) acceptFile(f)
        }}
      />
      <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
        <UploadCloud className="size-7" />
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">
        点击上传，或将合同文件拖拽到此处
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">
        支持 Word / PDF 文件 · 格式 .docx、.pdf
      </p>
    </div>
  )
}
