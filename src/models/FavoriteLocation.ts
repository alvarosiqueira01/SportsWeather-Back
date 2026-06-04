import {
 Schema,
 model,
 Types
} from "mongoose";

const FavoriteSchema =
new Schema({

 userId: {

   type: Types.ObjectId,

   ref:"users"

 },

  name:String,

  city:String,

  coordinates: {

    type: {

       type:String,

       enum:["Point"]

    },

    coordinates:[Number]

  },

  route: [{
    type: [Number]
  }]

},{
  timestamps:true
});

FavoriteSchema.index({
 coordinates:"2dsphere"
});

export default model(
 "favorite_locations",
 FavoriteSchema
);