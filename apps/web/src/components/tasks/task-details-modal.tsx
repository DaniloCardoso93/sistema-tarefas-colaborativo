"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useAuthStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { type Comment } from "./task-columns";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const translateStatus = (status: string) => {
  const map = {
    TODO: "A Fazer",
    IN_PROGRESS: "Em Progresso",
    REVIEW: "Em Revisão",
    DONE: "Concluída",
  };
  return map[status as keyof typeof map] || status;
};
const translatePriority = (priority: string) => {
  const map = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
    URGENT: "Urgente",
  };
  return map[priority as keyof typeof map] || priority;
};

type UserCache = {
  [id: string]: string;
};

export function TaskDetailsModal() {
  const { isDetailsModalOpen, selectedTask, closeModals } = useAuthStore();
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [userCache, setUserCache] = React.useState<UserCache>({});

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
    if (isDetailsModalOpen && selectedTask) {
      async function fetchComments() {
        setIsLoading(true);
        try {
          const response = await api.get<Comment[]>(
            `/api/tasks/${selectedTask?.id}/comments`
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
  }, [isDetailsModalOpen, selectedTask]);

  async function onSubmit(values: z.infer<typeof createCommentSchema>) {
    if (!selectedTask) return;
    try {
      const response = await api.post<Comment>(
        `/api/tasks/${selectedTask.id}/comments`,
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
    <Dialog open={isDetailsModalOpen} onOpenChange={closeModals}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedTask?.title}</DialogTitle>
          <DialogDescription>
            {selectedTask?.description || "Nenhuma descrição fornecida."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">Status:</span>
          <span>{selectedTask && translateStatus(selectedTask.status)}</span>
          <span className="text-muted-foreground">Prioridade:</span>
          <span>
            {selectedTask && translatePriority(selectedTask.priority)}
          </span>
        </div>

        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Comentários</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Adicionar um comentário..."
                        {...field}
                      />
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

          <div className="space-y-3 max-h-48 overflow-y-auto">
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
      </DialogContent>
    </Dialog>
  );
}
