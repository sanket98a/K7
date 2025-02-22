"use client"

import { useState } from "react"
import { uploadDocumentService } from "@/lib/auth" // Import your API service

interface FileWithProgress extends File {
  progress?: number
  uploaded?: boolean
  error?: string
}

interface UseFileUploadOptions {
  onUploadComplete?: (files: File[]) => void
  onError?: (error: string) => void
  onSuccess?: () => void
}

export function useFileUpload({ onUploadComplete, onError, onSuccess }: UseFileUploadOptions) {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const addFiles = (newFiles: File[]) => {
    setFiles((prevFiles) => {
      const uniqueFiles = newFiles.filter(
        (newFile) => !prevFiles.some((existingFile) => existingFile.name === newFile.name),
      )
      return [...prevFiles, ...uniqueFiles.map((file) => ({ ...file, progress: 0 }))]
    })
  }

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
    setUploadProgress((prev) => {
      const { [fileName]: removed, ...rest } = prev
      return rest
    })
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    const formData = new FormData()

    // Append all files to FormData
    files.forEach((file) => {
      formData.append("documents", file)
    })

    try {
      await uploadDocumentService(formData)
      onUploadComplete?.(files)
      onSuccess?.()
      clearFiles()
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const clearFiles = () => {
    setFiles([])
    setUploadProgress({})
  }

  return {
    files,
    isUploading,
    uploadProgress,
    addFiles,
    removeFile,
    uploadFiles,
    clearFiles,
  }
}

