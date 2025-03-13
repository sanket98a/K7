"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { z } from "zod"
import { loginService, signupService } from "@/lib/auth"

import { setAuthCookie, getAuthCookie, setUserInfoCookie, clearAuthCookies, getUserInfoCookie } from "@/lib/cookies"
import { useAuthStore } from "@/state/AuthStore"
import { toast } from "sonner"

const useAuth = () => {
  const router = useRouter()
  const { userInfo, setUserInfo, clearUserInfo } = useAuthStore()
  const [isFetching, setIsFetching] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  })

  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [errorMessages, setErrorMessages] = useState<string[]>([])

  // Initialize auth state from cookies
  useEffect(() => {
    const initializeAuth = () => {
      const token = getAuthCookie()
      const userInformation = getUserInfoCookie()

      if (token && !userInfo) {
        // If we have a token in cookies but no user in state, set the user info
        setUserInfo({
          id: "token-user", 
          name: userInformation?.name,
          email: userInformation?.email,
          accessToken: token,
        })

        // fetchUserProfile(token);
      }

      setIsInitialized(true)
    }

    initializeAuth()
  }, [setUserInfo, userInfo])

  const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
  })

  const signupSchema = z.object({
    name: z.string().min(1, { message: "Please enter your name" }).trim(),
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessages([])
    const schemaTest = loginSchema.safeParse(loginInfo)

    if (!schemaTest.success) {
      setErrorMessages(Object.values(schemaTest.error.flatten().fieldErrors).flat())
      return
    }

    setIsFetching(true)
    try {
      const result = await loginService(loginInfo)

      // Store auth token in cookie
      setAuthCookie(result.access_token)

      // Store user info in cookie 
      setUserInfoCookie(result.user)
      toast.success("Welcome to K7",{description: "You have successfully logged in!"})
      // Update UserInfo global state
      setUserInfo(result.user)
      setIsFetching(false)
      setErrorMessages([])
      router.push("/dashboard/repository/documentrepo")
    } catch (error: any) {
      setIsFetching(false)
      if (error.response?.data?.detail) {
        setErrorMessages([error.response.data.detail])
      } else {
        setErrorMessages(["Something went wrong. Please try again."])
      }
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessages([])
    const schemaTest = signupSchema.safeParse(signupInfo)

    if (!schemaTest.success) {
      setErrorMessages(Object.values(schemaTest.error.flatten().fieldErrors).flat())
      return
    }

    setIsFetching(true)
    try {
      const result = await signupService(signupInfo)
      toast.success("Signup Succesfull",{description: "Please Login to your continue"})
      setIsFetching(false)
      setErrorMessages([])
      router.push("/login")
    } catch (error: any) {
      setIsFetching(false)
      if (error.response?.data?.detail) {
        setErrorMessages([error.response.data.detail])
      } else {
        setErrorMessages(["Something went wrong. Please try again."])
      }
    }
  }

  const logout = () => {
    // Clear cookies
    clearAuthCookies()
    clearUserInfo()
    router.push("/")
  }

  const isAuthenticated = (): boolean => {
    return !!getAuthCookie()
  }

  return {
    loginInfo,
    setLoginInfo,
    handleLogin,
    errorMessages,
    signupInfo,
    setSignupInfo,
    handleSignUp,
    isFetching,
    setIsFetching,
    logout,
    isAuthenticated,
    isInitialized,
  }
}

export default useAuth

