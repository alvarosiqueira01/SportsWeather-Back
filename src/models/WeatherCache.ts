import {
 Schema,
 model
} from "mongoose";

const CacheSchema =
new Schema({

 lat:Number,

 lon:Number,

 provider:String,

 temperature:Number,

 humidity:Number,

 windSpeed:Number,

 uv:Number,

 rainProbability:Number,

 rawPayload:Object,

 timestamp: {

   type:Date,

   expires:3600
 }

});

export default model(
 "weather_cache",
 CacheSchema
);