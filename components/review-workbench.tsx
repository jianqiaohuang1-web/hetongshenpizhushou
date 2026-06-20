"use client"

import { useState } from "react"
import type { ReviewResult } from "@/lib/contract-review"
import type { UploadedFile } from "@/components/file-upload"
import { UploadPage } from "@/components/upload-page"
import { ResultPanel } from "@/components/result-panel"
import { LoadingState } from "@/components/review-states"

type Stage = "upload" | "loading" | "report"

export function ReviewWorkbench() {
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [stage, setStage] = useState<Stage>("upload")
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleStart() {
    if (!file) return
    setStage("loading")
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file.file)

      const response = await fetch("/api/review", {
        method: "POST",
        body: formData,
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error ?? "合同预审失败，请稍后重试。")
      }

      if (!data?.result) {
        throw new Error("后端未返回可展示的预审结果，请检查扣子工作流输出。")
      }

      setResult(data.result)
      setStage("report")
    } catch (err) {
      setError(err instanceof Error ? err.message : "合同预审失败，请稍后重试。")
      setStage("upload")
    }
  }

  function handleReset() {
    setFile(null)
    setResult(null)
    setError(null)
    setStage("upload")
  }

  if (stage === "loading") return <LoadingState />

  if (stage === "report" && result) {
    return <ResultPanel result={result} file={file} onReset={handleReset} />
  }

  return (
    <UploadPage
      file={file}
      onFileChange={(nextFile) => {
        setFile(nextFile)
        setError(null)
      }}
      onStart={handleStart}
      error={error}
    />
  )
}
