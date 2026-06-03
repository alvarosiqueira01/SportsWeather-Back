import { Request, Response }
from "express";

import FavoriteLocation
from "../models/FavoriteLocation";
import UserSearchHistory from "../models/UserSearchHistory";

export async function saveFavorite(

 req:Request,

 res:Response

){

 const userId =
   (req as any).user.userId;

 const favorite =
   await FavoriteLocation.create({

      userId,

      ...req.body

   });

 return res.json(
   favorite
 );

}

export async function getFavorites(req: Request, res: Response) {
  try {
    // Recupera o ID do usuário injetado pelo authMiddleware
    const userId = (req as any).user.userId;

    // Busca todos os favoritos vinculados a esse ID
    const favorites = await FavoriteLocation.find({ userId })
      .sort({ createdAt: -1 }); // Opcional: os mais recentes primeiro

    return res.json(favorites);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function history(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    
    const searchHistory = await UserSearchHistory.find({ userId })
      .sort({ searchedAt: -1 }); // Mais recentes primeiro

    return res.json(searchHistory);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}