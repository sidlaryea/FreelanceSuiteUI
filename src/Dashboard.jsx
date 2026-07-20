import { 
  AlertCircle, BarChart3, TrendingUp, Shield, Clock, Key, Calendar, 
  Crown, Check, ArrowRight, User, Bell 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField } from '@mui/material';
import UserProfileForm from './components/UserProfileForm';
// import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [isModalOpen,setIsModalOpen]= useState(false);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangeUserProfileOpen, setIsChangeUserProfileOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  
  
  dayjs.extend(relativeTime);
  
  
  // const [refresh, setRefresh] = useState(false);

  //user Profile States
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    profilePic: '',
    email: '',
    plan: 'Free',
});
  // API Key Info State
  const [apiInfo, setApiInfo] = useState({
    key: 'No API Key Found',
    currentUsage: 0,
    monthlyLimit: 1000,
    plan: 'Free',
    expiryDate: 'No Expiry Date',
    ownerId: 'No Owner ID',
    totalRequests: 0,
    successRate: 100,
    avgResponseTime: 500,
  });

  // Optional placeholders
  
const profileImageUrl = userProfile.profilePic
  ? `${import.meta.env.VITE_API_URL}/${userProfile.profilePic.replace(/\\/g, '/')}`
  : './user-placeholder.png'; 
 
    

  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace ("./login") // Redirect to home page after sign out
    
    
  };

const openModal = () => {
  setIsModalOpen(true);
};

const openChangeUserProfileDialog = () => {
  setIsChangeUserProfileOpen(true);
}

const closeModal = () => {
  setIsModalOpen(false);
};

const openChangeImageDialog = () => {
  setIsChangeImageDialogOpen(true);
};

const closeChangeImageDialog = () => {
  setIsChangeImageDialogOpen(false);
};

const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
};


// Function to handle file upload
// This function will be called when the user clicks the upload button
const handleUpload = async () => {
  if (!selectedFile) {
    alert("Please select a file first!");
    return;
  }



//prepare the form data
  const formData = new FormData();
  formData.append('imageFile', selectedFile);


  //call the API to upload the image
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    console.error("User is not authenticated. Token not found.");
    return;
  }
