import { z } from "zod";

export const saveFavoriteLocationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty("O nome do local é obrigatório")
      .min(2, "O nome deve ter pelo menos 2 caracteres"),
      
    city: z
      .string()
      .nonempty("A cidade é obrigatória")
      .min(2, "A cidade deve ter pelo menos 2 caracteres"),
      
    coordinates: z.object({
      type: z.literal("Point", {
        message: "O tipo de coordenada GeoJSON deve ser 'Point'",
      }),
      // No GeoJSON o padrão de array é obrigatoriamente: [longitude, latitude]
      coordinates: z
        .array(z.number())
        .length(2, "As coordenadas precisam conter exatamente [longitude, latitude]")
        .refine(
          ([lon, lat]) => lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90,
          { message: "Valores de Longitude (-180 a 180) ou Latitude (-90 a 90) inválidos" }
        ),
    }),
  }),
});

// Caso precise validar o ID passado na URL para buscar os favoritos de um usuário
export const getFavoritesParamsSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID do usuário inválido (Formato ObjectId requerido)"),
  }),
});