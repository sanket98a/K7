"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ReactMarkdown from "react-markdown";
import { useLocale } from "next-intl";

interface ChunksDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chunks: string[];
}

export default function ChunksDialog({ isOpen, onClose, chunks }: ChunksDialogProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isRTL ? "left" : "right"}
        className="w-[90%] sm:w-[540px] md:w-[680px] lg:w-[860px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-blue-500">Source Information</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4 pb-8">
          {chunks.map((chunk, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 shadow-md"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <ReactMarkdown
                className={`${isRTL ? "text-[130%]" : ""} prose dark:prose-invert max-w-none`}
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
                {chunk}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
} 