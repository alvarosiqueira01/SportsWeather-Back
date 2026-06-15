import {
 Schema,
 model,
 Types
} from "mongoose";

const UserPreferenceSchema =
new Schema({

 userId: {

   type: Types.ObjectId,

   ref:"users",

   required:true
 },

 sports:[{

   name:String,

   temperatureMin:Number,

   temperatureMax:Number,

   humidityMax:Number,

    windMax:Number

  }]

},{
 timestamps:true
});

export default model(
 "user_preferences",
 UserPreferenceSchema
);