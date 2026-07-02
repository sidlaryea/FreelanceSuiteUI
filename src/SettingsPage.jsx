import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {
  User,
  Building2,
  CreditCard,
  Truck,
  Code,
  Bell,
  Shield,
  Edit,
  Save,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Paperclip,
  DollarSign
} from 'lucide-react';
import DashboardLayout from './components/DashboardLayout';
import toast from 'react-hot-toast';

const TabPanel = ({ children, value, index }) => (
  <div className={`${value !== index ? 'hidden' : ''}`}>
    {value === index && <div className="p-6">{children}</div>}
  </div>
);




const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const [formData, setFormData] = useState({
    // Profile fields
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    countryId: '',
    profileImageUrl: '',
    
    // Business fields
    businessName: '',
    businessEmail: '',
    taxId: '',
    phoneNumber: '',
    businessAddress: '',
    industryId: '',
    logoFilePath: '',

    // Branding fields
    defaultInvoicePrefix: '',
    paymentTerms: '',
    defaultPaymentInstruction: '',

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

  // Dashboard Layout state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  //const [userProfile, ] = useState({ firstName: 'User' });
  const [profileImageUrl, setProfileImageUrl] = useState("./user-placeholder.png");
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ setImagePreview] = useState('');
  //const [ setIsUploading] = useState(false);


  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const tabs = [
    { icon: User, label: 'Profile', id: 0 },
    { icon: Building2, label: 'Business', id: 1 },
    { icon: Paperclip, label: 'Branding', id: 2 },
    { icon: DollarSign, label: 'Payment Setup', id: 3 },
    { icon: CreditCard, label: 'Billing', id: 4 },
    { icon: Truck, label: 'Delivery', id: 5 },
    { icon: Code, label: 'API', id: 6 },
    { icon: Bell, label: 'Notifications', id: 7 },
    { icon: Shield, label: 'Security', id: 8 }
  ];

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const getFlagEmoji = (countryCode) => {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
};

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  

const [logoPreview, setLogoPreview] = useState(null);

const handleLogoChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    // Instant preview
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);

    try {
      // Upload to backend
      const uploadedPath = await uploadLogo(file);

      // Update your formData with the new path
      setFormData((prev) => ({
        ...prev,
        logoFilePath: uploadedPath,
      }));
    } catch (err) {
      console.error(err);
      
    }
  }
};

