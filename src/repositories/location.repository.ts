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

}