"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { uploadDocumentService } from "@/lib/auth";
import { header, option } from "framer-motion/client";

import { useAppStore } from "@/state/store";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/state/AuthStore";

interface FileWithPreview extends File {
  preview?: string;
}
interface FileUploadComponentProps{
  handleDialog?: ()=>void
}

export default function FileUploadComponent({handleDialog}:any) {
  // State management for form fields and files
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showDomains, setShowDomains] = useState(false);
  const {userInfo}:any = useAuthStore()
  const queryClient = useQueryClient();
  // Reference for the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

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
console.log(userInfo)
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
      const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}users/upload`, formData, {
        headers: {
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setUploadProgress(progress);
        },
      });
      console.log(result.data);
      return result.data;
    },
    onSuccess: () => {
      console.log("Upload successful");
      queryClient.invalidateQueries({ queryKey: ["chatDocuments"] });
      toast.success("Documents Uploaded Successfully", {
        duration: 3000,
        description: "Your documents have been uploaded successfully!",
      });
      handleDialog(false);
      setFiles([]);
      setDomain("");
      setUploadProgress(100);
      setIsUploading(false);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      toast.error("File was not uploaded", {
        duration: 3000,
        description: "Failed to upload, Please try again",
      });
      handleDialog(false);
      setIsUploading(false);
    },
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!files.length) {
      alert("Please fill all required fields and select at least one file");
      return;
    }
  
    setIsUploading(true);
    setUploadProgress(0);
  
    const formData = new FormData();
    formData.append("domain", domain);
    // formData.append("email", userInfo.user?.email);
    formData.append("email", userInfo?.email);
    files.forEach((file) => formData.append("files", file));
  
    uploadDocumentMutation.mutate(formData);
  };







  return (
    <div className="w-full mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
        <Select onValueChange={setDomain} >
      <SelectTrigger className="w-full bg-white focus:outline-blue-500 border-blue-400 ">
        <SelectValue placeholder="Select a Domain" />
      </SelectTrigger>
      <SelectContent>
  {allDomains.map((item,index)=>(
    <SelectItem key={index} value={item}>{item}</SelectItem>
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
                  Choose Files
                </Button>
              </div>
              <p className="text-sm text-blue-500">
                or drag and drop your files here
              </p>
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
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-500"
          disabled={isUploading || files.length === 0}
        >
          {isUploading ? "Uploading..." : "Upload Files"}
        </Button>
      </form>
    </div>
  );
}
