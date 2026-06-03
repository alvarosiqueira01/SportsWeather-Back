import Cache
from "../models/WeatherCache";

import History
from "../models/WeatherHistory";
import UserSearchHistory from "../models/UserSearchHistory";

export class WeatherRepository {

 async getCache(
   lat:number,
   lon:number
 ){

   return Cache.findOne({

      lat,

      lon

   });

 }

 async saveCache(
   payload:any
 ){

   return Cache.create(
      payload
   );

 }

 async saveHistory(
   payload:any
 ){

   return History.create(
      payload
   );

 }

 async saveUserSearch(payload: any) {
    return UserSearchHistory.create(payload);
  }

}