import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";


    const API_URL = import.meta.env.VITE_API_URL;
  <GoogleLogin
  onSuccess={async (credentialResponse) => {
    console.log("ID TOKEN:", credentialResponse.credential);

    await axios.post(`${API_URL}/api/Login/google-login`, {
      idToken: credentialResponse.credential,
    });
  }}
  onError={() => console.log("Login Failed")}
/>;

 


