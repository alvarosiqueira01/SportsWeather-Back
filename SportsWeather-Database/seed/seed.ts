import "dotenv/config";

import mongoose from "mongoose";

import bcrypt from "bcrypt";

async function seed(){

 await mongoose.connect(
   process.env.MONGO_URI!
 );

 const db =
   mongoose.connection.db;

 const hash =
   await bcrypt.hash(
      "123456",
      10
   );

 const users =
 await db.collection("users")
 .insertMany([

 {

   email:"athlete@test.com",

   username:"runner",

   passwordHash:hash,

   role:"user",

   status:"active",

   createdAt:new Date()

 },

 {

   email:"admin@test.com",

   username:"admin",

   passwordHash:hash,

   role:"admin",

   status:"active",

   createdAt:new Date()

 }

 ]);

 const athleteId =
   users.insertedIds["0"];

 await db.collection(
   "user_preferences"
 ).insertOne({

   userId:athleteId,

   notificationsEnabled:true,

   sports:[{

      name:"running",

      temperatureMin:18,

      temperatureMax:28,

      humidityMax:80,

      windMax:20

   }]

 });

 await db.collection(
   "favorite_locations"
 ).insertMany([

 {

   userId:athleteId,

   name:"Beira Mar",

   city:"Fortaleza",

   coordinates:{

      type:"Point",

      coordinates:[
        -38.504,
        -3.717
      ]

   }

 },

 {

   userId:athleteId,

   name:"Praia do Futuro",

   city:"Fortaleza",

   coordinates:{

      type:"Point",

      coordinates:[
        -38.448,
        -3.731
      ]

   }

 }

 ]);

 await db.collection(
   "weather_cache"
 ).insertOne({

   lat:-3.717,

   lon:-38.504,

   provider:"openmeteo",

   timestamp:new Date(),

   temperature:29,

   humidity:72,

   windSpeed:15,

   uv:8,

   rainProbability:20

 });

 const weatherDocs = [];

 for(let i=0;i<50;i++){

   weatherDocs.push({

      location:{

        type:"Point",

        coordinates:[
          -38.504,
          -3.717
        ]

      },

      capturedAt:
       new Date(),

      temperature:
       25 + Math.random()*8,

      humidity:
       60 + Math.random()*30,

      wind:
       10 + Math.random()*15,

      provider:
       "openmeteo"

   });

 }

 await db.collection(
   "weather_history"
 ).insertMany(
   weatherDocs
 );

 await db.collection(
   "user_search_history"
 ).insertOne({

   userId:athleteId,

   query:{

      city:"Fortaleza",

      coordinates:[
        -38.504,
        -3.717
      ]

   },

   searchedAt:
    new Date()

 });

 await db.collection(
   "generated_reports"
 ).insertOne({

   userId:athleteId,

   type:"weekly-report",

   s3Key:
   "reports/week1.pdf",

   createdAt:
    new Date()

 });

 await db.collection(
   "system_logs"
 ).insertOne({

   service:
    "seed",

   level:
    "info",

   message:
    "Database populated",

   timestamp:
    new Date()

 });

 console.log(
   "Database populated"
 );

 process.exit(0);

}

seed();