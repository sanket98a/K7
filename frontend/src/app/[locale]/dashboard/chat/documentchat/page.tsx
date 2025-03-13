"use client"

import ChatInput from "@/components/Chat/ChatInput"
import HeroSection from "@/components/Chat/HeroSection"
import Examples from "@/components/Examples"
import ChatContainer from "@/components/Chat/ChatContainer"
import useChat from "@/hooks/use-chat"
import { useTranslations } from "next-intl"
const DocumentChatPage = () => {
  const { documentMessages, handleConversation} = useChat()
  const t = useTranslations("chat.documentChat")
  const showChat = documentMessages && documentMessages.length > 0

  return (
    <div className={`${showChat ? "py-2" : "py-20"} text-black relative overflow-hidden`}>
      <div className="max-w-3xl md:max-w-4xl w-full mx-auto sticky">
        {showChat ? (
          <div className="h-[70vh] overflow-y-hidden rounded-xl w-full mx-auto mb-2">
            <ChatContainer messages={documentMessages} />
          </div>
        ) : (
          <HeroSection title={t("title")} />
        )}

<ChatInput>
     <ChatInput.RegularSend onSend={handleConversation} />
   </ChatInput>
        {!showChat && <Examples />}
      </div>
    </div>
  )
}

export default DocumentChatPage

