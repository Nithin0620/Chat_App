import { create } from "zustand";

import toast from "react-hot-toast";
import { apiConnector } from "../lib/apiConnector";

const BASE_URL ="http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  beforeSignUpData:null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  onlineUsers: [],
  Socket: null,

   setBeforeSignUpData:async(data)=>{
      set({beforeSignUpData:data})
   },

   sendVerifyEmailotp : async(email,navigate)=>{
      set({isSigningUp:true});
      if(!email){
         throw new Error("Email is required");
      }
      try{
         const response = await apiConnector("POST",BASE_URL+"/sendotp",email);
         if(!response?.data?.success){
            throw new Error ("Failed to send otp");
         }
         else{
            navigate("/verifyemail")
         }
      }
      catch(e){
         console.log(e)
         console.log("error occured in the sendVeruEmailOtp in zustand store")
      }
      finally{
         set({isSigningUp:false})
      }
   },

   SignUpfunction: async({fullName , email , password , confirmPassword , otp} , navigate)=>{
      try{

      }
      catch(e){

      }
      finally{
         
      }
   },

  checkAuth: async () => {
   try {

   } 
   catch (error) {
   
   }
  },
}));
