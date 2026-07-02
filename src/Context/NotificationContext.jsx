import {createContext,useEffect,useContext,useState} from "react";

import axios from "axios";

const NotificationContext = createContext();


export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  

  const [notifications, setNotifications] =
    useState([]);

  const [loadingNotifications,setLoadingNotifications] = useState(false);

  const token =
    localStorage.getItem("jwtToken");

  const apiKey =
    localStorage.getItem("apiKey");

  const headers = {
    Authorization: `Bearer ${token}`,
    "X-API-KEY": apiKey,
  };



  
  const fetchNotifications =
    async () => {
      try {
        setLoadingNotifications(true);

        const response =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/Proposal/api/Notifications`,
            {
              headers,
            }
          );

        setNotifications(response.data);
      } catch (error) {
        console.error(
          "Failed to load notifications",
          error
        );
      } finally {
        setLoadingNotifications(false);
      }
    };

  const markAsRead =
    async (notificationId) => {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/Proposal/api/Notifications/${notificationId}/read`,
          {},
          {
            headers,
          }
        );

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId
              ? { ...n, isRead: true }
              : n
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

  const markAllRead =
    async () => {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/Proposal/api/Notifications/read-all`,
          {},
          {
            headers,
          }
        );

        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            isRead: true,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };

  const deleteNotification =
    async (notificationId) => {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/Proposal/api/Notifications/${notificationId}`,
          {
            headers,
          }
        );

        setNotifications((prev) =>
          prev.filter(
            (n) => n.id !== notificationId
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

  const unreadNotifications =
    notifications.filter(
      (x) => !x.isRead
    ).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loadingNotifications,

        unreadNotifications,

        fetchNotifications,

        markAsRead,
        markAllRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
  
};

