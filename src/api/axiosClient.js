import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://freelancepro-gmdgggdtdhcqa7bd.southafricanorth-01.azurewebsites.net",
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;