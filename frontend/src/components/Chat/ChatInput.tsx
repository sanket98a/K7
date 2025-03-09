"use client";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {SendHorizontal } from "lucide-react";

import { TabularDropDown } from "../Repository/tabular-dropdown";

interface ChatInputProps{

  onSendMessages:(message:string,file?:string)=>void
  isTabular?:boolean
 
}

const ChatInput = ({onSendMessages,isTabular=false}:ChatInputProps) => {
  // const {handleConversation} = useChat()
  const [prompt,setPrompt] = useState('')
  const [selected,setSelected] = useState('')
  return (
    <div className="max-w-3xl mx-auto relative">
     

      <div className="relative bg-white border-blue-500  border-2 rounded-3xl ">
        <Textarea
          className="w-full h-16 hideScrollBar p-6 rounded-3xl focus-visible:ring-0 relative z-10 focus:border-b-0  resize-none border-0 shadow-none outline-0 "
          placeholder="What would you like to chat about?"
          onChange={(e)=>setPrompt(e.target.value)}
        
        />
        <div className="sendButton flex justify-end gap-4 transition-all ease-in  items-center p-1 mr-1">
         {isTabular && <TabularDropDown setSelectedFile={setSelected} />}
          <Button
            variant="outline"
            onClick={()=>onSendMessages(prompt,selected)}
            onKeyDown={(e)=>e.key === 'Enter' && onSendMessages(prompt,selected)}
            className="  rounded-full  bg-blue-700 hover:text-white transition-all ease-in hover:bg-blue-500 text-white"
          >
            <SendHorizontal
              className="h-16 w-16"
              strokeWidth={2.5}
              absoluteStrokeWidth
            />
            <span className="font-semibold">Send</span>
          </Button>

          {/* <Button size="icon" variant="secondary" className={` bg-blue-700 hover:text-white transition-all ease-in hover:bg-blue-500 text-white rounded-full`}>
            <Mic className="h-8 w-8 font-bold" />
          </Button> */}

          {/* <Button
                    size="icon"
                    variant="secondary"
                    className="bg-red-500 hover:bg-red-500 animate-pulse transition-all ease-in rounded-full"
                    
                  >
                    {" "}
                    <Mic className=" text-white" />
                  </Button> */}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
