import { Request, Response } from "express";
import User from "../models/User";
import UserPreferences from "../models/UserPreference"; // Ajustado para o arquivo padrão de preferências

// Retorna o perfil do usuário atual (sem expor a senha criptografada)
export async function profile(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Atualiza ou insere (upsert) as regras de conforto climático do usuário
export async function updatePreferences(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { sports } = req.body;

    // Procura as preferências do usuário, se não existirem, cria uma nova (upsert: true)
    const preferences = await UserPreferences.findOneAndUpdate(
      { userId },
      { sports },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json({
      message: "Climate preferences updated successfully",
      preferences
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}