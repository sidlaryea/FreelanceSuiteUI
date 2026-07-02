import React, { useState, useEffect } from "react";
import axios from "axios";
import {   Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,} from "@mui/material";


const UserProfileForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("api");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/Register/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Api-Key": apiKey, // only if required by backend
          },
        }
      );

      setFormData(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (open) fetchProfile();
}, [open]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("api");

    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/Register/UpdateUserDetails`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Api-Key": apiKey, // keep only if backend requires it
        },
      }
    );

    console.log("Updated profile data:", res.data);
    alert("Profile updated ✅");
    onClose();
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    alert("Failed to update ❌");
  }
};

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Profile</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <TextField
            fullWidth
            margin="dense"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserProfileForm;
