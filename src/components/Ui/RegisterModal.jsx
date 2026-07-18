import React from "react";
import { useNavigate } from 'react-router-dom';
import { Mail, Bell, BarChart3, } from "lucide-react";
// import GoogleSignInButton from "../GoogleloginButton";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {jwtDecode} from "jwt-decode";



export default function FreelancerProLogin() {

  const navigate = useNavigate();
  return (
    <div className="w-full">
      <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-xl grid grid-cols-2">
        {/* Left Panel */}
        <div className="bg-[#EEF3FF] p-12 flex flex-col justify-between">
          <div>
            
            <h2 className="flex items-center gap-2 text-sm tracking-[4px] text-blue-700 font-medium mb-14">
              <img src="/logo.png" alt="Logo" className="w-6 h-6" />
              <span>FREELANCE PRO SUITE</span>
            </h2>

            <h1 className="text-6xl font-serif font-bold leading-tight text-[#163B7A]">
              Your work,
              <br />
              your rates,
              <br />
              <span className="text-blue-600">paid on time.</span>
            </h1>

            <div className="mt-14 space-y-10">
              <Feature
                icon={BarChart3}
                title="Proposals in 60 seconds"
                description="Auto-filled scope, rates, and terms."
              />

              <Feature
                icon={Mail}
                title="Automated reminders"
                description="Chase invoices without awkward emails."
              />

              <Feature
                icon={Bell}
                title="Income dashboard"
                description="Earned, pending, overdue — at a glance."
              />
            </div>
          </div>

          <div className="mt-16 border-t border-gray-300 pt-8 grid grid-cols-3 gap-8">
            <Stat value="3.1 days" label="AVG COLLECTION" />
            <Stat value="12 min" label="SAVED / PROPOSAL" />
            <Stat value="$0 fees" label="ON PAYOUTS" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white flex items-center justify-center p-14">
          <div className="w-full max-w-md">
            <p className="uppercase tracking-[3px] text-gray-400 text-sm mb-5">
              Welcome Back
            </p>

            <h2 className="text-5xl font-serif font-bold text-gray-900 mb-4">
              Sign in to your account
            </h2>

            <p className="text-gray-500 mb-10">
              Don't have an account?{" "}
              <a onClick={() => navigate('/Registration')} className="text-blue-600 underline cursor-pointer">
                Join here
              </a>
            </p>

            <GoogleLogin
  onSuccess={async (credentialResponse) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const result = await axios.post(
      `${API_URL}/api/Login/google-login`,
      {
        idToken: credentialResponse.credential,
      }
    );

    console.log(result.data);
    //SaveJWT token
    const decodedToken = jwtDecode(result.data.token);

localStorage.setItem("userId", decodedToken.userId);
localStorage.setItem("firstname", decodedToken.FirstName);
localStorage.setItem("country", decodedToken.CountryName);
localStorage.setItem("countryCode", decodedToken.CountryCode);

    
    localStorage.setItem("jwtToken", result.data.token);
    localStorage.setItem("firstName", result.data.firstName);

 const token = localStorage.getItem("jwtToken");
     // Fetch API key info
            const apiRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/ApiKey`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            //console.log("Full API Key Response:", apiRes.data);
            
            const apiKey = apiRes.data.key;
            if (!apiKey) {
            console.warn("API key missing in response.");
            //setError("API key not returned.");
            return;
          }
    
          localStorage.setItem("apiKey", apiKey);



    // Redirect logic
     if (result.data.proposalSetupComplete) {
        navigate("/dashboard");
      } else {
        navigate("/OnboardPage");
      }
      console.log(localStorage.getItem("token"));

  }}
  onError={() => console.log("Login Failed")}
/>

            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button className="cursor-pointer w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl text-lg font-semibold" onClick={() => navigate('/login')}>
              Continue with email
            </button>

            <p className="text-center text-gray-400 text-sm mt-8 leading-6">
              By joining, you agree to our{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon:Icon,  title, description }) {
  return (
    <div className="flex gap-5">
      <div className="w-10 h-10 border border-gray-300 rounded-xl bg-white flex items-center justify-center text-[#163B7A]">
        <Icon size={22} />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-[#163B7A]">{title}</h3>
        <p className="text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <h3 className="text-3xl font-serif font-bold text-[#163B7A]">{value}</h3>
      <p className="uppercase text-xs tracking-[2px] text-blue-500 mt-2">
        {label}
      </p>
    </div>
  );
}

