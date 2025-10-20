import { useAuthStore } from "./store";
import { api } from "./api";

export const checkAuth = async () => {
  const { accessToken, logout } = useAuthStore.getState();

  if (!accessToken) {
    return { isAuthenticated: false };
  }

  try {
    await api.get("/api/auth/profile");
    return { isAuthenticated: true };
  } catch (_) {
    logout();
    return { isAuthenticated: false };
  }
};
