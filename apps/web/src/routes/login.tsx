import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/schemas";
import { api } from "@/lib/api";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/lib/store";
import { redirect } from "@tanstack/react-router";
import { checkAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const { isAuthenticated } = await checkAuth();
    if (isAuthenticated) throw redirect({ to: "/dashboard" });
  },
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await api.post<{
        accessToken: string;
        refreshToken: string;
      }>("/api/auth/login", values);
      login(response.data);
      toast.success("Login realizado com sucesso!");
      navigate({ to: "/" });
    } catch (error) {
      let errorMessage = "Ocorreu um erro inesperado. Tente novamente.";
      if (isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message || "E-mail ou senha inválidos.";
      }
      toast.error("Falha no login", {
        description: errorMessage,
      });
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Entre com seu e-mail e senha para acessar a plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link to="/register" className="underline">
              Registrar-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
