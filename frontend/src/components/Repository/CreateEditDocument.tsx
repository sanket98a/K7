"use client";

import type React from "react";
import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";



import FileUploadComponent from "./FileUpload";

import TabularFileUploadComponent from "./tabular-file-upload";

interface CreateEditDocumentModalProps {
  children: React.ReactNode;
  isTabular?: boolean;
  documentName?: string;
}

export default function CreateEditDocumentModal({
  children,
  isTabular = false,
 
}: CreateEditDocumentModalProps) {
  const [open, setOpen] = useState(false);






  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-500">Upload Documents</DialogTitle>
        </DialogHeader>
        <div>
          <div className="grid gap-4 py-4">
     
             {isTabular?<TabularFileUploadComponent handleDialog={setOpen} />: <FileUploadComponent handleDialog={setOpen}/>}
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
