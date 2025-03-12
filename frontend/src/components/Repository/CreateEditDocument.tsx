"use client";

import type React from "react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import FileUploadComponent from "./FileUpload";

import TabularFileUploadComponent from "./tabular-file-upload";
import { useLocale, useTranslations } from "next-intl";

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
  const t = useTranslations("repositories.document")
  const locale = useLocale();
  const isRTL = locale === 'ar';
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader dir={isRTL ? 'rtl' : 'ltr'}>
          <DialogTitle className={"text-blue-500"}>{t("dialogTitle")}</DialogTitle>
        </DialogHeader>
        <div> 
          <div className="grid gap-4 py-4">
            {isTabular ? (
              <TabularFileUploadComponent handleDialog={setOpen} />
            ) : (
              <FileUploadComponent handleDialog={setOpen} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
