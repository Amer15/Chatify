import axios, { AxiosError } from "axios";
import { axiosClient } from "../config/axios-config";
import { User } from "../types";
import { useUserStore } from "../store/user-store";

export const registerUser = async (data: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    await axiosClient.post("/users/signup", data);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          error.message ?? "something went wrong! failed to register"
        );
      }
    }

    return error;
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const res = await axiosClient.post("/users/login", data);
    const user: User = res.data.user;
    const setUser = useUserStore.getState().setUser;
    setUser(user);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          error.message ?? "something went wrong! failed to login"
        );
      }
    }

    return error;
  }
};

export const refreshToken = async () => {
  try {
    await axios.post("/refresh-access-token");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          error.message ?? "something went wrong! failed to refresh token"
        );
      }
    }

    return error;
  }
};

export const logoutUser = async () => {
  try {
    await axiosClient.post("/users/logout");
    const removeUser = useUserStore.getState().removeUser;
    removeUser();
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          error.message ?? "something went wrong! failed to refresh token"
        );
      }
    }

    return error;
  }
};
