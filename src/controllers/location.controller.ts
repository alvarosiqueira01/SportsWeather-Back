import { Request, Response }
from "express";

import FavoriteLocation
from "../models/FavoriteLocation";
import UserSearchHistory from "../models/UserSearchHistory";
import { LocationRepository } from "../repositories/location.repository";

const repo = new LocationRepository();

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
    const userId = (req as any).user.userId;

    const favorites = await FavoriteLocation.find({ userId })
      .sort({ createdAt: -1 });

    return res.json(favorites);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getNearbyFavorites(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const lat = parseFloat(String(req.query.lat));
    const lon = parseFloat(String(req.query.lon));
    const maxDistance = parseInt(String(req.query.maxDistance || "50000"), 10);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const nearby = await repo.findNearby(lat, lon, maxDistance, userId);
    return res.json(nearby);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteFavorite(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const deleted = await repo.deleteFavorite(id as string, userId);
    if (!deleted) {
      return res.status(404).json({ error: "Favorito não encontrado" });
    }
    return res.json({ message: "Favorito removido" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function history(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    
    const searchHistory = await UserSearchHistory.find({ userId })
      .sort({ searchedAt: -1 });

    return res.json(searchHistory);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}