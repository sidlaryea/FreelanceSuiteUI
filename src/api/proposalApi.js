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
  const response = await axios.get(`http://localhost:5214/Proposal/p/${token}`, {
    headers: publicHeaders(),
  });
  return response.data;
};

export const getPublicProposalByPublicId = async (publicId) => {
  const response = await axios.get(`/Proposal/api/Proposal/public/${publicId}`, {
    headers: publicHeaders(),
  });
  return response.data;
};

export const acceptPublicProposal = async (token, data = {}) => {
  const response = await axios.post(`http://localhost:5214/Proposal/p/${token}/accept`, data, {
    headers: publicHeaders(),
  });
  return response.data;
};

export const rejectPublicProposal = async (token) => {
  const response = await axios.post(`http://localhost:5214/Proposal/p/${token}/reject`, {}, {
    headers: publicHeaders(),
  });
  return response.data;
};
