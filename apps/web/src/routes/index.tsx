import { createFileRoute, redirect } from "@tanstack/react-router";
import { checkAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { isAuthenticated } = await checkAuth();
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    } else {
      throw redirect({ to: "/login" });
    }
  },
});
