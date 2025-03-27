"use client"

import {  useState } from "react"
import { chatService, mathChatService, tabularChatService } from "@/lib/auth"
import { useAuthStore } from "@/state/AuthStore"
import { useAppStore } from "@/state/store"
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
const useChat = () => {
  const { documentMessages, tabularMessages, mathMessages, setDocumentMessages, setTabularMessages, setMathMessages } =
    useAppStore()
  const locale = useLocale();
  const toastMessages = useTranslations("messages.common")
  const { userInfo } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const isRTL = locale === "ar";

  const getFullLanguage = (locale: string) => {
    if (locale === "ar") return "Arabic";
    if (locale === "en") return "English";
    return locale;
  }

  const handleConversation = async (prompt: string) => {
    if (!prompt.trim()) return

    // Add user message
    const userMessage = { text: prompt, isUser: true, isLoading: false , isRTL }
    const updatedMessages = [...(documentMessages || []), userMessage]
    setDocumentMessages(updatedMessages)

    // Add bot loading message
    const loadingMessage = { text: "", isUser: false, isLoading: true , isRTL }
    const messagesWithLoading = [...updatedMessages, loadingMessage]
    setDocumentMessages(messagesWithLoading)
    const responseLanguage = getFullLanguage(locale);
    try {
      console.log(responseLanguage,prompt,userInfo?.accessToken);
      const data = await chatService(prompt, responseLanguage, userInfo?.accessToken)

      // Replace loading message with actual response
      const finalMessages = [
        ...updatedMessages,
        {
          text: data.data.response,
          chunks: data.data.chunks,
          isUser: false,
          isLoading: false,
          isRTL
        },
      ]
      setDocumentMessages(finalMessages)
    } catch (error: any) {
      console.error(error)

      // Replace loading message with error
      const errorMessages = [
        ...updatedMessages,
        {
          text: toastMessages("errorOccurred"),
          isUser: false,
          isLoading: false,
          isRTL
        },
      ]
      setDocumentMessages(errorMessages)
    }
  }

  const handleTabularConversation = async (prompt: string, selectedFile: string) => {
    if (!prompt.trim()) return

    // Add user message
    const userMessage = { text: prompt, isUser: true, isLoading: false , isRTL }
    const updatedMessages = [...(tabularMessages || []), userMessage]
    setTabularMessages(updatedMessages)

    // Add bot loading message
    const loadingMessage = { text: "", isUser: false, isLoading: true , isRTL }
    const messagesWithLoading = [...updatedMessages, loadingMessage]
    setTabularMessages(messagesWithLoading)
   
    try {
    
      const data = await tabularChatService(prompt, selectedFile, userInfo?.accessToken)

      // Replace loading message with actual response
      const finalMessages = [
        ...updatedMessages,
        {
          text: data.data,
          isUser: false,
          isLoading: false,
          isRTL
        },
      ]
      setTabularMessages(finalMessages)
    } catch (error: any) {
      console.error(error)

      // Replace loading message with error
      const errorMessages = [
        ...updatedMessages,
        {
          text: toastMessages("errorOccurred"),
          isUser: false,
          isLoading: false,
          isRTL
        },
      ]
      setTabularMessages(errorMessages)
    }
  }

  const handleMathConversation = async (prompt: string) => {
    if (!prompt.trim()) return

    // Add user message
    const userMessage = { text: prompt, isUser: true, isLoading: false , isRTL }
    const updatedMessages = [...(mathMessages || []), userMessage]
    setMathMessages(updatedMessages)

    // Add bot loading message
    const loadingMessage = { text: "", isUser: false, isLoading: true , isRTL}
    const messagesWithLoading = [...updatedMessages, loadingMessage]
    setMathMessages(messagesWithLoading)

    try {
      const data = await mathChatService(prompt, userInfo?.accessToken)

      // Replace loading message with actual response
      const finalMessages = [
        ...updatedMessages,
        {
          text: data.data,
          isUser: false,
          isLoading: false,
          isRTL
        },
      ]
      setMathMessages(finalMessages)
    } catch (error: any) {
      console.error(error)

      // Replace loading message with error
      const errorMessages = [
        ...updatedMessages,
        {
          text: toastMessages("errorOccurred"),
          isUser: false,
          isLoading: false,
          isRTL
        },
      ]
      setMathMessages(errorMessages)
    }
  }

  return {
    documentMessages,
    tabularMessages,
    mathMessages,
    handleConversation,
    handleTabularConversation,
    handleMathConversation,
    loading,
  }
}

export default useChat