try {
  await axios.put(
    `${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Let axios set the Content-Type to multipart/form-data with boundary
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  // Success
    alert("Profile image updated successfully!");
    await fetchUserProfile();
    
    // Re-fetch profile to get updated image
   

    // Update profile state
    // setUserProfile((prevProfile) => ({
    //   ...prevProfile,
    //   profilePic: data.profileImageUrl, // Or adjust if the field is different
    // }));

    // Optionally reset input or close modal
    setSelectedFile(null);
    setIsChangeImageDialogOpen(false);

  } catch (error) {
    console.error("Error uploading profile image:", error);
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to upload profile image. Please try again.";
    alert(`Upload failed: ${message}`);
  }
};


const openChangePasswordDialog = () => {
  setIsChangePasswordDialogOpen(true);
};
const closeChangePasswordDialog = () => {
  setIsChangePasswordDialogOpen(false);
  // Reset password fields
  setCurrentPassword("");
  setNewPassword("");
  setConfirmNewPassword("");
};



  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("All password fields are required.");
      return;
  }

    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
  const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/Register/update-password`,
        {
          currentPassword,
          newPassword,
          confirmPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("Password changed successfully!");
        closeChangePasswordDialog();
      } else {
        alert(`Error changing password: ${response.data?.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error changing password: ${error.response?.data?.message || error.message}`);
    }
  }

  const fetchUserProfile = async () => {
      try {
        // Set loading state
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
       

        if (!token) {
          console.error("Token not found in localStorage");
          return;
        }

        const profileRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/Register/profile`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
             }, "Content-Type": "application/json"}
        );

        if (profileRes.status === 200) {
           const { firstName, lastName, profileImageUrl, email, plan } = profileRes.data;
          setUserProfile({
            firstName: firstName || '',
            lastName: lastName || '',
            profilePic: profileImageUrl || '',
            email: email || '',
            plan: plan || 'Free',
          });
        }

        // Fetch API key info
        const apiRes = await axios.get(
          `https://invoiceapi-gcc3duhbc4age6bw.southafricanorth-01.azurewebsites.net/api/ApiKey`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (apiRes.status === 200) {
          const { key, usageCount, usageLimit,totalRequests, plan, expiryDate, ownerId } = apiRes.data;

          setApiInfo({
            key: key || 'No API Key Found',
            currentUsage: usageCount || 0,
            monthlyLimit: usageLimit || 1000,
            plan: plan || 'Free',
            expiryDate: expiryDate || 'No Expiry Date',
            ownerId: ownerId || 'No Owner ID',
            totalRequests: totalRequests || 0,
            successRate:99.5,
            responseTime: 500, // Placeholder for average response time
          });
        }
      } catch (error) {
        console.error("Failed to fetch API data", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const apiKey = localStorage.getItem("api");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/audit/recent`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-Api-Key": apiKey,
            },
          }
        );

        setActivities(res.data || []);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {fetchUserProfile();}, []);





  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Enhanced Navbar */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50 transition-all duration-300">
        <div className="absolute left-0 top-0 h-full flex items-center px-4">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <img src="/logo.png" alt="InvoiceAPI Logo" className="h-9 w-9 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold text-blue-600 transition-colors group-hover:text-blue-700">
              InvoiceAPI by SidConsult
            </span>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center">
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 transition-colors group">
            <a href="#/" className="text-blue-600 hover:text-blue-600 transition-colors font-bold underline">Dashboard</a>
            <a href="./invoicedashboard" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">Generate Invoices</a>
            <a href="./UpgradePage" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">Billing</a>
            <a href="./InvoiceAPI_Developer_Onboarding_Guide.pdf" download="API_Documentation.pdf" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">API Documentation</a>
            <a href="#/" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">Support</a>
          </div>
          {/* Profile Section */}
           <div className="flex items-center space-x-4">

           <div className="text-l font-bold text-blue-600 transition-colors group-hover:text-blue-700">:</div>
              <div className="relative group">
               <div
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
  >
                  <img src={profileImageUrl} alt="User" className="w-10 h-10 rounded-full object-cover ms-3" />
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
              
              <li><a href="#/" onClick={openChangeImageDialog}>Change Profile Image</a></li>
              <li><a href="#/" onClick={openChangePasswordDialog}>Change Password</a></li>
              <li><a href="#/" onClick={openChangeUserProfileDialog}>Change User Profile Information</a></li>
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

        <Dialog open={isChangeUserProfileOpen} onClose={() => setIsChangeUserProfileOpen(false)}>

          
          <DialogContent> 
          <UserProfileForm 
              userProfile={userProfile} 
              onClose={() => setIsChangeUserProfileOpen(false)} 
              onProfileUpdated={fetchUserProfile} 
            />

          </DialogContent>
        </Dialog>

      </header>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              

          {/* Debug Info - Remove this in production */}
          {/* <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <h3 className="font-bold text-yellow-800">Debug Info:</h3>
            <p className="text-sm text-yellow-700">
              Props received: formData={formData ? '✓' : '✗'}, apiUsage={apiUsage ? '✓' : '✗'}, apiKey={apiKey ? '✓' : '✗'}
            </p>
          </div> */}

          {/* Welcome Section */}
          <div className="mb-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {userProfile.firstName} {userProfile.lastName}! 
            </h1>
            <p className="text-blue-100 text-lg">Here's your API usage overview and account details.</p>
          </div>

          {/* Usage Alert */}
          {apiInfo.currentUsage / (apiInfo.monthlyLimit || 1) > 0.8 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-orange-800">Usage Alert</h3>
                  <p className="text-sm text-orange-700">
                    You've used {Math.round((apiInfo.currentUsage / (apiInfo.monthlyLimit || 1)) * 100)}% of your monthly limit. 
                    Consider upgrading to avoid service interruption.
                  </p>
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Monthly Usage */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{apiInfo.currentUsage}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Usage</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(apiInfo.currentUsage / apiInfo.monthlyLimit) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{apiInfo.currentUsage} / {apiInfo.monthlyLimit} requests</p>
            </div>

            {/* Total Requests */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{apiInfo.totalRequests.toLocaleString()}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Requests</h3>
              <p className="text-sm text-green-600 font-medium mt-2">+12% from last month</p>
            </div>

            {/* Success Rate */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{apiInfo.successRate}%</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
              <p className="text-sm text-green-600 font-medium mt-2">Excellent performance</p>
            </div>

            {/* Avg Response Time */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{apiInfo.responseTime}ms</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
              <p className="text-sm text-green-600 font-medium mt-2">Fast & reliable</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* API Key Section & Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Your API Key
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 font-bold text-sm break-all border ">
                  {apiInfo.key}
                </div>
                <p className="text-sm text-gray-600 mt-3 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Keep your API key secure and never share it publicly
                </p>
              </div>

             <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
    <Calendar className="w-5 h-5 mr-2" />
    Recent Activity
  </h2>

  <div className="space-y-4">
    {activities.length === 0 ? (
      <p className="text-sm text-gray-500">No recent activity found.</p>
    ) : (
      activities.map((activity, index) => (
        <div
          key={index}
          className="flex items-center py-3 border-b border-gray-100 last:border-b-0"
        >
          <div
            className={`w-2 h-2 rounded-full mr-3 ${
              activity.action?.toLowerCase() === "update"
                ? "bg-green-500"
                : activity.action?.toLowerCase() === "delete"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          ></div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {activity.action} on {activity.tableName}
            </p>
            <p className="text-xs text-gray-500">
              {dayjs(activity.activityDate).fromNow()} •{" "}
              {activity.userName || "Unknown User"}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
</div>
            </div>

            {/* Upgrade & Quick Actions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center mb-4">
                  <Crown className="w-8 h-8 mr-3" />
                  <h2 className="text-xl font-bold">Upgrade to Pro</h2>
                </div>
                <p className="text-purple-100 mb-4">
                  Unlock higher rate limits, priority support, and advanced analytics.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-purple-100">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    10,000 requests/month
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Advanced analytics
                  </li>
                </ul>
                <button className="w-full bg-white text-purple-600 font-semibold py-3 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center">
                  Upgrade Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center">
                    <Key className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Regenerate API Key</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center">
                    <BarChart3 className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">View Analytics</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center">
                    <Shield className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Security Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
         {/* Enhanced Footer */}
      <footer role="contentinfo" aria-label="Footer" lang="en" dir="ltr" className=" text-white py-0.5  bottom-0 left-0 w-full">
  <div className="container mx-auto p-2 md:p-4">
    <div className="text-center">
      <p className="text-gray-400 mb-2">
        &copy; 2025 InvoiceAPI. Powered By Sidconsult. All rights reserved.
      </p>
    </div>
  </div>
</footer>

    </div>
  );

};