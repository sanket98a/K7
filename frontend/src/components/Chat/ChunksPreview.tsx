"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChunkMetadata } from "@/types";
import { useLocale } from "next-intl";
import ReactMarkdown from "react-markdown";
import { FileText, FileCode, BarChart3 } from "lucide-react";

interface ChunksPreviewProps {
  chunks: Record<string, ChunkMetadata>;
}

const ChunksPreview = ({ chunks }: ChunksPreviewProps) => {
  const PREVIEW_LENGTH = 350;
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const isRTL = locale === "ar";

// take first chunks and according to preview length slice the text for preview
  const firstChunk = Object.values(chunks)[0];
  const previewText = firstChunk?.text.length > PREVIEW_LENGTH 
    ? firstChunk.text.slice(0, PREVIEW_LENGTH) + "..." 
    : firstChunk?.text || "";

  return (
    <TooltipProvider>
      <div className="relative">
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => setOpen(true)}  >
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            className="max-w-sm p-3 bg-slate-600 dark:bg-slate-800 text-gray-200 dark:text-slate-100 border-slate-200 dark:border-slate-700"
            side={isRTL ? "left" : "right"}
          >
            <p className="text-sm" dir={isRTL ? "rtl" : "ltr"}>
              {previewText}
            </p>
            {firstChunk?.text.length > PREVIEW_LENGTH && (
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" 
                onClick={() => setOpen(true)}
              >
                See More
              </Button>
            )}
          </TooltipContent>
        </Tooltip>

        {/* Dialog triggered by the tootltip or the main button that will handle the cross */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="hidden"></button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-blue-500">Source Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-6 pb-8">
              {Object.entries(chunks).map(([key, chunk]) => (
                <div
                  key={key}
                  className="p-6 rounded-lg bg-slate-100 dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700"
                  dir={isRTL ? "rtl" : "ltr"}
                >
              
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>{chunk.filename}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-blue-500" />
                      <span>Page {chunk.page_num}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span>Similarity: {(chunk.similarity_distance * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                 
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
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default ChunksPreview;
