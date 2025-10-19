// apps/web/src/routes/index.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/login",
    });
  },
  component: () => <div>Carregando...</div>,
});
