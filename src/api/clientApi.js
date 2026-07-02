import axios from "axios";

const API_BASE_URL = "http://localhost:5078";

export const getClient = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  const headers = {
    Authorization: token ? `Bearer ${token}` : undefined,
    "X-API-KEY": apiKey || undefined,
  };

  // Remove undefined headers to avoid sending literal "undefined"
  Object.keys(headers).forEach((k) => headers[k] === undefined && delete headers[k]);

  const res = await axios.get(`${API_BASE_URL}/api/Client`, {
    headers,
  });

  return res.data;
};

