"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export function DropZone() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    console.log('handlefileUpload is being triggered')
    setSelectedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file); // Append files with unique keys
    });
    console.log(formData)
    // console.log(selectedFiles);
  };

  return (
    <div className="w-full h-fit  mx-auto border bg-white dark:bg-black border-blue-500 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
