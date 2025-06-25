import jwt from "jsonwebtoken"
import User from "../models/user.js"
import dotenv from "dotenv"
dotenv.config();

export const protectRoute = async(req,res,next)=>{
   try{
      const token = req.cookies.token;

      if(!token){
         return res.status(401).json({
            success:false,
            message:"Unauthorized - No Token Provided"
         })
      }
      const decoded = jwt.verify(token,process.env.JWT_SECRET);

      if (!decoded) {
         return res.status(401).json({ message: "Unauthorized - Invalid Token" });
      }
      // console.log(decoded)

      const user = await User.findById(decoded._id).select("-password");
      if(!user){
         return res.status(401).json({
            message:"User not found"
         })
      }

      req.user = user;

      next();
   }
   catch(e){
      console.log(e);
      return res.status(500).json({
         success:false,
         message:"Error in protectRoute middleWare"
      })
   }
}