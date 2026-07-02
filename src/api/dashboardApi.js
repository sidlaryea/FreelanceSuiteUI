import axios from "axios";

const API_BASE_URL = "http://localhost:5214/Proposal/api";

export const getDashboardHome = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  const response = await axios.get(
    `${API_BASE_URL}/Dashboard/home`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey,
      },
    }
  );

  return response.data;
};