"use client"

import { useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ChatMessage from "./ChatMessage"
import type { Messages, ChunkMetadata } from "@/types"


interface ExtendedMessages extends Messages {
  chunks?: Record<string, ChunkMetadata>;
  isRTL: boolean;
}

interface ChatContainerProps {
  messages: ExtendedMessages[]
}

export default function ChatContainer({ messages }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  // Memoize message rendering for performance
  const renderedMessages = useMemo(
    () =>
      messages?.map((msg, index) => (
        <ChatMessage
          key={index}
          isRTL={msg.isRTL}
          message={msg.text}
          isUser={msg.isUser}
          isLoading={msg.isLoading}
          chunks={msg.chunks}
        />
      )) || [],
    [messages],
  )

  if (!messages || messages.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="chatContainer h-full hideScrollBar overflow-y-auto p-4"
      ref={scrollRef}
    >
      <AnimatePresence>{renderedMessages}</AnimatePresence>
    </motion.div>
  )
}

