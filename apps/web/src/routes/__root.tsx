import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: () => (
    <main className="min-h-screen flex flex-col">
      <Outlet />
      <Toaster richColors />
    </main>
  ),
});
