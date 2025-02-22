"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DropZone } from "../DropZone";
import { useFileUpload } from "@/hooks/use-fileupload";
import FileUploadComponent from "./FileUpload";

interface CreateEditDocumentModalProps {
  children: React.ReactNode;
  isEditing?: boolean;
  documentName?: string;
}

export default function CreateEditDocumentModal({
  children,
  isEditing = false,
  documentName = "",
}: CreateEditDocumentModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(documentName);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-500">{isEditing ? "Edit Document" : "Upload Documents"}</DialogTitle>
        </DialogHeader>
        <div>
          <div className="grid gap-4 py-4">
           
              <FileUploadComponent/>
              {/* <DropZone/> */}
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="col-span-3"
              />
            </div> */}
          </div>
         
        </div>
      </DialogContent>
    </Dialog>
  );
}
