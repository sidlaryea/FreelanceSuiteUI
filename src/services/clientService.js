import axios from "axios";
import { API_BASE_Invoice,API_BASE_Proposal } from "../config/api";



const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  "X-API-KEY": localStorage.getItem("apiKey"),
});

export const getCrmClients = async () => {
  const response = await axios.get(
    `${API_BASE_Proposal}/api/Client/api/internal/clients/crm`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getClientRecommendations = async (clientId) => {
  const response = await axios.get(
    `${API_BASE_Proposal}/api/Client/api/internal/client-recommendations/${clientId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const getDashboardSummary = async (clientId) => {
  const response = await axios.get(
    `${API_BASE_Invoice}/api/Invoice/summary/${clientId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const loadDashboardSummary = async () => {
  const response = await axios.get(
    `${API_BASE_Invoice}/api/Invoice/summary/`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const loadSubscriptionSummary = async () => {
  const response = await axios.get(
    `${API_BASE_Invoice}/api/Subscription/usage`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const loadInvoiceList = async () => {
  const response = await axios.get(
    `${API_BASE_Invoice}/api/Invoice/invoice-list`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};


