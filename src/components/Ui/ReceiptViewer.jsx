import { useEffect, useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { API_BASE_Invoice } from "../../config/api";


export default function ReceiptViewer({ txnId, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const apiKey = localStorage.getItem("apiKey");
        const token = localStorage.getItem("jwtToken");
        if (!apiKey) {
          alert("API Key missing. Please log in again.");
          return;
        }

        const response = await fetch(
          `${API_BASE_Invoice}/api/ExportPdf/${txnId}/export-pdf`,
          {
            method: "GET",
            headers: {
              Authorization : `Bearer ${token}`,
              accept: "*/*",
              "X-API-KEY": apiKey,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch PDF");
        }

        const blob = await response.blob();
        setPdfUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Failed to load receipt:", error);
        alert("Failed to load receipt. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();

    // cleanup when modal closes
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [txnId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <button
    onClick={onClose}
    className="absolute top-3 right-1 z-50 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
  >
    ✕
  </button>
      <div className="bg-white w-11/12 md:w-3/4 h-5/6 rounded-2xl shadow-xl overflow-hidden relative">
  {/* Close button */}


        {/* PDF Viewer */}
        <div className="h-full">
          {loading ? (
            <p className="text-center mt-20 text-gray-500">Loading PDF...</p>
          ) : pdfUrl ? (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          ) : (
            <p className="text-center mt-20 text-red-500">
              Failed to load PDF.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
