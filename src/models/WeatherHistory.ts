import {
 Schema,
 model
} from "mongoose";

const schema =
new Schema({

 location:{

   type:{
      type:String,
      enum:["Point"]
   },

   coordinates:[Number]

 },

 capturedAt:Date,

 temperature:Number,

 humidity:Number,

 wind:Number,

 provider:String

});

export default model(
 "weather_history",
 schema
);