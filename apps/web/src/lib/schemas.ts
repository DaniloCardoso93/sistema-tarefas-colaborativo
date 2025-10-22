import { z } from "zod";

export const taskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]);
export const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const loginSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  password: z.string().min(1, {
    message: "A senha é obrigatória.",
  }),
});

export const registerSchema = z.object({
  username: z.string().min(3, {
    message: "O nome de usuário deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres.",
  }),
});

export const taskSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório." }),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório." }),
  description: z.string().optional(),
  priority: taskPriorityEnum.optional(),
  status: taskStatusEnum.optional(),
  assigneeIds: z.array(z.string().uuid()).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, { message: "O comentário não pode estar vazio." }),
});
