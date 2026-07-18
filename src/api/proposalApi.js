import axios from "./axiosClient";

const publicHeaders = () => {
  const headers = {};
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  if (token) headers.Authorization = `Bearer ${token}`;
  if (apiKey) headers["X-API-KEY"] = apiKey;

  return headers;
};

export const getPublicProposal = async (token) => {
  const response = await axios.get(`https://freelancepro-gmdgggdtdhcqa7bd.southafricanorth-01.azurewebsites.net/p/${token}`, {
    headers: publicHeaders(),
  });
  return response.data;
};

export const getPublicProposalByPublicId = async (publicId) => {
  const response = await axios.get(`/api/Proposal/public/${publicId}`, {
    headers: publicHeaders(),
  });
  return response.data;
};

export const acceptPublicProposal = async (token, data = {}) => {
  const response = await axios.post(`https://freelancepro-gmdgggdtdhcqa7bd.southafricanorth-01.azurewebsites.net/p/${token}/accept`, data, {
    headers: publicHeaders(),
  });
  return response.data;
};

export const rejectPublicProposal = async (token) => {
  const response = await axios.post(`https://freelancepro-gmdgggdtdhcqa7bd.southafricanorth-01.azurewebsites.net/p/${token}/reject`, {}, {
    headers: publicHeaders(),
  });
  return response.data;
};
