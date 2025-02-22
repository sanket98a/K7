"use client";

import { chatService } from "@/lib/auth";
import { useAppStore } from "@/state/store";
import { Messages } from "@/types/chat";
import { useState } from "react";



const useChat = () => {
    const {userInfo}:any = useAppStore()
    console.log(userInfo)
  const [loading,setLoading] = useState(false)
  const [messages, setMessages] = useState<Messages[]>([]);
  const [isChatActive,setIsChatActive] = useState(false)


  const handleConversation = async (prompt:string) => {
    if (!prompt.trim()) return; 
    if (!isChatActive) {
      setIsChatActive(true);
    }
    // Add user message
    setMessages((prev) => [
      ...prev,
      { text: prompt, isUser: true, isLoading: false },
    ]);
    const tempMessage = { text: "", isUser: false, isLoading: true };
    setMessages((prev) => [...prev, tempMessage]);
    // backend response from the api
    try {
      const data = await chatService(prompt,userInfo?.access_token);
      console.log(data);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          text: data.data,
          isUser: false,
          isLoading: false,
        };
        return updatedMessages;
      });
 

 

   
    } catch (error:any) {
      console.log(error);
      console.log(error.message || "something went wrong");
     
    
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          text: "Something went wrong please try again",
          isUser: false,
          isLoading: false,
        };
        return updatedMessages;
      });
      setLoading(false);
    }

    
  };
  

  return {
   messages,setMessages,handleConversation,isChatActive,setIsChatActive
  };
};

export default useChat;
