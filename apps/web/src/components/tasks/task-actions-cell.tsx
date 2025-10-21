"use client";

import { type Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { type Task } from "./task-columns";

export function TaskActionsCell({ row }: { row: Row<Task> }) {
  const task = row.original;
  const { openDeleteModal, openEditModal, openDetailsModal } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => openDetailsModal(task)}>
          Ver Detalhes & Comentários
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openEditModal(task)}>
          Editar Tarefa
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => openDeleteModal(task)}
          className="text-red-500"
        >
          Excluir Tarefa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
