import { create } from "zustand";

import toast from "react-hot-toast";
import { apiConnector } from "../lib/apiConnector";

const BASE_URL = "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  beforeSignUpData: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  onlineUsers: [],
  Socket: null,

  setBeforeSignUpData: async (data) => {
    set({ beforeSignUpData: data });
  },

  sendVerifyEmailotp: async (email, navigate) => {
    set({ isSigningUp: true });
    if (!email) {
      throw new Error("Email is required");
    }
    try {
      const response = await apiConnector("POST", BASE_URL + "/sendotp", email);
      if (!response?.data?.success) {
        throw new Error("Failed to send otp");
      } else {
        navigate("/verifyemail");
      }
    } catch (e) {
      console.log(e);
      console.log("error occured in the sendVeruEmailOtp in zustand store");
    } finally {
      set({ isSigningUp: false });
    }
  },

  checkAuth: async () => {
    try {
      const res = await apiConnector("GET","/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  SignUp: async (
    { fullName, email, password, confirmPassword, otp }) => {
    set({ isSigningUp: true });
    try {
      const payload = { fullName, email, password, confirmPassword, otp };
      const response = await apiConnector("POST", "/auth/signup", payload);
      if (response?.data?.success) {
        set({ authUser: response.data });
      }
      toast.success("Account created Successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login : async({email,password})=>{
   set({isLoggingIn:true});
   try{
      const res = await apiConnector("POST","/auth/login",{email,password});
      set({authUser:res.data});
      toast.success("Logged in Successfully");

      get().connectSocket();
   }
   catch(e){
      toast.error(e.response.data.message);
    } 
    finally {
      set({ isLoggingIn: false });
    }
  },

  logout : async()=>{
   try{
      await apiConnector("POST","/auth/logout");
      set({authUser:null});
      toast.success("logged out successfully");
      get().dissconnectSocket();
   }
   catch(e){
      toast.error(e.response.data.message);
   }
  },
  updateProfile:async(data)=>{
   set({isUpdatingProfile:true});
   try{
      const res = await apiConnector("PUT","/auth/update-profile",data);
      set({authUser:res.data});
      toast.success("User profile Updated Successfully")
   }
   catch(e){
      console.log("error occured in updating profile in the store",e);
      toast.error(e.response.data.message);
   }
   finally{
      set({isUpdatingProfile:false});
   }
  },
   connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
