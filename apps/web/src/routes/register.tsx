// apps/web/src/routes/register.tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { isAxiosError } from "axios";
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
import { registerSchema } from "@/lib/schemas";
import { api } from "@/lib/api";

export const Route = createFileRoute("/register")({
  component: RegisterComponent,
});

function RegisterComponent() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await api.post("/api/auth/register", values);

      toast.success("Conta criada com sucesso!", {
        description: "Você já pode fazer o login.",
      });
      navigate({ to: "/login" });
    } catch (error) {
      let errorMessage = "Ocorreu um erro inesperado.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Erro ao criar conta.";
      }
      toast.error("Falha no registro", {
        description: errorMessage,
      });
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Registrar-se</CardTitle>
          <CardDescription>
            Crie sua conta para começar a gerenciar suas tarefas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="seu_usuario" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {form.formState.isSubmitting
                  ? "Criando conta..."
                  : "Criar conta"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
