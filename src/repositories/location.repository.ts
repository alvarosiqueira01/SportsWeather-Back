import FavoriteLocation
from "../models/FavoriteLocation";

export class LocationRepository {

 async saveFavorite(
   payload:any
 ){

   return FavoriteLocation.create(
      payload
   );

 }

 async getFavorites(
   userId:string
 ){

   return FavoriteLocation.find({
      userId
   });

 }

 async findNearby(lat: number, lon: number, maxDistance: number, excludeUserId?: string) {
   const filter: any = {
     coordinates: {
       $nearSphere: {
         $geometry: { type: "Point", coordinates: [lon, lat] },
         $maxDistance: maxDistance,
       },
     },
   };
   if (excludeUserId) {
     filter.userId = { $ne: excludeUserId };
   }
   return FavoriteLocation.find(filter).limit(20);
 }

 async deleteFavorite(id: string, userId: string) {
   return FavoriteLocation.findOneAndDelete({ _id: id, userId });
 }

}