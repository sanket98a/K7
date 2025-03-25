"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ReactMarkdown from "react-markdown";
import { useLocale, useTranslations } from "next-intl";
import { FileText, FileCode, BarChart3} from "lucide-react";

import { ChunkMetadata } from "@/types";


interface ChunksDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chunks: Record<string, ChunkMetadata>;
}


export default function ChunksDialog({ isOpen, onClose, chunks }: ChunksDialogProps) {
  const locale = useLocale();
  const t = useTranslations("repositories.document.chunks")
  const isRTL = locale === "ar";
  const dummyChunks = {
    "dummy_chunk_1": {
      "text": "This is a dummy test chunk for UI testing.",
      "filename": "dummy_file.txt",
      "page_num": 1,
      "similarity_distance": 0.98
    },
    "dummy_chunk_2": {
      "text": "Another test chunk with different data.",
      "filename": "dummy_document.pdf",
      "page_num": 2,
      "similarity_distance": 0.89
    }
  };
  // const formatSimilarity = (distance: number) => {
  //   return `${(distance * 100).toFixed(1)}%`;
  // };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isRTL ? "left" : "right"}
        className="w-[90%] sm:w-[540px] md:w-[680px] lg:w-[860px] overflow-y-auto"
      >
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="text-blue-500">{t('title')}</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6 pb-8">
          {Object.entries(chunks).map(([key, chunk]) => (
            <div
              key={key}
              className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Metadata Section */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span>{chunk.filename}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-blue-500" />
                  <span>{t("page_num")}: {chunk.page_num}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span>{t("similarity_distance")}: {chunk.similarity_distance}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown
                  className={`${isRTL ? "text-[130%]" : ""}`}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-blue-500">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold text-blue-500">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium text-blue-500">{children}</h3>,
                    p: ({ children }) => <p className="mb-2">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>
                  }}
                >
                  {chunk.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
} 