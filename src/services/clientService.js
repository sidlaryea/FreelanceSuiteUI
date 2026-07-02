import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  "X-API-KEY": localStorage.getItem("apiKey"),
});

export const getCrmClients = async () => {
  const response = await axios.get(
    `${API_URL}/Proposal/api/Client/api/internal/clients/crm`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getClientRecommendations = async (clientId) => {
  const response = await axios.get(
    `${API_URL}/Proposal/api/Client/api/internal/client-recommendations/${clientId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getDashboardSummary = async (clientId) => {
  const response = await axios.get(
    `${API_URL}/api/Invoice/summary/${clientId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const loadDashboardSummary = async () => {
  const response = await axios.get(
    `${API_URL}/api/Invoice/summary/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const loadSubscriptionSummary = async () => {
  const response = await axios.get(
    `${API_URL}/api/Subscription/usage`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const loadInvoiceList = async () => {
  const response = await axios.get(
    `${API_URL}/api/Invoice/invoice-list`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


