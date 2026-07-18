// TopNavbar.jsx
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField  from "@mui/material/TextField";
import ProfileImage from './ProfileImage';



export default function TopNavbar({
  profileImageUrl,
  openModal,
  handleSignOut,
  toggleSidebar,
  isModalOpen,
  closeModal,
  openChangeImageDialog,
  openChangePasswordDialog,
  isChangeImageDialogOpen,
  closeChangeImageDialog,
  handleFileChange,
  handleUpload,
  isChangePasswordDialogOpen,
  closeChangePasswordDialog,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  handleChangePassword,
  
}){
  
const ProfileImageUrl = profileImageUrl && profileImageUrl !== "null" && profileImageUrl !== "undefined" && profileImageUrl !== ""
  ? profileImageUrl
  : './user-placeholder.png';

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50 transition-all duration-300">
      <nav className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-3 group">
          <button onClick={toggleSidebar} className="md:hidden text-blue-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="relative">
            <img
              src="/logo.png"
              alt="InvoiceAPI Logo"
              className="h-9 w-9 transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </div>
          <span className="text-xl font-bold text-blue-600 group-hover:text-blue-700">
            InvoiceAPI by SidConsult
          </span>
        </div>

        <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 ml-auto mr-4">
          <a href="./Dashboard" className="text-blue-600 font-bold">
            Dashboard
          </a>
          <a
            href="./Create-invoice"
            className="text-blue-600 font-bold underline"
          >
            Generate Invoices
          </a>
          <a href="#/" className="text-blue-600 font-bold">
            Billing
          </a>
          <a href="#/" className="text-blue-600 font-bold">
            API Documentation
          </a>
          <a href="#/" className="text-blue-600 font-bold">
            Support
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-l font-bold text-blue-600">:</div>
          <div className="relative group">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <ProfileImage src={profileImageUrl} onClick={openModal} />
            </div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300">
              <a
                href="#/"
                onClick={openModal}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Manage Account
              </a>
              <a
                href="#/"
                onClick={handleSignOut}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>
      </nav>
      <Dialog open={isModalOpen} onClose={closeModal}>
                <DialogTitle>Manage Account</DialogTitle>
                <DialogContent>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-blue-600">
                    
                    <li><a href="#/" onClick={(e) => { e.preventDefault(); openChangeImageDialog(); }}>Change Profile Image</a></li>
                    <li><a href="#/" onClick={(e) => { e.preventDefault(); openChangePasswordDialog(); }}>Change Password</a></li>
                    <li><a href="#/">Change User Profile Information</a></li>
                    <li><a href="/ManageUsers">Manage Users</a></li>
                  </ul>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeModal} color="primary">Close</Button>
                </DialogActions>
              </Dialog>
              <Dialog open={isChangeImageDialogOpen} onClose={closeChangeImageDialog}>
                <DialogTitle>Change Profile Image</DialogTitle>
                <DialogContent>
                  <input type="file" onChange={handleFileChange} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleUpload} color="primary">Upload</Button>
                  <Button onClick={closeChangeImageDialog} color="secondary">Cancel</Button>
                </DialogActions>
              </Dialog>
      
      
              <Dialog open={isChangePasswordDialogOpen} onClose={closeChangePasswordDialog}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Current Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} />
                  <TextField
                    margin="dense"
                    label="New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} />
                  <TextField
                    margin="dense"
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleChangePassword} color="primary">Change Password</Button>
                  <Button onClick={closeChangePasswordDialog} color="secondary">Cancel</Button>
                </DialogActions>
              </Dialog>

    </header>
);
}