import app from "./app";

import { connectMongo }
from "./config/mongo";

async function bootstrap(){

   await connectMongo();

   const port =
      process.env.PORT || 8080;

   app.listen(
      port,
      ()=>{

         console.log(
            `Running ${port}`
         );

      }
   );

}

bootstrap();