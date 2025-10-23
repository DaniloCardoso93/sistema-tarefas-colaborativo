"use client";

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import {
  createTaskSchema,
  taskPriorityEnum,
  taskStatusEnum,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import React from "react";
import { UserMultiSelect } from "./user-multi-select";
import { type Assignee } from "./task-columns";

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

export function EditTaskModal() {
  const { isEditModalOpen, selectedTask, closeModals } = useAuthStore();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      assigneeIds: [],
    },
  });

  React.useEffect(() => {
    if (selectedTask) {
      form.reset({
        title: selectedTask.title,
        description: selectedTask.description || "",
        priority: selectedTask.priority,
        status: selectedTask.status,
        assigneeIds: selectedTask.assignees.map((a: Assignee) => a.userId),
      });
    }
  }, [selectedTask, form, isEditModalOpen]);

  async function onSubmit(values: z.infer<typeof createTaskSchema>) {
    if (!selectedTask) return;
    try {
      await api.patch(`/api/tasks/${selectedTask.id}`, values);
      toast.success("Tarefa atualizada com sucesso!");
      closeModals();
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao atualizar tarefa.");
    }
  }

  return (
    <Dialog open={isEditModalOpen} onOpenChange={closeModals}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Modifique os detalhes da sua tarefa.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskStatusEnum.options.map((status) => (
                        <SelectItem key={status} value={status}>
                          {translateStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskPriorityEnum.options.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {translatePriority(priority)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigneeIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atribuir a</FormLabel>
                  <FormControl>
                    <UserMultiSelect
                      selectedUserIds={field.value || []}
                      onChange={field.onChange}
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
                ? "Salvando..."
                : "Salvar Alterações"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
