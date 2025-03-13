"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/state/AuthStore";
import {  useTranslations } from "next-intl";

interface FileWithPreview extends File {
  preview?: string;
}
interface FileUploadComponentProps{
  handleDialog: React.Dispatch<React.SetStateAction<boolean>>
}


export default function TabularFileUploadComponent({ handleDialog }:FileUploadComponentProps) {
  const [domain, setDomain] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { userInfo }: any = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("repositories.tabular")
  const toastMessages = useTranslations("messages.file")


  const allowedFormats = ["csv", "xlsx", "xls"];

  const validateFile = (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      toast.error(toastMessages("tabularInvalidFormat"), {
        description: toastMessages("tabularInvalidFormatDescription"),
      });
      return false;
    }
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(validateFile);
    setFiles(droppedFiles.slice(0, 1));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(validateFile);
      setFiles(selectedFiles.slice(0, 1));
    }
  };

  const removeFile = () => {
    setFiles([]);
  };

  const uploadDocumentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}users/upload_tabular_data`, formData, {
        headers: {
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setUploadProgress(progress);
        },
      });
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["TabularDocuments"] });
      toast.success(toastMessages("uploadSuccess"), {
        description: toastMessages("uploadSuccessDescription"),
      });
      handleDialog(false);
      setFiles([]);
      setDomain("");
      setUploadProgress(0);
      setIsUploading(false);
    },
    onError: (error:any) => {
      toast.error(toastMessages("uploadError"), {
        description: error.response?.data?.detail || toastMessages("uploadErrorDescription"),
      });
      setIsUploading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length || !domain) {
        toast.error(toastMessages("uploadError"), {
        description: toastMessages("uploadErrorDescription"),
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("table_name", domain);
    // formData.append("email", userInfo?.user?.email || "fahadabbas817@gmail.com");/
    formData.append("email", userInfo?.email );
    // files.forEach((file) => formData.append("file", file));
    formData.append("file", files[0]);

    uploadDocumentMutation.mutate(formData);
  };

  return (
    <div className="w-full mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder={t("inputPlaceHolder")} required />
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? "bg-primary/10" : "border-muted-foreground/25"}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".csv,.xlsx,.xls" />
          <Upload className="w-10 h-10 mx-auto text-blue-500" />
          <Button type="button" className="bg-blue-700 text-white" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {t("chooseFileBtn")}
          </Button>
          <p className="text-sm text-muted-foreground mt-1">{t("dragDropText")}</p>
          {files.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <FileText className="w-4 h-4" />
                <span>{files[0].name}</span>
                <Button type="button" variant="ghost" onClick={removeFile} disabled={isUploading}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        {isUploading && <Progress value={uploadProgress} />}
        <Button className="bg-blue-600 mx-auto"   type="submit" disabled={isUploading || !files.length}>{t("fileUploadBtn")}</Button>
      </form>
    </div>
  );
}
