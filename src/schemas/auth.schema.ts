import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("E-mail inválido"),
    username: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
  }),
});