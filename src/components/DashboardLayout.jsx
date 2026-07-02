// DashboardLayout.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import AccountDialogs from "./AccountDialogs";
import useAuthCheck from "./Hooks/useAuthCheck";
import { useApiInterceptor } from "./Hooks/useApiInterceptor";
import axios from "axios";

export default function DashboardLayout({
  children,
  profileImageUrl,
  openModal,
  isModalOpen,
  closeModal,
  handleSignOut,
  toggleSidebar,
  isSidebarOpen,
  dialogProps,
  userProfile,
}) {
  useAuthCheck();
  useApiInterceptor();

  const [profile, setProfile] = useState(userProfile || null);

  useEffect(() => {
    // If caller already provided a profile, prefer that.
    if (userProfile) {
      setProfile(userProfile);
      return;
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const apiKey = localStorage.getItem("apiKey");
        if (!token) return;

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/Register/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-API-KEY": apiKey,
            },
          }
        );

        setProfile(res.data);
      } catch (err) {
        console.error("DashboardLayout fetchProfile error:", err);
      }
    };

    fetchProfile();
  }, [userProfile]);

  const userData = useMemo(() => {
    const u = profile || {};
    return {
      ...u,
      profileImageUrl:
        u.profileImageUrl || u.profilePic || profileImageUrl || undefined,
      // normalize common names to what Sidebar expects
      name: u.name || u.firstName || u.email,
    };
  }, [profile, profileImageUrl]);

  return (
    <div className="h-screen overflow-hidden">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 h-16 z-30 bg-white shadow">
        <TopNavbar
          userProfile={userProfile}
          profileImageUrl={profileImageUrl}
          openModal={openModal}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          handleSignOut={handleSignOut}
          toggleSidebar={toggleSidebar}
          {...dialogProps}
        />
      </div>

      {/* Sidebar */}
      <div className="fixed top-16 left-0 bottom-0 w-64 z-20 bg-[#0f172a] text-white">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          dialogProps={dialogProps}
          userData={userData}
        />
      </div>

      {/* Content Area */}
      <div className="ml-64 pt-16 h-screen overflow-y-auto bg-gray-100">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
