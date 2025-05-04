import { useQuery } from "@tanstack/react-query";
import { User } from "../types";
import { axiosClient } from "../config/axios-config";

export const sidebarUserKeys = {
  all: ["users"],
} as const;

export const useSidebarUsers = () =>
  useQuery({
    queryKey: sidebarUserKeys.all,
    queryFn: async () => {
      const { data } = await axiosClient.get<{
        total_pages: number;
        current_page: number;
        items_per_page: number;
        current_page_items: number;
        users: User[];
      }>(`/users/all-users`);
      return data;
    },
  });
