import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

export function DeleteTaskAlert() {
  const { isDeleteModalOpen, selectedTask, closeModals } = useAuthStore();

  async function handleDeleteTask() {
    if (!selectedTask) return;

    try {
      await api.delete(`/api/tasks/${selectedTask.id}`);
      toast.success("Tarefa excluída com sucesso!");
      closeModals();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao excluir tarefa.");
    }
  }

  return (
    <AlertDialog open={isDeleteModalOpen} onOpenChange={closeModals}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente a
            tarefa "{selectedTask?.title}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTask}
            className="bg-destructive"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
