"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/state/AuthStore";

import { useTranslations } from "next-intl";

interface FileWithPreview extends File {
  preview?: string;
}
interface FileUploadComponentProps {
  handleDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FileUploadComponent({
  handleDialog,
}: FileUploadComponentProps) {
  // State management for form fields and files
  const [domain, setDomain] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { userInfo }:any = useAuthStore();
  const queryClient = useQueryClient();
  // Reference for the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("repositories.document");
  const toastMessages = useTranslations("messages.file");

  // Handle drag events for the drop zone
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  }, []);

  // Handle file selection through input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  // Remove file from selection
  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const allDomains = ["HR", "Finance", "IT", "Marketing"];

  // Handle form submission
  const uploadDocumentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      
        const result = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}users/upload`,
          formData,
          {
          headers: {
            Authorization: `Bearer ${userInfo?.access_token}`,
          },
          timeout: 20000,
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        }
      );
      console.log(result.data);
      setUploadProgress(100)
      return result.data;
    },

    onSuccess: () => {
      console.log("Upload successful");
      queryClient.invalidateQueries({ queryKey: ["chatDocuments"] });
      toast.success(toastMessages("uploadSuccess"), {
        duration: 3000,
        description: toastMessages("uploadSuccessDescription"),
      });
      setUploadProgress(100);
      handleDialog(false);
      setFiles([]);
      setDomain("");
      setIsUploading(false);
    },
    onError: (error: any) => {
      console.error("Upload failed:", error);
      setUploadProgress(0);
      handleDialog(false);
      setIsUploading(false);
      toast.error(toastMessages("uploadError"), {
        duration: 3000,
        description:
        error?.response?.data?.detail || toastMessages("uploadErrorDescription"),
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files.length) {
      toast.error(toastMessages("uploadError"), {
        duration: 3000,
        description: toastMessages("uploadErrorDescription"),
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("domain", domain);
    // formData.append("email", userInfo.user?.email);
    formData.append("email", userInfo?.email);
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer(); 
      const blob = new Blob([arrayBuffer], { type: file.type });
      formData.append("files", blob, file.name);
  }
    uploadDocumentMutation.mutate(formData);
  };

  return (
    <div className="w-full mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Select onValueChange={setDomain}>
            <SelectTrigger className="w-full bg-white focus:outline-blue-500 border-blue-400 ">
              <SelectValue placeholder={t("selectPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {allDomains.map((item: string, index: number) => (
                <SelectItem key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* File Drop Zone */}
          <div
            className={`border-2 border-blue-500 border-dashed rounded-lg p-8 text-center transition-colors
                ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25"
                }
                ${files.length > 0 ? "pb-4" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />

            <div className="space-y-4">
              <Upload className="w-10  h-10 mx-auto text-blue-500" />
              <div>
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-all ease-in"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {t("chooseFileBtn")}
                </Button>
              </div>
              <p className="text-sm text-blue-500">{t("dragDropText")}</p>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted p-2 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file)}
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <Progress className="bg-blue-500" value={uploadProgress} />
            <p className="text-sm text-center text-muted-foreground">
              {t("uploadingSuccess")} {uploadProgress}%
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-500"
          disabled={isUploading || files.length === 0}
        >
          {isUploading ? t("uploadingSuccess") : t("fileUploadBtn")}
        </Button>
      </form>
    </div>
  );
}
