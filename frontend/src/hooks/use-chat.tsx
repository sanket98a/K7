"use client"

import {  useState } from "react"
import { chatService, mathChatService, tabularChatService } from "@/lib/auth"
import { useAuthStore } from "@/state/AuthStore"
import { useAppStore } from "@/state/store"

const useChat = () => {
  const { documentMessages, tabularMessages, mathMessages, setDocumentMessages, setTabularMessages, setMathMessages } =
    useAppStore()

  const { userInfo } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handleConversation = async (prompt: string) => {
    if (!prompt.trim()) return

    // Add user message
    const userMessage = { text: prompt, isUser: true, isLoading: false }
    const updatedMessages = [...(documentMessages || []), userMessage]
    setDocumentMessages(updatedMessages)

    // Add bot loading message
    const loadingMessage = { text: "", isUser: false, isLoading: true }
    const messagesWithLoading = [...updatedMessages, loadingMessage]
    setDocumentMessages(messagesWithLoading)

    try {
      const data = await chatService(prompt, userInfo?.accessToken)

      // Replace loading message with actual response
      const finalMessages = [
        ...updatedMessages,
        {
          text: data.data.response,
          isUser: false,
          isLoading: false,
        },
      ]
      setDocumentMessages(finalMessages)
    } catch (error: any) {
      console.error(error)

      // Replace loading message with error
      const errorMessages = [
        ...updatedMessages,
        {
          text: "Something went wrong please try again",
          isUser: false,
          isLoading: false,
        },
      ]
      setDocumentMessages(errorMessages)
    }
  }

  const handleTabularConversation = async (prompt: string, selectedFile: string) => {
    if (!prompt.trim()) return

    // Add user message
    const userMessage = { text: prompt, isUser: true, isLoading: false }
    const updatedMessages = [...(tabularMessages || []), userMessage]
    setTabularMessages(updatedMessages)

    // Add bot loading message
    const loadingMessage = { text: "", isUser: false, isLoading: true }
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
        },
      ]
      setTabularMessages(finalMessages)
    } catch (error: any) {
      console.error(error)

      // Replace loading message with error
      const errorMessages = [
        ...updatedMessages,
        {
          text: "Something went wrong please try again",
          isUser: false,
          isLoading: false,
        },
      ]
      setTabularMessages(errorMessages)
    }
  }

  const handleMathConversation = async (prompt: string) => {
    if (!prompt.trim()) return

    // Add user message
    const userMessage = { text: prompt, isUser: true, isLoading: false }
    const updatedMessages = [...(mathMessages || []), userMessage]
    setMathMessages(updatedMessages)

    // Add bot loading message
    const loadingMessage = { text: "", isUser: false, isLoading: true }
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
        },
      ]
      setMathMessages(finalMessages)
    } catch (error: any) {
      console.error(error)

      // Replace loading message with error
      const errorMessages = [
        ...updatedMessages,
        {
          text: "Something went wrong please try again",
          isUser: false,
          isLoading: false,
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

