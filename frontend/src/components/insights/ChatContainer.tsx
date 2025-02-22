"use client";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef, useMemo } from "react";
import { Messages } from "@/types/chat"; // Ensure correct type import

interface ChatContainerProps {
  messages: Messages[]; // Correct type
}

export default function ChatContainer({ messages }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Memoize message rendering for performance
  const renderedMessages = useMemo(
    () =>
      messages.map((msg,index) => (
        <ChatMessage
          key={index} 
          message={msg.text}
          isUser={msg.isUser}
          isLoading={msg.isLoading}
        />
      )),
    [messages]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="chatContainer h-full overflow-y-auto p-4"
      ref={scrollRef}
    >
      <AnimatePresence>{renderedMessages}</AnimatePresence>
    </motion.div>
  );
}
