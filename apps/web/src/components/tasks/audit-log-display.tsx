"use client";

import React from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
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
type AuditLogDetails = { field?: string; oldValue?: string; newValue?: string };
type HydratedAuditLog = {
  id: string;
  action: string;
  details: AuditLogDetails;
  timestamp: Date;
  username: string;
};

const formatLogMessage = (log: HydratedAuditLog) => {
  switch (log.action) {
    case "STATUS_CHANGE":
      return (
        <>
          <strong>{log.username}</strong> alterou o status de{" "}
          <span className="font-semibold">
            {translateStatus(log.details.oldValue!)}
          </span>{" "}
          para{" "}
          <span className="font-semibold">
            {translateStatus(log.details.newValue!)}
          </span>
          .
        </>
      );
    case "PRIORITY_CHANGE":
      return (
        <>
          <strong>{log.username}</strong> alterou a prioridade de{" "}
          <span className="font-semibold">
            {translatePriority(log.details.oldValue!)}
          </span>{" "}
          para{" "}
          <span className="font-semibold">
            {translatePriority(log.details.newValue!)}
          </span>
          .
        </>
      );
    case "COMMENT_ADDED":
      return (
        <>
          <strong>{log.username}</strong> adicionou um comentário.
        </>
      );
    default:
      return (
        <>
          <strong>{log.username}</strong> realizou a ação: {log.action}.
        </>
      );
  }
};

export function AuditLogDisplay({ taskId }: { taskId: string }) {
  const [logs, setLogs] = React.useState<HydratedAuditLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!taskId) return;

    async function fetchHistory() {
      setIsLoading(true);
      try {
        const response = await api.get<HydratedAuditLog[]>(
          `/api/tasks/${taskId}/history`
        );
        setLogs(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Falha ao buscar histórico.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchHistory();
  }, [taskId]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Histórico</h3>
      <div className="space-y-3 max-h-32 overflow-y-auto">
        {isLoading && <Skeleton className="h-6 w-full" />}
        {!isLoading && logs.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum histórico de alterações.
          </p>
        )}
        {!isLoading &&
          logs.map((log) => (
            <div key={log.id} className="text-sm text-muted-foreground">
              <p>
                {formatLogMessage(log)}{" "}
                <span className="text-xs">
                  ({new Date(log.timestamp).toLocaleString("pt-BR")})
                </span>
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
