"use client"

import ChatInput from "@/components/Chat/ChatInput"
import HeroSection from "@/components/Chat/HeroSection"
import Examples from "@/components/Examples"
import ChatContainer from "@/components/Chat/ChatContainer"
import useChat from "@/hooks/use-chat"

const TabularChatPage = () => {
  const { tabularMessages, handleTabularConversation } = useChat()

  const showChat = tabularMessages && tabularMessages.length > 0

  return (
    <div className={`${showChat ? "py-2" : "py-20"} text-black relative overflow-hidden`}>
      <div className="max-w-3xl md:max-w-4xl w-full mx-auto sticky">
        {showChat ? (
          <div className="h-[70vh] overflow-y-hidden rounded-xl w-full mx-auto mb-2">
            <ChatContainer messages={tabularMessages} />
          </div>
        ) : (
          <HeroSection title="Transform data into dynamic conversations" />
        )}

        <ChatInput isTabular={true} onSendMessages={handleTabularConversation} />
        {!showChat && <Examples />}
      </div>
    </div>
  )
}

export default TabularChatPage

