import { Button } from "@/components/ui/button";
import { checkAuth } from "@/lib/auth";
import { useAuthStore } from "@/lib/store";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { isAuthenticated } = await checkAuth();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardComponent,
});

function DashboardComponent() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <div className="p-4">
      <h1 className="text 2xl font-bold">Dashboard</h1>
      <p>Bem-vindo! Você está logado.</p>
      <Button onClick={handleLogout} className="mt-4">
        Sair (Logout)
      </Button>
    </div>
  );
}
