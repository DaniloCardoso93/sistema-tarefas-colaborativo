import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "./store";

export const api = axios.create({
  baseURL: "/",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
