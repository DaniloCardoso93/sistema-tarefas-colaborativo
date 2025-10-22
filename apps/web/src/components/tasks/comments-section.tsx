// apps/web/src/components/tasks/comments-section.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { createCommentSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { type Comment } from "./task-columns";
import { Skeleton } from "@/components/ui/skeleton";

type UserCache = { [id: string]: string };

export function CommentsSection({ taskId }: { taskId: string }) {
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [userCache, setUserCache] = React.useState<UserCache>({});
  const [isLoading, setIsLoading] = React.useState(true);

  const form = useForm<z.infer<typeof createCommentSchema>>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: "" },
  });

  const fetchUserNames = async (userIds: string[]) => {
    console.log("passei daqui");
    const uniqueIds = [...new Set(userIds)];
    const newUsers: UserCache = {};
    for (const id of uniqueIds) {
      if (!userCache[id]) {
        try {
          console.log("entrei");
          console.log(userCache[id]);
          const res = await api.get<{ username: string }>(`/api/users/${id}`);
          newUsers[id] = res.data.username;
        } catch {
          newUsers[id] = "Usuário Desconhecido";
        }
      }
    }
    setUserCache((currentCache) => ({ ...currentCache, ...newUsers }));
  };

  React.useEffect(() => {
    if (taskId) {
      async function fetchComments() {
        setIsLoading(true);
        try {
          const response = await api.get<Comment[]>(
            `/api/tasks/${taskId}/comments`
          );
          setComments(response.data);
          const userIds = response.data.map((c) => c.userId);
          if (userIds.length > 0) {
            await fetchUserNames(userIds);
          }
        } catch (error) {
          console.error(error);
          toast.error("Falha ao buscar comentários.");
        } finally {
          setIsLoading(false);
        }
      }
      fetchComments();
    }
  }, [taskId]);

  async function onSubmit(values: z.infer<typeof createCommentSchema>) {
    try {
      const response = await api.post<Comment>(
        `/api/tasks/${taskId}/comments`,
        values
      );
      const newComment = response.data;
      setComments((prevComments) => [...prevComments, newComment]);
      if (!userCache[newComment.userId]) {
        await fetchUserNames([newComment.userId]);
      }
      toast.success("Comentário adicionado!");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao adicionar comentário.");
    }
  }

  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0">
      <h3 className="text-lg font-semibold">Comentários</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Adicionar um comentário..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Enviar
          </Button>
        </form>
      </Form>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {isLoading && <Skeleton className="h-10 w-full" />}
        {!isLoading && comments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum comentário ainda.
          </p>
        )}
        {!isLoading &&
          comments.map((comment) => (
            <div
              key={comment.id}
              className="text-sm p-3 bg-secondary rounded-md"
            >
              <p className="font-bold">
                Usuário {userCache[comment.userId] || "Carregando..."}...
              </p>
              <p>{comment.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(comment.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
