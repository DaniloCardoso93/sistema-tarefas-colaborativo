import * as React from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { checkAuth } from "@/lib/auth";
import { LogOut, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { columns, type Task } from "@/components/tasks/task-columns";
import { TaskTable } from "@/components/tasks/task-table";
import { CreateTaskModal } from "@/components/tasks/create-task-modal";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { taskPriorityEnum, taskStatusEnum } from "@/lib/schemas";
import { TaskTableSkeleton } from "@/components/tasks/task-table-skeleton";
import { EditTaskModal } from "@/components/tasks/edit-task-modal";
import { DeleteTaskAlert } from "@/components/tasks/delete-task-alert";
import { TaskDetailsModal } from "@/components/tasks/task-details-modal";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { isAuthenticated } = await checkAuth();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardComponent,
});

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

function DashboardComponent() {
  const { logout, closeModals } = useAuthStore();
  const navigate = useNavigate();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");

  const fetchTasks = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      const response = await api.get<Task[]>(`/api/tasks?${params.toString()}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  React.useEffect(() => {
    fetchTasks();
    socket.connect();

    const onNewTask = (newTask: Task) => {
      toast.success("Nova Tarefa Recebida!", { description: newTask.title });
      fetchTasks();
    };
    const onUpdateTask = (updatedTask: Task) => {
      toast.info("Tarefa Atualizada!", { description: updatedTask.title });
      fetchTasks();
    };
    const onDeleteTask = (deletedTask: { id: string }) => {
      toast.error("Uma tarefa foi excluída.");
      setTasks((current) => current.filter((t) => t.id !== deletedTask.id));
    };

    socket.on("new_task", onNewTask);
    socket.on("updated_task", onUpdateTask);
    socket.on("task_deleted", onDeleteTask);

    return () => {
      socket.off("new_task", onNewTask);
      socket.off("updated_task", onUpdateTask);
      socket.off("task_deleted", onDeleteTask);
      socket.disconnect();
      closeModals();
    };
  }, [fetchTasks, closeModals]);

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  function handleTaskCreated() {
    setIsModalOpen(false);
    fetchTasks();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">Jungle Gaming Task Manager</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold">Meu Dashboard de Tarefas</h2>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {taskStatusEnum.options.map((status) => (
                  <SelectItem key={status} value={status}>
                    {translateStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por prioridade..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                {taskPriorityEnum.options.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {translatePriority(priority)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Nova Tarefa
            </Button>
          </div>
        </div>

        {isLoading ? (
          <TaskTableSkeleton />
        ) : (
          <TaskTable columns={columns} data={tasks} />
        )}

        <CreateTaskModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onTaskCreated={handleTaskCreated}
        />
        <EditTaskModal />
        <DeleteTaskAlert />
        <TaskDetailsModal />
      </main>
    </div>
  );
}
