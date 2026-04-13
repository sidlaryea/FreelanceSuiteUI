import axios from "./axiosClient";

export const getPublicProposal = async (token) => {
  const response = await axios.get(`/p/${token}`);
  return response.data;
};