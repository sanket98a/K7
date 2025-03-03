"use client"

import { create } from "zustand"
import type { Messages } from "@/types"

interface AppState {
  documentMessages: Messages[]
  mathMessages: Messages[]
  tabularMessages: Messages[]
  setDocumentMessages: (messages: Messages[]) => void
  setMathMessages: (messages: Messages[]) => void
  setTabularMessages: (messages: Messages[]) => void
}

export const useAppStore = create<AppState>((set) => ({
  documentMessages: [],
  mathMessages: [],
  tabularMessages: [],
  setDocumentMessages: (messages) => set({ documentMessages: messages }),
  setMathMessages: (messages) => set({ mathMessages: messages }),
  setTabularMessages: (messages) => set({ tabularMessages: messages }),
}))

