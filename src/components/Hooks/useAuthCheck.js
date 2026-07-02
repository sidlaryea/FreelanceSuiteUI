// hooks/useAuthCheck.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // current time in seconds

      if (decoded.exp < now) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("token has expired", error);
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [navigate]);
};

export default useAuthCheck;
