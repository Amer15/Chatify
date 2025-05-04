import { create } from "zustand";
import { User, UserChatStoreProps } from "../types";

export const useUserChatStore = create<UserChatStoreProps>()((set) => ({
  selectedUser: null,
  onlineUsers: [],
  setSelectedUser: (payload: User) => set({ selectedUser: payload }),
  removeSelectedUser: () => set({ selectedUser: null }),
  updateOnlineUsers: (payload: string[]) => set({ onlineUsers: payload }),
}));
