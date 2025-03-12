"use client"


import type { UserInfo } from "@/types"
import Cookies from "js-cookie"
// Cookie options
const cookieOptions = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  expires: 7, // 7 days
}

// Auth token cookie name
export const AUTH_COOKIE_NAME = "auth_token"
export const USER_INFO_COOKIE_NAME = "user_info"
export const LANGUAGE_COOKIE_NAME = "language"

// Set auth token in cookie
export const setAuthCookie = (token: string): void => {
  Cookies.set(AUTH_COOKIE_NAME, token, cookieOptions)
}

// Get auth token from cookie
export const getAuthCookie = (): string | undefined => {
  return Cookies.get(AUTH_COOKIE_NAME)
}


// Remove auth token from cookie
export const removeAuthCookie = (): void => {
  Cookies.remove(AUTH_COOKIE_NAME, { path: "/" })
}

// Set user info in cookie (non-sensitive data only)
export const setUserInfoCookie = (user: UserInfo): void => {
  // Store only non-sensitive user data
  const safeUserInfo = {
    id: user.id,
    name: user.name,
    email: user.email,
  }
  Cookies.set(USER_INFO_COOKIE_NAME, JSON.stringify(safeUserInfo), cookieOptions)
}

// Get user info from cookie
export const getUserInfoCookie = (): Partial<UserInfo> | null => {
  const userInfo = Cookies.get(USER_INFO_COOKIE_NAME)
  return userInfo ? JSON.parse(userInfo) : null
}

// Remove user info from cookie
export const removeUserInfoCookie = (): void => {
  Cookies.remove(USER_INFO_COOKIE_NAME, { path: "/" })
}

// Clear all auth cookies
export const clearAuthCookies = (): void => {
  removeAuthCookie()
  removeUserInfoCookie()
}

// Set language in cookie
export const setLanguageCookie = (language: string): void => {
  Cookies.set(LANGUAGE_COOKIE_NAME, language, cookieOptions)
}

// Get language from cookie
export const getLanguageCookie = (): string => {
  return Cookies.get(LANGUAGE_COOKIE_NAME) || 'en'
}

