import mongoose from "mongoose"
import {mailTamplet} from "../tamplet/mailTamplet.js"
import {sendEmail} from "../utility/mailSender.js"


const otpSchema = new mongoose.Schema({
   otp:{
      type:String,
      required:true,
   },
   email:{
      type:String,
      required:true,
   },
   createdAt:{
      type:Date,
      default:Date.now(),
      expires: 5*60
   }
})


const sendVerificationemail = async(email,otp)=>{
   try{
      const mailResponse = await sendEmail(
         email,
         "Verification email",
         mailTamplet(otp),
      )
      return mailResponse;
   }
   catch(e){
      console.log("Error occured in sending verification email for otp in otp schema",e);
   }
}



otpSchema.pre("save",async function(next){
   if(this.isNew){
      await sendVerificationemail(this.email , this.otp);
   }
   next();
})


module.exports = mongoose.model("Otp",otpSchema);