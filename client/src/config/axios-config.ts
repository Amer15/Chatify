import axios from "axios";
import { refreshToken } from "../api-services/auth-services";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  withCredentials: true
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // logoutHandler();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
