// DashboardLayout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import AccountDialogs from "./AccountDialogs";
import useAuthCheck from "./Hooks/useAuthCheck";
import {useApiInterceptor}  from "./Hooks/useApiInterceptor";

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
  userProfile

}) {
  
   useAuthCheck();
    useApiInterceptor();
  
  // Create userData object from userProfile or construct from available props
  const userData = userProfile ? {
    ...userProfile,
    // Map profilePic to profileImageUrl if needed (different field names)
    profileImageUrl: userProfile.profileImageUrl || userProfile.profilePic || profileImageUrl,
  } : {
    profileImageUrl: profileImageUrl,
  };
  
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
