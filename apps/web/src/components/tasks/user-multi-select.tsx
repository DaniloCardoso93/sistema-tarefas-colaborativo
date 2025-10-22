"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/lib/api";
import { toast } from "sonner";

type User = {
  id: string;
  username: string;
  email: string;
};

interface UserMultiSelectProps {
  selectedUserIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function UserMultiSelect({
  selectedUserIds,
  onChange,
}: UserMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get<User[]>("/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Falha ao carregar lista de usuários.");
      }
    }
    fetchUsers();
  }, []);

  const handleSelect = (userId: string) => {
    let newSelectedIds: string[];
    if (selectedUserIds.includes(userId)) {
      newSelectedIds = selectedUserIds.filter((id) => id !== userId);
    } else {
      newSelectedIds = [...selectedUserIds, userId];
    }
    onChange(newSelectedIds);
  };

  const getSelectedUsernames = () => {
    if (selectedUserIds.length === 0) return "Atribuir usuários...";
    if (selectedUserIds.length > 2)
      return `${selectedUserIds.length} usuários selecionados`;

    return users
      .filter((user) => selectedUserIds.includes(user.id))
      .map((user) => user.username)
      .join(", ");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{getSelectedUsernames()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Procurar usuário..." />
          <CommandList>
            <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.username}
                  onSelect={() => handleSelect(user.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUserIds.includes(user.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {user.username} ({user.email})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
