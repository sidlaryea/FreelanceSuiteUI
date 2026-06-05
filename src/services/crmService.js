import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getClients = async () => {
  const response = await axios.get(
    `${API}/api/internal/clients/crm`
  );

  return response.data;
};

export const getClientHealth = async (clientId) => {
  const response = await axios.get(
    `${API}/api/internal/client-health/${clientId}`
  );

  return response.data;
};

export const getClientNotes = async (clientId) => {
  const response = await axios.get(
    `${API}/api/internal/client-notes/${clientId}`
  );

  return response.data;
};

export const getClientTags = async (clientId) => {
  const response = await axios.get(
    `${API}/api/internal/client-tags/${clientId}`
  );

  return response.data;
};

export const getClientActivities = async (clientId) => {
  const response = await axios.get(
    `${API}/api/internal/client-activities/${clientId}`
  );

  return response.data;
};

export const getClientRecommendations = async (clientId) => {
  const response = await axios.get(
    `${API}/api/internal/client-recommendations/${clientId}`
  );

  return response.data;
};