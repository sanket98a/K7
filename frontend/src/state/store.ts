import { create } from 'zustand';

export const useAppStore = create((set) => ({
  
  userInfo:{},
  setUserInfo: (userInfo:string) => set({ userInfo }),
 
  
}));
