"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "@/i18n/navigation"
import { getAuthCookie, getUserInfoCookie } from "@/lib/cookies"
import { useAuthStore } from "@/state/AuthStore"

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { userInfo, setUserInfo } = useAuthStore()

  useEffect(() => {
    const token = getAuthCookie()
    const userInformation = getUserInfoCookie()
    const isDashboardPath = pathname.startsWith("/dashboard")
    const isAuthPath = pathname === "/login" || pathname === "/signup"

    // If no token and trying to access dashboard, redirect to login
      if (!token && isDashboardPath) {
        router.push("/login")
        return
      }

    // If has token and trying to access login/signup, redirect to dashboard
    if (token && isAuthPath) {
      router.push("/dashboard/repository/documentrepo")
      return
    }

    // If has token but no user info in state, set basic user info
    if (token && !userInfo?.accessToken) {
      setUserInfo({
        id: "token-user",
        name: userInformation?.name,
        email: userInformation?.email,
        accessToken: token,
      })
    }
  }, [pathname, router, userInfo, setUserInfo])

  return <>{children}</>
}

