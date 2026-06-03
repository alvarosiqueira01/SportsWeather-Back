import dotenv from "dotenv";

dotenv.config();

export const env = {

   PORT:
      process.env.PORT || 8080,

   JWT_SECRET:
      process.env.JWT_SECRET!,

   MONGO_URI:
      process.env.MONGO_URI!

};