import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

export const dbConnect = ()=>{
   mongoose.connect(process.env.MONGODB_URI,{
      
   })
   .then(()=>console.log("DB connection was done Successfully"))
   .catch((e)=>{
      console.log(e);
      console.log("error in making connection with the db");
      process.exit(1);
   })
}

