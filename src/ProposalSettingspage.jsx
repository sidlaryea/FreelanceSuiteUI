import { useState, toast } from "react";
import { Save, Sparkles, ChevronRight, Edit, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import axios from "axios";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

import Sidebar from "./components/Sidebar";



import useSettingsData from "./hooks/useSettingsData";
import SectionCard from "./components/Settings/SectionCard";
import SettingsTabs from "./components/Settings/SettingsTabs";
import TopNav from "./components/Layout/TopNav";
import { API_BASE_Proposal,API_BASE_Invoice } from "./config/api";


export default function ProposalSettingspage() {
  const [activeNav, setActiveNav] = useState("Settings");
  const [activeTab, setActiveTab] = useState("Profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // NOTE: isChangePasswordDialogOpen is currently not used in this page UI
  // Keeping it commented out avoids unused-var lint errors.
  // const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [_, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // Keep existing backend shape; this page doesn't currently refetch profile after save.
  const {

    form,
  setForm,
  countries,
  profileImageUrl,
  openChangeImageDialog,
  getFlagEmoji,
  handleInputChange,
  ch,
  industries,
  orgLogoPreview,
  fmtPhone,
  isChangeImageDialogOpen,
  
  closeChangeImageDialog,
  handleFileChange,
  handleUpload,
} = useSettingsData();

  const userData = {
    company: form.organizationName || "Your account",
    profileImageUrl: profileImageUrl || `${import.meta.env.BASE_URL}/default-avatar.png`,
    //name: `${form.firstName || ""} ${form.lastName || ""}`.trim() || form.email || "User",
    email: form.email || "",
  };

  // console.log("ProposalSettingspage FORM:", form);
  // console.log("Organization Name:", form.organizationName);

 const handleSave = async (section) => {
    console.log(`Saving ${section} settings...`);

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert('Please log in again');
        return;
      }

      let endpoint = '';
      let data = {};

      switch (section) {
        case 'Profile':
          endpoint = `${API_BASE_Invoice}/api/Register/UpdateUserDetails`;
          data = {
            firstName: form.firstName,
            middleName: form.middleName,
            lastName: form.lastName,
            email: form.email,
            countryId: form.countryId,
            profileImagePath: form.profileImageUrl
          };
          break;

        case 'Workspace':
          endpoint = `${API_BASE_Proposal}/api/Organization/`;
          data = {
            businessName: form.businessName,
            email: form.businessEmail,
            taxIdNumber: form.taxId,
            phone: form.phoneNumber,
            address: form.businessAddress,
            industryId: form.industryId,
            logoFilePath: form.logoFilePath
            
          };
          break;
        
        
          

        case 'Payment Setup':
          endpoint = `${API_BASE_Invoice}/api/PaymentSetup/Update User Payment Setup`;
          data = {
            payStackPublicKey: form.payStackPublicKey,
            payStackSecretkey: form.payStackSecretkey,
            paystackCurrency: form.payStackCurrency,
            accountName: form.accountHolderName,
            bankAccountNumber: form.accountNumber,
            bankName: form.bankName,
            allowPartialPayments: form.allowPartialPayments,
            allowOfflinePayments: form.allowOfflinePayments,
            enablePaystack:form.paystackEnabled
          };
          break;

          case 'Api':
          endpoint = `${API_BASE_Invoice}/api/ApiKey/`;
          data = {
             key: form.apiKey
          };
          break;
          case 'Security':
          endpoint = `${API_BASE_Invoice}/api/Register/update-password`;
          data = {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
            confirmPassword: form.confirmNewPassword
          };
          break;

        default:
          console.log('Unknown section:', section);
          return;
      }

      const response = await axios.put(endpoint, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        alert(`${section} settings saved successfully!`);
        toast.success(`${section}  Information updated successfully!`);
        // fetchUserProfile(); // not available on this page
        

      } else {
        alert(`Failed to save ${section} settings`);
      }
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      alert(`Error saving ${section} settings: ${error.response?.data?.message || error.message}`);
    }
  };
       
      
     const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("All fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    try {
      await axios.put(`${API_BASE_Invoice}/api/Register/update-password`, {
        currentPassword,
        newPassword,
        confirmPassword: confirmNewPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      alert("Password changed successfully!");
      closeChangePasswordDialog();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const closeChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };


    const [settings, setSettings] = useState({
      autoTracking: true,
      deliveryNotifications: true,
      requireSignature: false,
      emailInvoices: true,
      emailPayments: true,
      emailOverdue: false,
      weeklyReports: true,
      maintenance: false,
      pushBrowser: true,
      pushMobile: false,
      twoFactor: false
    });

    const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
    



  return (
    <div className="flex h-screen bg-white overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} userData={userData}/>

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">

        {/* HEADER */}
        <header className="relative h-14 bg-white border-b border-slate-100 px-7 flex items-center justify-between overflow-visible">

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Dashboard</span>

            <ChevronRight size={14} />

            <span className="text-slate-800 font-medium">
              Settings
            </span>
          </div>

          <TopNav/>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="w-full px-8 xl:px-10 py-8">

            {/* PAGE HEADER */}
            <div className="mb-8">
              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <Sparkles size={18} />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">
                    Settings
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    Manage your workspace and integrations.
                  </p>
                </div>

              </div>
            </div>

            {/* TABS */}
            <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab}/>

            {/* CONTENT */}
            <div className="space-y-6">

              {activeTab === "Profile" && (
                <div>
                  <div className="space-y-6">
          <SectionCard title="Profile Information" description="Manage your personal information and account details.">
            {/* Main Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        
            {/* LEFT SIDE — FORM */}
            <div className="xl:col-span-3 space-y-6">
          
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={ch}
              className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              value={form.middleName}
              onChange={ch}
              className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={ch}
              className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
          <input
              type="email"
              name="email"
              value={form.email}
              onChange={ch}
              className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Country
            </label>

            <select
              name="countryId"
              value={form.countryId}
              onChange={(e) =>
                handleInputChange("countryId", e.target.value)
              }
              className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select a country</option>

              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {getFlagEmoji(country.code)} {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT SIDE — PROFILE CARD */}
        <div className="xl:col-span-1">
          <div className="border border-slate-200 rounded-2xl p-8 bg-white flex flex-col items-center justify-center min-h-[320px]">
            
            {/* Image */}
            <img
              src={
                profileImageUrl &&
                profileImageUrl !== "./user-placeholder.png"
                  ? profileImageUrl
                  : "./user-placeholder.png"
              }
              
              className="w-24 h-24 rounded-full object-cover mb-5 border"
              onError={(e) => {
                e.currentTarget.src = "./user-placeholder.png";
              }}
            />

            {/* Title */}
            <h4 className="text-xl font-semibold text-slate-800 mb-6">
              Profile Picture
            </h4>

            {/* Button */}
            <button
              type="button"
              onClick={openChangeImageDialog}
              className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 transition px-5 py-2.5 rounded-xl font-medium cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Change Photo</span>
            </button>
          </div>
        </div>
      </div>

          {/* Divider */}
          <div className="border-t border-slate-200 mt-8 pt-6 flex justify-end">
            <button onClick={() => handleSave('Profile')} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer">
             <Save className="w-4 h-4" />
                              <span>Save Changes</span>
            </button>
          </div>
            </SectionCard>
          </div>
        </div>
              )}






              {activeTab === "workspace" && (
                <div>
                  <div className="space-y-6">

            <SectionCard
              title="Workspace Details"
              description="Manage your organization profile and business identity."
            >
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">

                {/* LEFT SIDE — FORM */}
        <div className="xl:col-span-3 space-y-6">
                <div className="cs-field">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="organizationName"
                    
                    value={form.organizationName}
                    onChange={ch}
                  />
                </div>

                <div className="cs-field">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Industry
                  </label>
                  <select
                    name="industryId"
                    value={form.industryId}
                    onChange={(e) =>
                      setForm({ ...form, industryId: e.target.value })
                    }
                        required
                        className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                      <option value="">Select an Industry</option>
                      {industries.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                    {industry.name}
                    </option>
                    ))}
                  </select>
                </div>

                <div className="cs-field">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organization Email
                  </label>
                  <input
                    className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    type="email"
                    name="organizationEmail"
                    
                    value={form.organizationEmail}
                    onChange={ch}
                  />
                </div>

                <div className="cs-field">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organization Phone
                  </label>
                  <input
                    className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="organizationPhone"
                    
                    value={form.organizationPhone}
                    onChange={(e) =>
                      ch({
                        target: {
                          name: "organizationPhone",
                          value: fmtPhone(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                <div className="cs-field col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Address
                  </label>
                  <input
                    className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="organizationAddress"
                    placeholder="123 Ring Rd, Accra"
                    value={form.organizationAddress}
                    onChange={ch}
                  />
                </div>

                <div className="cs-field col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website
                  </label>
                  <input
                    className="w-full h-12 rounded-xl border border-slate-300 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    type="email"
                    name="organizationWebsite"
                    placeholder="www.SidConsult.com"
                    value={form.organizationWebsite}
                    onChange={ch}
                  />
                </div>
                </div>
                
                {/* RIGHT SIDE — Organization Logo Card */}
        <div className="xl:col-span-1">
          <div className="border border-slate-200 rounded-2xl p-8 bg-white flex flex-col items-center justify-center min-h-[320px]">
            
          {/* Image */}
          <img
                          src={orgLogoPreview
                    && orgLogoPreview !== "./user-placeholder.png"
                    ? orgLogoPreview
                    : "./user-placeholder.png"
                }
                alt="Organization Logo"
                className="w-24 h-24 rounded-full object-cover mb-5 border"
                onError={(e) => {
                  e.currentTarget.src = "./user-placeholder.png";}}
                        />

            {/* Title */}
            <h4 className="text-xl font-semibold text-slate-800 mb-6">
              Organization Logo
            </h4>

            {/* Button */}
            <button
              type="button"
              onClick={openChangeImageDialog}
              className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 transition px-5 py-2.5 rounded-xl font-medium cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Change Photo</span>
            </button>
          </div>
        </div>
        </div>
            
            {/* Divider */}
      {/* Divider */}
      <div className="border-t border-slate-200 mt-8 pt-1 flex justify-end">
        <button onClick={() => handleSave('Organization')} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer">
             <Save className="w-4 h-4" />
                              <span>Save Changes</span>
          </button>
      </div>           
            </SectionCard>

          </div>
                </div>
              
                )}

                  {/* Add Payments Setup */}
              {activeTab === "payments" && (
                <div>
                  <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Setup</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" checked={form.paystackEnabled} onChange={(e) => handleInputChange('paystackEnabled', e.target.checked)} className="accent-blue-600" />
                    <img src="./logos/paystack_logo.png" alt="Paystack Logo" className="h-10 w-12 mr-2 rounded" />
                    <label className="text-gray-700 font-medium">Enable Paystack</label>
                    
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" checked={form.stripeEnabled} onChange={(e) => handleInputChange('stripeEnabled', e.target.checked)} className="accent-blue-600" />
                    <img src="./logos/stripe_new.png" alt="Stripe Logo" className="h-10 w-12 mr-2 rounded" />
                    <label className="text-gray-700 font-medium">Enable Stripe</label>
                    
                  </div>
                </div>

              

              {form.paystackEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PayStack Public Key</label>
                    <input type="text" name="payStackPublicKey" onChange={(e) => handleInputChange('payStackPublicKey', e.target.value)} value={form.payStackPublicKey} placeholder="Paystack Public Key" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PayStack Secret Key</label>
                  <input type="text" name="payStackSecretkey" onChange={(e) => handleInputChange('payStackSecretkey', e.target.value)} value={form.payStackSecretkey} placeholder="Paystack Secret Key (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.payStackCurrency} onChange={(e) => handleInputChange('payStackCurrency', e.target.value)} name="payStackCurrency">
                    <option value="GHS">GHS - Ghana Cedi</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                  </div>
                  <a href="https://support.paystack.com/en/articles/1006030" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm md:col-span-2">Where do I find my Paystack keys?</a>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                  <input type="text" onChange={(e) => handleInputChange('accountHolderName', e.target.value)} name="accountHolderName" value={form.accountHolderName} placeholder="Account Holder Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number / Wallet Number</label>
                  <input type="text" onChange={(e) => handleInputChange('accountNumber', e.target.value)} name="accountNumber" value={form.accountNumber} placeholder="Account Number / Wallet Number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name / MoMo Provider</label>
                  <input type="text" onChange={(e) => handleInputChange('bankName', e.target.value)} name="bankName" value={form.bankName} placeholder="Bank Name / MoMo Provider" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="flex items-center space-x-2">
                      <input name="allowPartialPayments" type="checkbox" checked={form.allowPartialPayments} onChange={(e) =>
                      setForm({ ...form, allowPartialPayments: e.target.checked })} className="accent-blue-600" />
                      <span className="text-sm">Accept Partial Payments</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input name="allowOfflinePayments" type="checkbox" checked={form.allowOfflinePayments} onChange={(e) =>
                      setForm({ ...form, allowOfflinePayments: e.target.checked })} className="accent-blue-600" />
                      <span className="text-sm">Allow Offline Payments (bank/MoMo info will appear on invoice)</span>
                    </label>
                  </div>
                </div>

                 )}

{/* STRIPE CONFIG */}
{form.stripeEnabled && (
  <div className="space-y-6  rounded-xl p-6 bg-gray-50">
    <h4 className="font-semibold text-gray-800">
      Stripe Configuration
    </h4>

    <select
      name="stripeCurrency"
      value={form.stripeCurrency}
      onChange={(e) => handleInputChange('stripeCurrency', e.target.value)}
      className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
    >
      <option value="USD">USD – US Dollar</option>
      <option value="CAD">CAD – Canadian Dollar</option>
      <option value="GBP">GBP – British Pound</option>
    </select>

    <p className="text-sm text-gray-600">
      Stripe payments are processed securely by our platform.
      No API keys are required.
    </p>
  </div>
)}

              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('Payment Setup')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
                </div>
              
                )}
                
             {/*Begin Billing And Subscription*/}
                   
                  {activeTab === "billing" && (
                    <div>
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing & Payment</h3>

                        {/* Current Plan */}
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
                          <h4 className="text-xl font-semibold text-green-600 mb-4">
                            Current Plan: {form.plan || "—"}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div className="text-center rounded-lg p-4">
                              <div className="text-3xl font-bold text-blue-600 mb-1">${form.price || "0"}</div>
                              <div className="text-sm text-gray-600 font-medium">{form.frequency || "—"}</div>
                            </div>
                            <div className="text-center rounded-lg p-4">
                              <div className="text-3xl font-bold text-blue-600 mb-1">{form.usageLimit || "∞"}</div>
                              <div className="text-sm text-gray-600 font-medium">API Call Limit</div>
                            </div>
                            <div className="text-center rounded-lg p-4">
                              <div className="text-3xl font-bold text-blue-600 mb-1">
                                {form.usageCount || "∞"}/{form.usageLimit || "∞"}
                              </div>
                              <div className="text-sm text-gray-600 font-medium">API Usage Count</div>
                            </div>
                            <div className="text-center rounded-lg p-4">
                              <div className="text-3xl font-bold text-blue-600 mb-1">
                                {form.expiryDate ? new Date(form.expiryDate).toLocaleDateString() : "∞"}
                              </div>
                              <div className="text-sm text-gray-600 font-medium">Expiry Date</div>
                            </div>
                          </div>

                          <button
                            onClick={() => alert("Upgrade flow not connected yet")}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            Upgrade Plan
                          </button>
                        </div>

                        {/* Payment Methods */}
                        <h4 className="text-lg font-medium mb-4">Payment Method</h4>
                        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gradient-to-r from-blue-50 to-green-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold">
                                $ 
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">Paystack</div>
                                <div className="text-sm text-gray-600">
                                  All subscriptions and payments are securely processed via Paystack
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <h4 className="text-lg font-medium mb-4">Billing History</h4>
                        <div className="border border-gray-200 rounded-lg divide-y">
                          <div className="p-3 text-gray-500 italic">No billing history yet</div>
                        </div>

                        {/* Save Button */}
                        <hr className="border-gray-200" />
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSave("Billing")}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                    
             {/*End Billing And Subscription*/}

                  {/*Begin API Integration*/}
                 {activeTab === "developer" && (
                    <div>
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Settings</h3>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                          <h4 className="text-lg font-medium mb-4">API Keys</h4>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div>
                                <div className="text-sm font-medium">Live API Key</div>
                                <div className="text-sm text-gray-600 font-mono">
                                  {form.apiKey
                                    ? (showApiKey ? form.apiKey : '*'.repeat(form.apiKey.length || 0))
                                    : ''}
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setShowApiKey(!showApiKey)}
                                  className="flex items-center space-x-1 text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50"
                                >
                                  {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  <span>{showApiKey ? 'Hide' : 'Show'}</span>
                                </button>

                                <button className="flex items-center space-x-1 text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </button>

                                <button className="flex items-center space-x-1 text-red-600 border border-red-600 px-3 py-1 rounded text-sm hover:bg-red-50">
                                  <RefreshCw className="w-3 h-3" />
                                  <span>Regenerate</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <h4 className="text-lg font-medium mb-4">Webhook Configuration</h4>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                          <input
                            type="url"
                            defaultValue="https://your-app.com/webhooks"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span>Enable webhook notifications</span>
                          <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                            <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                          </button>
                        </div>

                        <hr className="border-gray-200" />

                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSave('Api')}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
              {/*End API Integrations*/}

              {/*Begin Secutity Setup*/}
                  {activeTab === "security" && (
                    <div>
                      <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                      
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                                      <h4 className="text-lg font-medium mb-4">Change Password</h4>
                                      <div className="space-y-4">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                          <div className="relative">
                                            <input
                                              type={showPassword ? 'text' : 'password'}
                                              value={currentPassword}
                                              onChange={(e) => setCurrentPassword(e.target.value)}
                                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => setShowPassword(!showPassword)}
                                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            >
                                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                          </div>
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                          <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                          <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          />
                                        </div>
                                        <button onClick={handleChangePassword} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                          Update Password
                                        </button>
                                      </div>
                                    </div>
                      
                                    <h4 className="text-lg font-medium mb-4">Two-Factor Authentication</h4>
                      
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="font-medium">Two-Factor Authentication</div>
                                          <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                                        </div>
                                        <button
                                          onClick={() => handleSettingChange('twoFactor', !settings.twoFactor)}
                                          className={`${
                                            settings.twoFactor ? 'bg-blue-600' : 'bg-gray-300'
                                          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                                        >
                                          <span
                                            className={`${
                                              settings.twoFactor ? 'translate-x-6' : 'translate-x-1'
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                          />
                                        </button>
                                      </div>
                                    </div>
                      
                                    <h4 className="text-lg font-medium mb-4">Active Sessions</h4>
                      
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 border rounded">
                                          <div>
                                            <div className="text-sm font-medium">Current Session</div>
                                            <div className="text-sm text-gray-600">Chrome on Windows • Active now</div>
                                          </div>
                                          <span className="text-sm text-green-600 font-medium">Current</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded">
                                          <div>
                                            <div className="text-sm font-medium">Mobile App</div>
                                            <div className="text-sm text-gray-600">iPhone • Last active 2 hours ago</div>
                                          </div>
                                          <button className="text-red-600 border border-red-600 px-3 py-1 rounded text-sm hover:bg-red-50">
                                            Revoke
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                      
                                    <hr className="border-gray-200" />
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => handleSave('Security')}
                                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                      >
                                        <Save className="w-4 h-4" />
                                        <span>Save Changes</span>
                                      </button>
                                    </div>
                                  </div>
                    </div>
                  )}
                    




              {/*End Secutity Setup*/}

            
            </div>
            </div>
              
              </main>
        

      {/* Image Change Dialog */}

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
    </div>
    </div>
  );
}


