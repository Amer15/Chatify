import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useUserChatStore } from "./chat-store";
import { chatKeys } from "../queries/chat-queries";
import { queryClient } from "../main";
import { Message } from "react-hook-form";

type SocketState = {
  socket: Socket | null;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
};

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connectSocket: (userId) => {
    const state = get();
    //stop connecting if already connected
    if (state.socket) return;

    const socketUrl = import.meta.env.VITE_API_SOCKET_URL;
    const socket = io(socketUrl, {
      autoConnect: false,
      transports: ["websocket"],
      query: { userId },
    });

    socket.connect();

    set({ socket });

    socket.on("online-users", (data) => {
      console.log("Online users:", data);
      const updateOnlineUsers = useUserChatStore.getState().updateOnlineUsers;
      updateOnlineUsers(data.user_ids);
    });

    socket.on("new-chat-msg", (data) => {
      const selectedUser = useUserChatStore.getState().selectedUser;

      if (selectedUser && selectedUser._id === data.senderId) {
     
        const queryKey = chatKeys.selectedUser(selectedUser._id);

        queryClient.setQueryData(
          queryKey,
          (oldData: {
            total_pages: number;
            current_page: number;
            items_per_page: number;
            current_page_items: number;
            messages: Message[];
          }) => {
            if (!oldData) return;

            return {
              ...oldData,
              messages: [...oldData.messages, data],
              current_page_items: oldData.current_page_items + 1,
            };
          }
        );
      }
    });
  },
  disconnectSocket: () => {
    set((state) => {
      if (state.socket) {
        state.socket.disconnect();
        return { socket: null };
      }
      return {};
    });
  },
}));
