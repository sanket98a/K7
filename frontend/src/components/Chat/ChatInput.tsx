"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { SendHorizontal } from "lucide-react";
import { TabularDropDown } from "../Repository/tabular-dropdown";
import { useTranslations, useLocale } from "next-intl";

interface ChatInputContextType {
  prompt: string;
  setPrompt: (value: string) => void;
}

const ChatInputContext = createContext<ChatInputContextType | undefined>(undefined);

const useChatInput = () => {
  const context = useContext(ChatInputContext);
  if (!context) {
    throw new Error('useChatInput must be used within a ChatInputProvider');
  }
  return context;
};

interface ChatInputProps {
  children: ReactNode;
}

interface ChatInputSendProps {
  onSend: (message: string) => Promise<void>;
}

interface ChatInputTabularSendProps{
  onSend: (message: string,selectedFile:string) => Promise<void>;
}

const ChatInput = ({ children }: ChatInputProps) => {
  const [prompt, setPrompt] = useState('');
  const t = useTranslations('chat.input');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <ChatInputContext.Provider value={{ prompt, setPrompt }}>
      <div className="max-w-3xl mx-auto relative">
        <div className={`relative bg-white border-blue-500 border-2 rounded-3xl ${isRTL ? 'rtl' : 'ltr'}`}>
          <Textarea
            value={prompt}
            className="w-full h-16 hideScrollBar p-6 rounded-3xl focus-visible:ring-0 relative z-10 focus:border-b-0 resize-none border-0 shadow-none outline-0"
            placeholder={t('placeholder')}
            onChange={(e) => setPrompt(e.target.value)}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <div className={`sendButton flex ${isRTL ? 'justify-start' : 'justify-end'} gap-4 transition-all ease-in items-center p-1 ${isRTL ? 'ml-1' : 'mr-1'}`}>
            {children}
          </div>
        </div>
      </div>
    </ChatInputContext.Provider>
  );
};

const RegularSend = ({ onSend }: ChatInputSendProps) => {
  const t = useTranslations('chat.input');
  const { prompt, setPrompt } = useChatInput();
  
  return (
    <Button
      variant="outline"
      onClick={async () => {
        await onSend(prompt);
        setPrompt('');
      }}
     
      className="rounded-full bg-blue-700 hover:text-white transition-all ease-in hover:bg-blue-500 text-white"
    >
      <SendHorizontal
        className="h-16 w-16"
        strokeWidth={2.5}
        absoluteStrokeWidth
      />
      <span className="font-semibold">{t('sendButton')}</span>
    </Button>
  );
};

const TabularSend = ({ onSend }: ChatInputTabularSendProps) => {
  const t = useTranslations('chat.input');
  const { prompt, setPrompt } = useChatInput();
  const [selected, setSelected] = useState("");

  return (
    <>
      <TabularDropDown setSelectedFile={setSelected} />
      <Button
        variant="outline"
        onClick={async () => {
          await onSend(prompt,selected);
          setPrompt('');
        }}
     
        className="rounded-full bg-blue-700 hover:text-white transition-all ease-in hover:bg-blue-500 text-white"
      >
        <SendHorizontal
          className="h-16 w-16"
          strokeWidth={2.5}
          absoluteStrokeWidth
        />
        <span className="font-semibold">{t('sendButton')}</span>
      </Button>
    </>
  );
};

ChatInput.RegularSend = RegularSend;
ChatInput.TabularSend = TabularSend;

export default ChatInput;
