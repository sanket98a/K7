'use client'

import ChatInput from "@/components/Chat/ChatInput";
import HeroSection from "@/components/Chat/HeroSection";
import Examples from "@/components/Examples";
import ChatContainer from "@/components/Chat/ChatContainer";
import useChat from "@/hooks/use-chat";
import { useTranslations } from "next-intl";

const MathChat = () => {
  const { mathMessages, handleMathConversation } = useChat();
  const t = useTranslations('chat.mathChat');
  const showChat = mathMessages && mathMessages.length > 0;
  
  return (
    <div className={`${showChat?"py-2":'py-20'} text-black relative overflow-hidden"`}>
      <div className="max-w-3xl md:max-w-4xl w-full mx-auto sticky">
        {showChat ? (
          <div className="h-[70vh] overflow-y-hidden rounded-xl w-full mx-auto mb-2">
            <ChatContainer messages={mathMessages} />
          </div>
        ) : (
          <HeroSection title={t('title')} />
        )}

<ChatInput>
     <ChatInput.RegularSend onSend={handleMathConversation} />
   </ChatInput>
        {!showChat && <Examples />}
      </div>
    </div>
  );
};
export default MathChat;
