import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getCountries = async () => {
  const res = await axios.get(`${API}/api/Country`);
  return res.data;
};

export const getIndustries = async () => {
  const res = await axios.get(`${API}/api/Industries`);
  return res.data;
};

export const getProfile = async (token) => {
  try {
    const res = await axios.get(`${API}/api/Register/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("PROFILE API ERROR:", error);
    console.error("ERROR RESPONSE:", error.response);
    return null;
  }
};

export const getOrganization = async (token, apiKey) => {
  const res = await axios.get(
    `${API}/proposal/api/Organization/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey,
      },
    }
  );
  console.log("ORG RESPONSE:", res);
  console.log("ORG DATA:", res.data);

  // Handle case where API returns array or single object
  let orgData = Array.isArray(res.data) ? res.data[0] : res.data;

  // If array is empty, return null
  if (Array.isArray(res.data) && res.data.length === 0) {
    orgData = null;
  }

  console.log("ORG PROCESSED:", orgData);

  return orgData;
};

export const getPaystackSettings = async (token,apiKey) => {
  const res = await axios.get(`${API}/api/PaymentSetup/Get User Payment Setup`, 
    {
    headers: { 
      Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey,
    }
  });
  console.log("Paystack RESPONSE:", res);
  console.log("Paystack", res.data);
  return res.data;
};

export const getbillingInfo = async (token, apiKey) => {
  const res = await axios.get(`${API}/api/ApiKey`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-KEY": apiKey,
    },
  });
  
  return res.data;
};