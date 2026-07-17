import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://invoiceapi-gcc3duhbc4age6bw.southafricanorth-01.azurewebsites.net",
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;