import { z } from "zod";

const sportEnum = z.enum(["running", "cycling", "calisthenics", "surf", "kitesurf"]);

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("E-mail inválido"),
    username: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    sports: z.array(sportEnum).min(1, "Selecione pelo menos um esporte").optional(),
    preferencesMode: z.enum(["default", "custom"]).optional(),
    customThresholds: z
      .array(
        z.object({
          name: z.string(),
          temperatureMin: z.number(),
          temperatureMax: z.number(),
          humidityMax: z.number(),
          windMax: z.number(),
          uvMax: z.number(),
        })
      )
      .optional(),
    favoriteLocations: z
      .array(
        z.object({
          name: z.string().min(1, "Nome do local é obrigatório"),
        })
      )
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
  }),
});