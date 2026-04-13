import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useApiInterceptor } from "./components/Hooks/useApiInterceptor";


export default function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  
  
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/Login/login`, {
        email,
        password,
      });

      

      const {token,proposalSetupComplete} = response.data;
      
      if (token) {
        localStorage.setItem("jwtToken", token);
        const decodedToken = jwtDecode(token);
        console.log("Decoded JWT:", decodedToken);

        // Decode token to get userId
        
        const userId = decodedToken.userId; // or whatever field contains the user ID
        const country = decodedToken.CountryName;
        const countryCode=decodedToken.CountryCode;
        const firstname=decodedToken.FirstName;
        localStorage.setItem("country",country)
        localStorage.setItem("countryCode",countryCode)
        localStorage.setItem("userId", userId);
        localStorage.setItem("firstname",firstname);
        localStorage.setItem("token", token); // Store token for authenticated requests
        
        
        
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
        setError("API key not returned.");
        return;
      }

      localStorage.setItem("apiKey", apiKey);
      localStorage.setItem("setupComplete", proposalSetupComplete ? "true" : "false");


        if (proposalSetupComplete) {
        navigate("/dashboard");
      } else {
        navigate("/OnboardPage");
      }
      } else {
        setError("Invalid login response.");
      }
    } catch (error) {
      setError("Login failed. Check your credentials.");
      console.error("Login error:", error);
    }
  };



  useApiInterceptor(); // Initialize the API interceptor
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8" align="center">
        <img src="./logo.png" alt="Logo" className="h-12 w-12 mb-2" />
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign in to FreelancePro 
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-600">
              
            </label>
            <input
              type="text"
              id="email"
              autoComplete="off"
              required
              value={email}
              placeholder="Email"
              onChange={(e) => setemail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              
            </label>
            <input
              type="password"
              id="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account? <Link to="/registration" className="text-blue-600 hover:underline">Register</Link>
          <p>Or Return To  <Link to="//" className="text-blue-600 hover:underline">Home</Link></p> 
        </p>
      
      </div>
    </div>

    
  );
  
}
