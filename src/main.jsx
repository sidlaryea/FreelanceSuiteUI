import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Toaster} from 'react-hot-toast';
import {NotificationProvider} from "./Context/NotificationContext";
import {GoogleOAuthProvider} from "@react-oauth/google";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <NotificationProvider>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#fff",
            color: "#333",
            fontSize: "14px",
          },
        }}
      />
    </NotificationProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);