const uploadLogo = async (file) => {
  const token = localStorage.getItem('jwtToken');
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/BusinessInfo/update-logo`, {
    method: "PUT",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Logo upload failed");
  }

  // Assuming backend returns the file path or URL
  const result = await response.json();
  if (!result || typeof result.logoFilePath !== 'string') {
    throw new Error("Invalid response from server");
  }
  return result.logoFilePath;
};

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
          endpoint = 'http://localhost:5214/api/Register/UpdateUserDetails';
          data = {
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            email: formData.email,
            countryId: formData.countryId,
            profileImagePath: formData.profileImageUrl
          };
          break;

        case 'Business':
          endpoint = 'http://localhost:5214/api/BusinessInfo';
          data = {
            businessName: formData.businessName,
            email: formData.businessEmail,
            taxIdNumber: formData.taxId,
            phone: formData.phoneNumber,
            address: formData.businessAddress,
            industryId: formData.industryId,
            logoFilePath: formData.logoFilePath
            
          };
          break;
        case 'Branding':
          endpoint = 'http://localhost:5214/api/BrandingDetails/Update Brand';
          data = {
            defaultInvoicePrefix: formData.defaultInvoicePrefix,
            paymentTerms: formData.paymentTerms,
            defaultPaymentInstructions: formData.defaultPaymentInstruction
          };
          break;
        case 'Payment Setup':
          endpoint = 'http://localhost:5214/api/PaymentSetup/Update User Payment Setup';
          data = {
            payStackPublicKey: formData.payStackPublicKey,
            payStackSecretkey: formData.payStackSecretkey,
            paystackCurrency: formData.payStackCurrency,
            accountName: formData.accountHolderName,
            bankAccountNumber: formData.accountNumber,
            bankName: formData.bankName,
            allowPartialPayments: formData.allowPartialPayments,
            allowOfflinePayments: formData.allowOfflinePayments,
            enablePaystack:formData.paystackEnabled
          };
          break;

          case 'Api':
          endpoint = 'http://localhost:5214/api/ApiKey/';
          data = {
             key: formData.apiKey
          };
          break;
          case 'Security':
          endpoint = 'http://localhost:5214/api/Register/update-password';
          data = {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmNewPassword
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
        await fetchUserProfile();

      } else {
        alert(`Failed to save ${section} settings`);
      }
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      alert(`Error saving ${section} settings: ${error.response?.data?.message || error.message}`);
    }
  };

   useEffect(() => {
  axios.get("http://localhost:5214/api/Country")
    .then((res) => {
      const sortedCountries = res.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setCountries(sortedCountries);
    })
    .catch((err) => console.error("Failed to fetch countries:", err));
    }, []);

   useEffect(() => {
    axios.get("http://localhost:5214/api/Industries")
      .then((res) => {
        const sortedIndustries = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setIndustries(sortedIndustries);
      })
      .catch((err) => console.error("Failed to fetch the industries:", err));
    }, []);



    // Fetch user profile data//
    useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const response = await axios.get('http://localhost:5214/api/Register/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.data) {
            setFormData(prev => ({
              ...prev,
              firstName: response.data.firstName || '',
              middleName: response.data.middleName || '',
              lastName: response.data.lastName || '',
              email: response.data.email || '',
              countryId: response.data.country || '',
              profileImageUrl: response.data.profileImageUrl || '',
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
    }, []);

    //fetch Business Info data
    useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const response = await axios.get('http://localhost:5214/api/BusinessInfo', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
              });
              if (response.data) {
            // Construct full URL for logo if it's a relative path
            let logoPath = response.data.logoFilePath || '';
            if (logoPath && !logoPath.startsWith('http')) {
              logoPath = `http://localhost:5214${logoPath}`;
            }

            setFormData(prev => ({
              ...prev,
              businessName: response.data.businessName,
              businessEmail: response.data.email,
              taxId: response.data.taxIdNumber,
              phoneNumber: response.data.phone,
              businessAddress: response.data.address,
              industryId: response.data.industryId,
              logoFilePath: logoPath, // 👉 Add logo path from API with full URL
            }));
          }

          }
      } catch (error) {
        console.error('Failed to fetch business info:', error);
      }
    };

    fetchBusinessInfo();
   }, []);

   //Fetch Branding Details data 
    useEffect(() => {
    const fetchBrandingDetails = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const response = await axios.get('http://localhost:5214/api/BrandingDetails/Get User Brand', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.data) {
            setFormData(prev => ({
              ...prev,
              defaultInvoicePrefix: response.data.defaultInvoicePrefix || '',
              paymentTerms: response.data.paymentTerms || '',
              defaultPaymentInstruction: response.data.defaultPaymentInstructions || ''
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch branding details:', error);
      }
    };
    fetchBrandingDetails();
  }, []);

  //Fetch Payment Setup data
  useEffect(() => {
    const fetchPaymentSetup = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const response = await axios.get('http://localhost:5214/api/PaymentSetup/Get User Payment Setup', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.data) {
            setFormData(prev => ({
              ...prev,
              payStackPublicKey: response.data.paystackPublicKey || '',
              payStackSecretkey: response.data.paystackSecretKey || '',
              payStackCurrency: response.data.paystackCurrency || '',
              accountHolderName: response.data.accountName || '',
              accountNumber: response.data.bankAccountNumber || '',
              bankName: response.data.bankName || '',
              allowPartialPayments: response.data.allowPartialPayments || false,
              allowOfflinePayments: response.data.acceptOfflinePayments || false,
              paystackEnabled: !!response.data.enablePaystack
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch payment setup:', error);
      }
    };
    fetchPaymentSetup();
  }, []);


  



  
  // Dashboard Layout handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const openChangeImageDialog = () => {
    setIsChangeImageDialogOpen(true);
  };

  const closeChangeImageDialog = () => {
    setIsChangeImageDialogOpen(false);
  };

  const openChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(true);
    
  };

  const closeChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
      if (!selectedFile) return alert("Please select a file first.");
      const token = localStorage.getItem("jwtToken");
      const formData = new FormData();
      formData.append("imageFile", selectedFile);
  
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        });
        alert("Profile image updated!");
        
        
        fetchUserProfile();
        
        closeChangeImageDialog();
      } catch (error) {
        alert("Upload failed: " + (error.response?.data?.message || error.message));
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
      await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-password`, {
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

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("jwtToken");

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Register/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { profileImageUrl } = res.data;
      setProfileImageUrl(`${import.meta.env.VITE_API_URL}/${profileImageUrl.replace(/\\/g, '/')}`);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };
  
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSignOut = () => {
    // Handle sign out logic
    console.log('Signing out...');
    localStorage.clear ();
    window.location.href = "/InvoiceAPI_LandingPage/login";
  };

  //Fetch API Billing Information//
useEffect(() => {
const fetchbillinfo = async () =>{
const token = localStorage.getItem("jwtToken");
try {
        
        if (token) {
          const response = await axios.get('http://localhost:5214/api/ApiKey', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.data) {
            const pricing = {
    Free: { price: 0, frequency: "per month" },
    Pro: { price: 19, frequency: "per month" },
    Enterprise: { price: 49, frequency: "per month (custom)" },
  };
  const { price, frequency } = pricing[response.data.plan] || { price: 0, frequency: "per month" };
            setFormData(prev => ({
              ...prev,
              plan: response.data.plan || '',
              price,
              frequency,
              usageLimit: response.data.usageLimit || '',
              usageCount:response.data.usageCount,
              expiryDate:response.data.expirationDate,
              apiKey: response.data.key || '',

            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch branding details:', error);
      }
    };
    fetchbillinfo();
},[]);


  
const handlePaymentSubmit = async (selectedPlan) => {
  try {
    const token = localStorage.getItem("jwtToken");

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/Payment/initialize`,
      {
        email: formData.businessEmail,
        amount: selectedPlan.price * 100, // Paystack expects amount in kobo/pesewas
        plan: selectedPlan.name,
        callbackUrl: `${window.location.origin}/paymentverify`
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (res.data.authorizationUrl) {
      // Redirect user to Paystack hosted payment page
      window.location.href = res.data.authorizationUrl;
    } else {
      alert("Unable to initialize payment, please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Payment initialization failed.");
  }
};


const billingHistory = [
  // {
  //   id: 1,
  //   date: "2025-08-01",
  //   amount: 19,
  //   pdfUrl: "/invoices/invoice-001.pdf",
  // },
  
];
  
const [selectedInvoice, setSelectedInvoice] = useState(null);

  const openReceipt = (invoice) => setSelectedInvoice(invoice);
  const closeReceipt = () => setSelectedInvoice(null);



  return (
    <DashboardLayout
      profileImageUrl={profileImageUrl}
      openModal={openModal}
      isModalOpen={isModalOpen}
      closeModal={closeModal}
      handleSignOut={handleSignOut}
      toggleSidebar={toggleSidebar}
      isSidebarOpen={isSidebarOpen}
      dialogProps={{
        openChangeImageDialog,
        openChangePasswordDialog,
        isChangeImageDialogOpen,
        closeChangeImageDialog,
        handleFileChange,
        handleUpload,
        isChangePasswordDialogOpen,
        closeChangePasswordDialog,
        currentPassword,
        newPassword,
        confirmNewPassword,
        setCurrentPassword,
        setNewPassword,
        setConfirmNewPassword,
        handleChangePassword,
      }}
    >
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Settings Container */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                


                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Profile Tab */}
          <TabPanel value={activeTab} index={0}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange('middleName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      name="countryId"
                      value={formData.countryId}
                      onChange={(e) => handleInputChange('countryId', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <div className="text-center">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                      {/* Profile Image or Placeholder */}
                      <img
                        src={
                          profileImageUrl && profileImageUrl !== "./user-placeholder.png"
                            ? profileImageUrl
                            : './user-placeholder.png'
                        }

                        className="w-20 h-20 rounded-full object-cover mx-auto mb-4 "
                        onError={(e) => {
                          e.currentTarget.src = '/user-placeholder.png';
                        }}
                      />

                      {/* Title */}
                      <h4 className="text-lg font-medium mb-4 text-center">Profile Picture</h4>

                      {/* Change Button */}
                      <button
                        onClick={openChangeImageDialog}
                        className="flex items-center space-x-2 text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 mx-auto"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                </div>
              </div>

              <hr className="border-gray-200" />
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('Profile')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </TabPanel>

          {/* Business Tab */}
          <TabPanel value={activeTab} index={1}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                  <input
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone Number</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    name="industryId"
                    value={formData.industryId}
                    onChange={(e) =>
                      setFormData({ ...formData, industryId: e.target.value })
                    }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                      <option value="">Select an Industry</option>
                      {industries.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                    {industry.name}
                    </option>
                    ))}
                  </select>
                </div>




                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                  <textarea
                    value={formData.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Logo</label>
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 max-w-xs">

                        {/* Business Logo or Placeholder */}
                        <img
                            src={
                                    logoPreview
                                      ? logoPreview // 👉 new preview (just selected)
                                      : formData.logoFilePath // 👉 backend value (absolute URL)
                                        ? formData.logoFilePath
                                        : "/logo.png" // 👉 fallback placeholder
                                  }
                            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                            onError={(e) => {
                              e.currentTarget.src = "/logo.png";
                            }}
                           
                          />

                      {/* Title */}
                      <h4 className="text-lg font-medium mb-4 text-center">Business Logo</h4>

                      {/* Change Button */}
                      <label
                        htmlFor="businessLogo"
                        className="flex items-center space-x-2 text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 cursor-pointer mx-auto"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Change Logo</span>
                      </label>

                      {/* Hidden File Input */}
                      <input
                        id="businessLogo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                        
                      />
                    </div>  
                  </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('Business')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
              <hr className="border-gray-200" />
              
            </div>
          </TabPanel>

          {/* Branding Tab */}  
          <TabPanel value={activeTab} index={2}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

             <input type="text" name="defaultInvoicePrefix" onChange={(e) => handleInputChange('defaultInvoicePrefix', e.target.value)} value={formData.defaultInvoicePrefix} placeholder="Default Invoice Prefix (e.g. INV-01)" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />
              <select name="paymentTerms" value={formData.paymentTerms} onChange={(e) => handleInputChange('paymentTerms', e.target.value)} className="input bg-white border border-gray-300 rounded-lg px-4 py-3">
                <option value="">Select Payment Terms</option>
                <option value="Net 7">Net 7</option>
                <option value="Net 14">Net 14</option>
                <option value="Net 30">Net 30</option>
                <option value="Due on Receipt">Due on Receipt</option>
              </select>
              <textarea  onChange={(e) => handleInputChange('defaultPaymentInstruction', e.target.value)} name="defaultPaymentInstruction" placeholder="Default Payment Instructions (e.g. Pay via bank transfer to XYZ)" value={formData.defaultPaymentInstruction} className="input bg-white border border-gray-300 rounded-lg px-4 py-3 md:col-span-2" rows="4"></textarea>
                
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('Branding')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </TabPanel>

          {/* Payment Setup Tab */}
          <TabPanel value={activeTab} index={3}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Setup</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                <input type="checkbox" checked={formData.paystackEnabled} onChange={(e) => handleInputChange('paystackEnabled', e.target.checked)} className="accent-blue-600" />
                <label className="text-gray-700 font-medium">Enable Paystack</label>
              </div>

              {formData.paystackEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PayStack Public Key</label>
                    <input type="text" name="payStackPublicKey" onChange={(e) => handleInputChange('payStackPublicKey', e.target.value)} value={formData.payStackPublicKey} placeholder="Paystack Public Key" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PayStack Secret Key</label>
                  <input type="text" name="payStackSecretkey" onChange={(e) => handleInputChange('payStackSecretkey', e.target.value)} value={formData.payStackSecretkey} placeholder="Paystack Secret Key (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.payStackCurrency} onChange={(e) => handleInputChange('payStackCurrency', e.target.value)} name="payStackCurrency">
                    <option value="GHS">GHS - Ghana Cedi</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                  </div>
                  <a href="https://support.paystack.com/en/articles/1006030" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm md:col-span-2">Where do I find my Paystack keys?</a>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                  <input type="text" onChange={(e) => handleInputChange('accountHolderName', e.target.value)} name="accountHolderName" value={formData.accountHolderName} placeholder="Account Holder Name" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number / Wallet Number</label>
                  <input type="text" onChange={(e) => handleInputChange('accountNumber', e.target.value)} name="accountNumber" value={formData.accountNumber} placeholder="Account Number / Wallet Number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name / MoMo Provider</label>
                  <input type="text" onChange={(e) => handleInputChange('bankName', e.target.value)} name="bankName" value={formData.bankName} placeholder="Bank Name / MoMo Provider" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="flex items-center space-x-2">
                      <input name="allowPartialPayments" type="checkbox" checked={formData.allowPartialPayments} onChange={(e) =>
                      setFormData({ ...formData, allowPartialPayments: e.target.checked })} className="accent-blue-600" />
                      <span className="text-sm">Accept Partial Payments</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input name="allowOfflinePayments" type="checkbox" checked={formData.allowOfflinePayments} onChange={(e) =>
                      setFormData({ ...formData, allowOfflinePayments: e.target.checked })} className="accent-blue-600" />
                      <span className="text-sm">Allow Offline Payments (bank/MoMo info will appear on invoice)</span>
                    </label>
                  </div>
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
          </TabPanel>





          {/* Billing Tab */}
<TabPanel value={activeTab} index={4}>
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing & Payment</h3>

    {/* Current Plan */}
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
      <h4 className="text-xl font-semibold text-green-600 mb-4">
        Current Plan: {formData.plan}
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="text-center rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            ${formData.price}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {formData.frequency}
          </div>
        </div>
        <div className="text-center rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {formData.usageLimit || "∞"}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            API Call Limit
          </div>
        </div>
        <div className="text-center rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {formData.usageCount || "∞"}/{formData.usageLimit || "∞"}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            API Usage Count
          </div>
        </div>
        <div className="text-center rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {formData.expiryDate ? new Date(formData.expiryDate).toLocaleDateString() : "∞"}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Expiry Date
          </div>
        </div>
      </div>

      <button
        onClick={() => setUpgradeModalOpen(true)}
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
      <CreditCard className="w-6 h-6 text-blue-600" />
      <div>
        <div className="font-medium text-gray-900">Paystack</div>
        <div className="text-sm text-gray-600">
          All subscriptions and payments are securely processed via Paystack
        </div>
      </div>
    </div>
    <button
      onClick={() => window.open("https://paystack.com/pay/YOUR_PAYMENT_LINK", "_blank")}
      className="text-blue-600 border border-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-50"
    >
      Manage Payment
    </button>
  </div>
</div>


    <h4 className="text-lg font-medium mb-4">Billing History</h4>
<div className="border border-gray-200 rounded-lg divide-y">
  {billingHistory?.length > 0 ? (
    billingHistory.map((invoice) => (
      <div
        key={invoice.id}
        className="flex items-center justify-between p-3 text-sm"
      >
        <div>
          <p className="font-medium">#{invoice.transactionId}</p>
          <p className="text-gray-500">{invoice.date}</p>
        </div>

        <div className="text-right">
          <p className="font-semibold">${invoice.amount}</p>
          <p className="text-gray-500">{invoice.plan}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View receipt in a modal */}
          <button
            onClick={() => openReceipt(invoice)}
            className="text-blue-600 hover:underline"
          >
            View Receipt
          </button>

          {/* Download PDF */}
          <a
            href={invoice.pdfUrl}
            className="text-green-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </div>
      </div>
    ))
  ) : (
    <div className="p-3 text-gray-500 italic">No billing history yet</div>
  )}
  
</div>
{/* Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg relative">
            {/* Close button */}
            <button
              onClick={closeReceipt}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
{/* Header */}
            <h3 className="text-xl font-bold text-center mb-4">Payment Receipt</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-medium">Transaction ID:</span>{" "}
                {selectedInvoice.transactionId}
              </p>
              <p className="text-sm">
                <span className="font-medium">Date:</span> {selectedInvoice.date}
              </p>
              <p className="text-sm">
                <span className="font-medium">Plan:</span> {selectedInvoice.plan}
              </p>
              <p className="text-sm">
                <span className="font-medium">Amount:</span> $
                {selectedInvoice.amount}
              </p>
              <p className="text-sm">
                <span className="font-medium">Payment Method:</span>{" "}
                {selectedInvoice.paymentMethod || "Paystack"}
              </p>
            </div>
{/* Footer */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={closeReceipt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
      {upgradeModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
  <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Choose a Plan
    </h3>
    <div className="space-y-3">
      {/* Free Plan (no payment needed) */}
      <button
        onClick={() => {
          alert("You are now on the Free Plan 🚀");
          setUpgradeModalOpen(false);
        }}
        className="w-full border border-gray-200 rounded-lg p-3 hover:bg-gray-50 text-left"
      >
        Free Plan – $0/month
      </button>

      {/* Pro Plan */}
      <button
        onClick={() => handlePaymentSubmit({ name: "Pro Plan", price: 19 })}
        className="w-full border border-blue-600 rounded-lg p-3 bg-blue-50 hover:bg-blue-100 text-left"
      >
        Pro Plan – $19/month
      </button>

      {/* Enterprise */}
      <button
        onClick={() => {
          window.location.href = "mailto:sales@yourcompany.com?subject=Enterprise Plan Inquiry";
        }}
        className="w-full border border-gray-200 rounded-lg p-3 hover:bg-gray-50 text-left"
      >
        Enterprise – Contact Sales
      </button>
    </div>

    <div className="flex justify-end mt-6">
      <button
        onClick={() => setUpgradeModalOpen(false)}
        className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
      >
        Cancel
      </button>
    </div>
  </div>
</div>
)}


  </div>
</TabPanel>


          {/* Delivery Tab */}
          <TabPanel value={activeTab} index={5}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Enable automatic delivery tracking</span>
                  <button
                    onClick={() => handleSettingChange('autoTracking', !settings.autoTracking)}
                    className={`${
                      settings.autoTracking ? 'bg-blue-600' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span
                      className={`${
                        settings.autoTracking ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Send delivery notifications to customers</span>
                  <button
                    onClick={() => handleSettingChange('deliveryNotifications', !settings.deliveryNotifications)}
                    className={`${
                      settings.deliveryNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span
                      className={`${
                        settings.deliveryNotifications ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Require signature on delivery</span>
                  <button
                    onClick={() => handleSettingChange('requireSignature', !settings.requireSignature)}
                    className={`${
                      settings.requireSignature ? 'bg-blue-600' : 'bg-gray-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span
                      className={`${
                        settings.requireSignature ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>
              </div>

              <hr className="border-gray-200" />

              <h4 className="text-lg font-medium mb-4">Default Delivery Options</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Delivery Time</label>
                  <input
                    type="text"
                    defaultValue="2-3 business days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Provider</label>
                  <input
                    type="text"
                    defaultValue="Standard Shipping"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="text"
                      defaultValue="50.00"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Shipping Cost</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="text"
                      defaultValue="5.99"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('Delivery')}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </TabPanel>

          {/* API Tab */}
          <TabPanel value={activeTab} index={6}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API Settings</h3>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-medium mb-4">API Keys</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">Live API Key</div>
                      <div className="text-sm text-gray-600 font-mono">
                        {showApiKey ? formData.apiKey : '*'.repeat(formData.apiKey.length)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => setShowApiKey(!showApiKey)} className="flex items-center space-x-1 text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
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
                  onClick={() => handleSave('API')}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={activeTab} index={7}>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>

              <div className="space-y-4">
                <h4 className="text-lg font-medium mb-3">Email Notifications</h4>

                {[
                  { key: 'emailInvoices', label: 'Invoice created notifications' },
                  { key: 'emailPayments', label: 'Payment received notifications' },
                  { key: 'emailOverdue', label: 'Overdue invoice reminders' },
                  { key: 'weeklyReports', label: 'Weekly summary reports' },
                  { key: 'maintenance', label: 'System maintenance notifications' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <button
                      onClick={() => handleSettingChange(item.key, !settings[item.key])}
                      className={`${
                        settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                      <span
                        className={`${
                          settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                  </div>
                ))}

                <hr className="border-gray-200 my-6" />

                <h4 className="text-lg font-medium mb-3">Push Notifications</h4>

                {[
                  { key: 'pushBrowser', label: 'Browser push notifications' },
                  { key: 'pushMobile', label: 'Mobile app notifications' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <button
                      onClick={() => handleSettingChange(item.key, !settings[item.key])}
                      className={`${
                        settings[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                      <span
                        className={`${
                          settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                  </div>
                ))}

                <hr className="border-gray-200 my-6" />

                <h4 className="text-lg font-medium mb-3">Notification Schedule</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiet Hours Start</label>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiet Hours End</label>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('Notifications')}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={activeTab} index={8}>
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
          </TabPanel>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
