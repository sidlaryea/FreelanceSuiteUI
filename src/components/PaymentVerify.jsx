// src/pages/PaymentVerify.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const reference = searchParams.get("reference");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        toast.error("No reference found in URL ❌");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("jwtToken");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payment/verify/${reference}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Verification result:", res.data);
        toast.success("✅ Payment verified – your plan has been upgraded!");
        
        // Optional: Redirect back to dashboard after 3s
        setTimeout(() => navigate("/dashboard"), 3000);

      } catch (error) {
        console.error("Verification failed:", error);
        toast.error("❌ Payment verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      {loading ? (
        <p className="text-lg font-medium">⏳ Verifying your payment...</p>
      ) : (
        <p className="text-lg font-medium">Redirecting...</p>
      )}
    </div>
  );
};

export default PaymentVerify;
