// useFileUpload.ts
import { useState,  useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/state/AuthStore";


interface UseFileUploadProps {
  queryKey: string;
  uploadEndpoint: string;
  onSuccessMessage?: string;
  onErrorMessage?: string;
}

export function useFileUpload({ queryKey, uploadEndpoint, onSuccessMessage = "Documents Uploaded Successfully", onErrorMessage = "File was not uploaded" }: UseFileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userInfo } = useAuthStore();
  const queryClient = useQueryClient();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove));
  };

  const uploadDocumentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await axios.post(uploadEndpoint, formData, {
        headers: {
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setUploadProgress(progress);
        },
      });
      return result.data;
    },
    onSuccess: () => {
      toast.success(onSuccessMessage);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      resetState();
    },
    onError: () => {
      toast.error(onErrorMessage);
      setIsUploading(false);
    },
  });

  const handleSubmit = async (domain: string, email: string) => {
    if (!files.length) {
      toast.error("Please select at least one file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("domain", domain);
    formData.append("email", email);
    files.forEach((file) => formData.append("files", file));

    uploadDocumentMutation.mutate(formData);
  };

  const resetState = () => {
    setFiles([]);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return {
    files,
    uploadProgress,
    isUploading,
    fileInputRef,
    handleFileSelect,
    removeFile,
    handleSubmit,
    resetState,
  };
}
