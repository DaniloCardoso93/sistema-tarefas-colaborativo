"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { type Assignee, type Comment } from "./task-columns";
import { Separator } from "@/components/ui/separator";
import { CommentsSection } from "./comments-section";
import { AuditLogDisplay } from "./audit-log-display";

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
  const [userCache, setUserCache] = React.useState<UserCache>({});

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
      const userIdsToFetch = selectedTask.assignees?.map((a) => a.userId) || [];
      async function fetchCommentsAndUsers() {
        try {
          const response = await api.get<Comment[]>(
            `/api/tasks/${selectedTask?.id}/comments`
          );
          response.data.forEach((c) => userIdsToFetch.push(c.userId));
          if (userIdsToFetch.length > 0) {
            await fetchUserNames(userIdsToFetch);
          }
        } catch (error) {
          console.error(error);
          toast.error("Falha ao buscar comentários.");
        }
      }
      fetchCommentsAndUsers();
    }
  }, [isDetailsModalOpen, selectedTask]);

  return (
    <Dialog open={isDetailsModalOpen} onOpenChange={closeModals}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
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
        <div className="text-sm">
          <span className="text-muted-foreground">Atribuído a:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedTask?.assignees?.length === 0 && (
              <span className="text-sm italic text-muted-foreground">
                Ninguém
              </span>
            )}
            {selectedTask?.assignees?.map((assignee) => (
              <span
                key={assignee.id}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
              >
                {userCache[assignee.userId] || "Carregando..."}
              </span>
            ))}
          </div>
        </div>
        <Separator />
        {selectedTask && <AuditLogDisplay taskId={selectedTask.id} />}

        <Separator />
        {selectedTask && <CommentsSection taskId={selectedTask.id} />}
      </DialogContent>
    </Dialog>
  );
}
