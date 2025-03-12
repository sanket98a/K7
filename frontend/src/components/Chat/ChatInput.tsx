"use client";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { SendHorizontal } from "lucide-react";
import { TabularDropDown } from "../Repository/tabular-dropdown";
import { useTranslations, useLocale } from "next-intl";

interface ChatInputProps {
  onSendMessages?: (message: string) => Promise<void>;
  onTabularSendMessages?: (message: string, file: string) => Promise<void>;
  isTabular?: boolean;
}

const ChatInput = ({ onSendMessages, onTabularSendMessages, isTabular = false }: ChatInputProps) => {
  const [prompt, setPrompt] = useState('');
  const [selected, setSelected] = useState('');
  const t = useTranslations('chat.input');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="max-w-3xl mx-auto relative">
      <div className={`relative bg-white border-blue-500 border-2 rounded-3xl ${isRTL ? 'rtl' : 'ltr'}`}>
        <Textarea
          className="w-full h-16 hideScrollBar p-6 rounded-3xl focus-visible:ring-0 relative z-10 focus:border-b-0 resize-none border-0 shadow-none outline-0"
          placeholder={t('placeholder')}
          onChange={(e) => setPrompt(e.target.value)}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <div className={`sendButton flex ${isRTL ? 'justify-start' : 'justify-end'} gap-4 transition-all ease-in items-center p-1 ${isRTL ? 'ml-1' : 'mr-1'}`}>
          {isTabular && <TabularDropDown setSelectedFile={setSelected} />}
        {isTabular?<Button
            variant="outline"
            onClick={() => onTabularSendMessages?.(prompt, selected)}
            onKeyDown={(e) => e.key === 'Enter' && onTabularSendMessages?.(prompt, selected)}
            className="rounded-full bg-blue-700 hover:text-white transition-all ease-in hover:bg-blue-500 text-white"
          >
            <SendHorizontal
              className="h-16 w-16"
              strokeWidth={2.5}
              absoluteStrokeWidth
            />
            <span className="font-semibold">{t('sendButton')}</span>
          </Button>  :<Button
            variant="outline"
            onClick={() => onSendMessages?.(prompt)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessages?.(prompt)}
            className="rounded-full bg-blue-700 hover:text-white transition-all ease-in hover:bg-blue-500 text-white"
          >
            <SendHorizontal
              className="h-16 w-16"
              strokeWidth={2.5}
              absoluteStrokeWidth
            />
            <span className="font-semibold">{t('sendButton')}</span>
          </Button>}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
