'use client'

import ChatInput from "@/components/Chat/ChatInput";
import HeroSection from "@/components/Chat/HeroSection";
import Examples from "@/components/Examples";
import ChatContainer from "@/components/insights/ChatContainer";
import useChat from "@/hooks/use-chat";

const page = () => {
  const {
    messages,
    setMessages,
    handleConversation,
    isChatActive,
    setIsChatActive,
  } = useChat();
  return (
    <div className={`${isChatActive?"py-2":'py-20'} text-black relative overflow-hidden"`}>
      <div className="max-w-3xl   md:max-w-4xl w-full mx-auto sticky">
        {isChatActive ? (
          <div className="h-[70vh] overflow-y-hidden rounded-xl  w-full mx-auto mb-2">
            <ChatContainer messages={messages} />
          </div>
        ) : (
          <HeroSection title="Chat With Document" />
        )}

        <ChatInput onSendMessages={handleConversation}  />
       {!isChatActive&& <Examples />}
      </div>
    </div>
  );
};
export default page;
