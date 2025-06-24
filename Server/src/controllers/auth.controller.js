import { profile } from "console";
import user from "../models/user.js";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
  try {
    const { fullName, email, mobileNo, password, confirmPassword, otp } =
      req.body;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Otp.",
      });
    }
    if (!fullName || !email || !mobileNo || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        messahe: "ALl fields are required for signup",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword does not match",
      });
    }
    if (password.length < 6) {
      return req.status(400).json({
        success: false,
        message: "Password must be atleast 6 character long",
      });
    }

    const recentOtp = await otp
      .findOne({ email: email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Otp expired or not found",
      });
    } else {
      if (recentOtp.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
    }

    const user = await user.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      fullName,
      email,
      password: hashedPassword,
      mobileNo,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${fullName} .`,
    };
    const response = await user.create(payload);

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Error occured in creating new user in DB",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user Created SUccessfully",
      data: response,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error in Signup controller",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await user.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found , please Signup first",
      });
    }
    const ispasswordCorrect = await bcrypt.compare(user.password, password);
    if (!ispasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    else{
      const payload = {
         email:user.email,
         _id : user._id
      }
      const Token = jwt.sign(payload,process.env.JET_SECRET,{
         expiresIn : "2h",
      })
      user.token = Token;
      user.password = undefined;

      const options = {
         expires : new Date(Date.now()+ 3 * 24 * 60 * 60 * 1000),
         httpOnly: true,
         sameSite: "strict", // CSRF attacks cross-site request forgery attacks
         secure: process.env.NODE_ENV !== "development",
      }

      res.cookie("token",Token,options).status(200).json({
         success:true,
         Token,
         data:user,
         message:"Login Successfull"
      })
   }
  } catch (e) {
   console.log(e);
   return res.status(500).json({
      success:false,
      message:"Error in Login controller"
   })
  }
};


export const logout=async (req,res)=>{
   try{
      res.cookie("token","",{maxAge:0});
      res.status(200).json({
         success:true,
         message:"Logged out successfully",
      })
   }
   catch(e){
      console.log(e);
      return res.status(500).json({
         success:false,
         message:"Error in Logout controller"
      })
   }
}


export const updateProfile = async (req,res)=>{
   try{
      const {profilePic} = req.body;
      const userId = req.user._id;
      if(!profilePic){
         return res.status(400).json({
            success:false,
            message:"Profile Pic is required"
         })
      }

      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updateduser = await user.findByIdAndUpdat(
         userId,
         {
            image:uploadResponse.secure_url,
         },
         {new:true}
      )
      return req.status(200).json({
         success:true,
         message:"profile pic updated successfully",
         data:updateduser
      })

   }
   catch(e){
      console.log(e)
      return res.status(500).json({
         success:false,
         message:"error in updateProfile"
      })
   }
}


export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const sendOtp = async(req,res)=>{
   try{
      const {email} = req.body;

      const user = await user.findOne({email:email});
      if(user) {
         return res.status(400).json({
            success:false,
            message:"user already registerd",
         })
      }
      var otp = otpGenerator.generate(6,{
         upperCaseAlphabet:false,
         lowerCaseAlphabet:false,
         specialChars:false,
      })

      const result = await otp.findOne({otp:otp});

      if(result){
         var otp = otpGenerator.generate(6,{
            upperCaseAlphabet:false,
            lowerCaseAlphabet:false,
            specialChars:false,
         })

         result = await otp.findOne({otp:otp});
      }

      const response = await otp.create({otp,email});
      return res.status(200).json({
         success:true,
         otp:response,
         message:"otp sent successfully"
      })
   }
   catch(e){
      console.log(e);
      return res.status(500).json({
         success: false,
         message: e.message,
      });
   }
}
