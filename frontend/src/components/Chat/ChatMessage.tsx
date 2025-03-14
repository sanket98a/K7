"use client";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import userImg from "@/assets/user.png";
import botImg from "@/assets/k7logo2.png";
import ReactMarkdown from "react-markdown";
import { Messages } from "@/types";
import { useLocale } from "next-intl";


export default function ChatMessage({ message, isUser, isLoading }: Messages) {
  const locale = useLocale(); 
  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 100 : -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} items-start mb-4`}
    >
      <Avatar className="w-8 h-8 md:w-10 md:h-10 bg-white">
        <AvatarImage  src={isUser ? userImg.src : botImg.src} alt={isUser ? "User" : "Bot"} />
        <AvatarFallback className="bg-blue-500">{isUser ? "U" : "B"}</AvatarFallback>
      </Avatar>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-56 rounded-full bg-slate-700" />
          <Skeleton className="h-4 w-80 rounded-full bg-slate-700" />
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          dir={locale === "ar" ? "rtl" : "ltr"}
          className={`md:max-w-[80%] text-start rounded-3xl p-2 md:p-6 ${
            isUser ? "text-slate-600 bg-white/20 " : "bg-white/90 backdrop-blur-xl text-gray-600"
          }`}
        >
          <ReactMarkdown
            className={`${locale === "ar" ? "text-[130%]" : ""}`}
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-medium">{children}</h3>,
              p: ({ children }) => <p className="mb-2">{children}</p>,
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
            }}
          >
            {message}
          </ReactMarkdown>
        </motion.div>
      )}
    </motion.div>
  );
}
