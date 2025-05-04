import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, UserStoreProps } from "../types";

export const useUserStore = create<UserStoreProps>()(
  persist(
    (set) => ({
      isAuth: false,
      user: null,
      setUser: (payload: User) => set({ isAuth: true, user: payload }),
      updateUser: (payload: User) => set({ user: payload }),
      removeUser: () => set({ isAuth: false, user: null }),
    }),
    {
      name: "mca-u-auth",
      partialize: (state) => ({
        isAuth: state.isAuth,
        user: state.user,
      }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);
