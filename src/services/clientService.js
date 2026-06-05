import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const apiKey = localStorage.getItem("apiKey");

export const getCrmClients = async () => {
  const response = await axios.get(
    `http://localhost:5214/Proposal/api/Client/api/internal/clients/crm`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-API-KEY": apiKey,
      },
    }
  );

  return response.data;
};

export const getClientRecommendations = async (clientId) => {
  const response = await axios.get(
    `http://localhost:5214/Proposal/api/Client/api/internal/client-recommendations/${clientId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-API-KEY": apiKey,
      },
    }
  );

  return response.data;
};


