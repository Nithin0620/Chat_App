import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useAuthStore } from "../store/useAuthStore";

import {beforeSignUpData ,SignUpfunction} from  useAuthStore();
import { Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [loading , setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const {fullName , email , password , confirmPassword} = beforeSignUpData;
      const payload = {
         fullName , email , password , confirmPassword , otp
      }
      const response = await SignUpfunction(payload , navigate);

      if(!response?.data?.success){
         toast.error("Some Error occured");
      }
      if (response?.data?.success) {
         toast.success("Email Verified and Signup Successful!");
         navigate("/login");
      } 
      else {
         toast.error("Invalid OTP or Signup Failed.");
      }
    }
    catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } 
    finally {
      setLoading(false);
    }
    // Add OTP verification logic here
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="max-w-[500px] w-full shadow-lg rounded-lg p-6 md:p-8 border">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Verify Email</h1>
        <p className="text-base md:text-lg mb-6">
          A verification code has been sent to your email. Enter the code below.
        </p>

        <form onSubmit={handleSubmit}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputType="number"
            shouldAutoFocus
            renderInput={(props) => (
              <input
                {...props}
                placeholder="-"
                style={{
                  boxShadow: "inset 0px -1px 0px",
                }}
                className="w-[48px] lg:w-[60px] border rounded-[0.5rem] aspect-square text-center focus:outline"
              />
            )}
            containerStyle={{
              justifyContent: "space-between",
              gap: "5px",
            }}
          />

          <button
            type="submit"
            className="w-full mt-6 font-medium py-2 px-4 rounded-lg border transition duration-300 disabled:opacity-50"
          >
            {loading ? <div><Loader2 className="size-5 animate-spin" /> Loading...</div> : "Verify Email" }
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <div
            className="flex items-center gap-2 cursor-pointer transition"
            onClick={() => navigate("/signup")}
          >
            <BiArrowBack className="text-lg" />
            Back to Signup
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer transition"
            onClick={() => {
              alert("Resend OTP triggered");
            }}
          >
            <RxCountdownTimer className="text-lg" />
            Resend Code
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
