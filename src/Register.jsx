import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import Onboarding from './components/Onboarding'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import { API_BASE_Invoice } from './config/api';

function Register() {
  const [form, setForm] = useState({ firstName: '', middleName: '', lastName: '', email: '', countryId:'', username: '', password: '',role: 'User', 
  profileImagePath: '' });
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();
  
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
    

 useEffect(() => {
  axios.get(`${API_BASE_Invoice}/api/Country`)
    .then((res) => {
      const sortedCountries = res.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setCountries(sortedCountries);
    })
    .catch((err) => console.error("Failed to fetch countries:", err));
}, []);

useEffect(() => {
  if (apiKey) {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 15000); // Redirect after 15 seconds
    return () => clearTimeout(timer);
  }
}, [apiKey, navigate]);

const getFlagEmoji = (countryCode) => {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
};

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setApiKey('');
    
    
    if (!form.firstName || !form.lastName || !form.email || !form.username || !form.password || !form.countryId) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_Invoice}/api/Register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setApiKey(data.apiKey);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Logo" className="h-12 w-12 mb-2" />
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Create Your Account</h2>
          <p className="text-gray-500 text-center">Start Automating Your Freelance Work!</p>
        </div>
        {apiKey  ?  (
          <>
           <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Registration Successful!</h3>
            <p className="text-green-800 mb-2">Your API Key:</p>
            <div className="bg-gray-100 rounded p-2 font-mono text-sm break-all mb-2">{apiKey}</div>
            <p className="text-gray-500 text-xs">Copy and store this key securely.</p>
           </div>

            
          </> 
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg"
            />
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name"
              value={form.middleName}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg"
            />
            
             <select
                  name="countryId"
                  value={form.countryId}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {getFlagEmoji(country.code)} {country.name}
                    </option>
                  ))}
                </select>

                {/* <input
  type="text"
  name="organizationName"
  placeholder="Company / Business Name"
  value={form.organizationName}
  onChange={handleChange}
  required
  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg"
/>
               */}
            
            
            <input
              type="text"
              name="username"
              placeholder="User Name"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg"
            >
              {loading ? 'Registering...' : 'Start Free — No Credit Card'}
            </button>
          </form>
        )}
        
        {/* Conditional footer - Dashboard link OR default login link */}
{apiKey ? (
  <div className="mt-6 text-center">
     <Link to="/login" className="text-blue-600 hover:underline font-medium">
       Proceed to Login to Complete Setup
    </Link>
  </div>
) : (
  <div className="mt-4 text-sm text-gray-600">
    <span className="text-gray-500">Already have an account? </span>
    <Link to="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
  </div>
)}

        </div>
      </div>
    
  );
}

export default Register;