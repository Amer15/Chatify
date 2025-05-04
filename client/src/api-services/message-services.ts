import { AxiosError } from "axios";
import { axiosClient } from "../config/axios-config";

export const sendMessage = async (data: FormData) => {
  try {
    await axiosClient.post("/messages/send-message", data);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          error.message ?? "something went wrong! failed to send message"
        );
      }
    }

    return error;
  }
};
