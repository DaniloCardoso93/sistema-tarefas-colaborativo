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
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true);
        const response = await api.get<Task[]>("/api/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();

    socket.connect();

    socket.on("new_task", (newTask: Task) => {
      console.log("Recebeu um evento new_task!", newTask);
      toast.success("Nova Tarefa Recebida!", {
        description: newTask.title,
      });
      setTasks((currentTasks) => [newTask, ...currentTasks]);
    });
    socket.on("updated_task", (updatedTask: Task) => {
      console.log("Recebeu um evento updated_task!", updatedTask);
      toast.info("Tarefa Atualizada!", {
        description: updatedTask.title,
      });
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    });

    return () => {
      socket.off("new_task");
      socket.off("updated_task");
      socket.disconnect();
    };
  }, []);

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  function handleTaskCreated() {
    setIsModalOpen(false);
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Meu Dashboard de Tarefas</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Nova Tarefa
          </Button>
        </div>
        {isLoading ? (
          <p>Carregando tarefas...</p>
        ) : (
          <TaskTable columns={columns} data={tasks} />
        )}
        <CreateTaskModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onTaskCreated={handleTaskCreated}
        />
      </main>
    </div>
  );
}
