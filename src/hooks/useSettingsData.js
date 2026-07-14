import { useEffect, useState } from "react";
import axios from "axios";

import {
  getCountries,
  getIndustries,
  getOrganization,
  getProfile,
  getPaystackSettings,
  getbillingInfo,
} from "../services/SettingsService";

import { buildImageUrl } from "../utils/settingsHelpers";

export default function useSettingsData() {
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [orgLogoPreview, setOrgLogoPreview] = useState("");
  
  // Dialog state for image changes
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  


  const [form, setForm] = useState({
    //Profile fields
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    countryId: "",

    //Organization fields
    organizationName: "",
    organizationEmail: "",
    organizationPhone: "",
    organizationAddress: "",
    organizationWebsite: "",
    industryId: "",

    // Payment Setup fields
    payStackPublicKey: '',
    payStackSecretkey: '',
    payStackCurrency: '',
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    allowPartialPayments: false,
    allowOfflinePayments: false,
    paystackEnabled: false,

    //Billing Fields
    plan:'',
    price:'',
    usageLimit:'',
    usageCount:'',
    expiryDate:'',
    frequency:'',

     //API Key
    apiKey:'',

    //Security fields
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''

  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("apiKey");
      
      console.log("TOKEN:", token);
      console.log("API KEY:", apiKey);

      const [
        countriesData,
        industriesData,
        profile,
        organization,
        paystackSettings,
        billingInfo,
        
      ] = await Promise.all([
        getCountries(),
        getIndustries(),
        getProfile(token).catch((error) => {
          console.error("PROFILE API ERROR:", error);
          console.error("ERROR RESPONSE:", error.response);
          return null; // Return null if profile API fails
        }),
        getOrganization(token, apiKey).catch((error) => {
          console.error("ORGANIZATION API ERROR:", error);
          console.error("ERROR RESPONSE:", error.response);
          return null; // Return null if organization API fails or no organization exists
        }),
        getPaystackSettings(token, apiKey).catch((error) => {
          console.error("PAYSTACK SETTINGS API ERROR:", error);
          console.error("ERROR RESPONSE:", error.response);
          return null; // Return null if paystack settings API fails
        }),
        getbillingInfo(token, apiKey).catch((error) => {
          console.error("BILLING INFO API ERROR:", error);
          console.error("ERROR RESPONSE:", error.response);

          
          return null; // Return null if billing info API fails
        }),

      ]);

      setCountries(countriesData);
      setIndustries(industriesData);

      setProfileImageUrl(
        buildImageUrl(profile?.profileImageUrl)
      );

      setOrgLogoPreview(
        buildImageUrl(organization?.logoUrl)
      );
      
      
      // Map plan -> price/frequency (prevents undefined variables)
      const pricing = {
        Free: { price: 0, frequency: "per month" },
        Pro: { price: 19, frequency: "per month" },
        Enterprise: { price: 49, frequency: "per month (custom)" },
      };

      const { price, frequency } = pricing[billingInfo?.plan] || {
        price: 0,
        frequency: "per month",
      };

      setForm((prev) => ({
        ...prev,

        firstName: profile?.firstName || "",
        middleName: profile?.middleName || "",
        lastName: profile?.lastName || "",
        email: profile?.email || "",
        countryId: profile?.country || "",

        organizationName: organization?.name || "",
        organizationEmail: organization?.email || "",
        organizationPhone: organization?.phone || "",
        organizationAddress: organization?.address || "",
        organizationWebsite: organization?.website || "",
        industryId: organization?.industry || "",
        organizationLogoUrl: organization?.logoUrl || "",

        // Payment Setup fields
        payStackPublicKey: paystackSettings?.paystackPublicKey || '',
        payStackSecretkey: paystackSettings?.paystackSecretKey || '',
        payStackCurrency: paystackSettings?.paystackCurrency || '',
        accountHolderName: paystackSettings?.accountName || '',
        accountNumber: paystackSettings?.bankAccountNumber || '',
        bankName: paystackSettings?.bankName || '',
        allowPartialPayments: paystackSettings?.allowPartialPayments || false,
        allowOfflinePayments: paystackSettings?.allowOfflinePayments || false,
        paystackEnabled: paystackSettings?.enablePaystack || false,

        //Billing Fields
        plan: billingInfo?.plan || '',
        price,
        frequency,
        usageLimit: billingInfo?.usageLimit || '',
        usageCount: billingInfo?.usageCount || '',
        expiryDate: billingInfo?.expirationDate || '',
        apiKey: billingInfo?.key || '',

        //Security fields
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      
      }));
      
      console.log("FORM AFTER SET:", form);
    } catch (error) {
      console.error(error);
    }
  };

  // Generic change handler for form inputs
  const ch = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Field-specific change handler
  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Dialog handlers for image changes
  const openChangeImageDialog = () => setIsChangeImageDialogOpen(true);
  const closeChangeImageDialog = () => setIsChangeImageDialogOpen(false);

  // File upload handlers
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    const formDataUpload = new FormData();
    formDataUpload.append("imageFile", selectedFile);

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Profile image updated successfully!");
        closeChangeImageDialog();
        // Refresh profile data
        loadData();
      } else {
        alert(`Upload failed: ${response.data?.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    }
  };



  
  // Phone number formatter
  const fmtPhone = (value) => {
    const n = value.replace(/\D/g, "");
    const m = n.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!m) return value;
    const [, a, b, c] = m;
    return !b ? a : `(${a}) ${b}${c ? `-${c}` : ""}`;
  };
   


  return {
    countries,
    industries,
    form,
    setForm,
    profileImageUrl,
    orgLogoPreview,
    getFlagEmoji: (code) => code ? code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt())) : "",
    ch,
    handleInputChange,
    openChangeImageDialog,
    closeChangeImageDialog,
    isChangeImageDialogOpen,
    
    selectedFile,
    setSelectedFile,
    handleFileChange,
    handleUpload,
    fmtPhone,
  };
}