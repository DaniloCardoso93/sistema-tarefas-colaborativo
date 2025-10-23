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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
import { type Task } from "./task-columns";
import { UserMultiSelect } from "./user-multi-select";

interface CreateTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: (newTask: Task) => void;
}

export function CreateTaskModal({
  isOpen,
  onOpenChange,
  onTaskCreated,
}: CreateTaskModalProps) {
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      assigneeIds: [],
    },
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

  async function onSubmit(values: z.infer<typeof createTaskSchema>) {
    try {
      const response = await api.post("/api/tasks", values);
      toast.success("Tarefa criada com sucesso!");
      onTaskCreated(response.data);
      onOpenChange(false);
      form.reset();
    } catch (erro) {
      if (erro) toast.error("Falha ao criar tarefa.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os detalhes da sua nova tarefa.
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
                    <Input
                      placeholder="Ex: Implementar autenticação"
                      {...field}
                    />
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
                    <Input
                      placeholder="Ex: Usar JWT e Passport.js..."
                      {...field}
                    />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {" "}
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma prioridade" />
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
              {form.formState.isSubmitting ? "Criando..." : "Criar Tarefa"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
