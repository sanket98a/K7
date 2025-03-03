// Zustand store for global state management
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { UserInfo } from "@/types"

interface AppState {
  userInfo: UserInfo | null
  setUserInfo: (user: UserInfo | null) => void
  clearUserInfo: () => void
}

export const useAuthStore = create<AppState>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (user) => set({ userInfo: user }),
      clearUserInfo: () => set({ userInfo: null }),
    }),
    {
      name: "authInfo",
      // Only store in memory, actual persistence will be handled by cookies
        storage: createJSONStorage(() => localStorage),
    },
  ),
)

