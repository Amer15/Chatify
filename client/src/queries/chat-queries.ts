import { useQuery } from "@tanstack/react-query";
import { Message } from "../types";
import { axiosClient } from "../config/axios-config";

export const chatKeys = {
  all: ["chat"],
  selectedUser: (selectedUserId: string) => ["chat", selectedUserId],
} as const;

export const useChat = (id: string) =>
  useQuery({
    queryKey: chatKeys.selectedUser(id),
    queryFn: async () => {
      const { data } = await axiosClient.get<{
        total_pages: number;
        current_page: number;
        items_per_page: number;
        current_page_items: number;
        messages: Message[];
      }>(`/messages/private-chat`, {
        params: {
          receiver_id: id,
        },
      });
      return data;
    },
    enabled: id !== "",
  });
