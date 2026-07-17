import { useState,useEffect } from "react";
import { Plus, Trash2, Download, Save, Eye, Edit3, X, MoveRight ,Send } from "lucide-react";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";
import AutocompleteSearch from './components/AutocompleteSearch';
import { useApiInterceptor } from "./components/Hooks/useApiInterceptor";
import SuccessModal from "./components/Ui/SuccessModal";
import { toast } from "react-hot-toast";
import { API_BASE_Invoice } from "./config/api";


export default function GenerateInvoicePage() {
  const [formData, setFormData] = useState({
    customerId: 0,
    discountPercent: 0,
    items: [{ productId: '', name: '', quantity: 1, unitPrice: 0, description: '' }],
    dueDate: '',
    currency: 'GHS',
    country: 'Ghana',
    region: 'Greater Accra',
    totalTaxAmount: 0,
    createdBy: 'System',
    status: 'Draft'});


///////Function for Fetching the Invoice/////////
const fetchInvoices = async () => {
  try {
    const apiKey = localStorage.getItem("apiKey"); // Include this if your API requires auth

    const res = await fetch(`${API_BASE_Invoice}/api/Invoice/GetInvoicesByUserId`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "X-Api-Key": apiKey, // Add this if required by your backend
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    console.log("Fetched invoices:", data); // ✅ Debug log
    setInvoices(data);
  } catch (err) {
    console.error("Failed to fetch invoices:", err);
  }
};
useEffect(() => {
  fetchInvoices();
}, []);


  

const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
    const [invoices, setInvoices] = useState([]);
    const [search, setSearch] = useState("");
 const filteredInvoices = invoices.filter(inv =>
  inv.invoiceNumber.toString().includes(search)
);
   
    const [currentPage, setCurrentPage] = useState(1);  
    
    const invoicesPerPage = 5; // or any number you want
    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
    const totalPages = Math.ceil(invoices.length / invoicesPerPage);
    const [taxComponents, setTaxComponents] = useState([]); // Holds list of tax items from DB 
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [notification, setNotification] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [profileImageUrl, setProfileImageUrl] = useState("./user-placeholder.png");
    const [showSuccess, setShowSuccess] = useState(false);

    
     
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const openChangeImageDialog = () => setIsChangeImageDialogOpen(true);
    const closeChangeImageDialog = () => setIsChangeImageDialogOpen(false);
    const openChangePasswordDialog = () => setIsChangePasswordDialogOpen(true);
    const closeChangePasswordDialog = () => {
      setIsChangePasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
const country = localStorage.getItem('country');
const countryCode = localStorage.getItem('countryCode');

// Flag helper function
const getFlagEmoji = (code) => {
  return code
    ?.toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
};

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first.");
    const token = localStorage.getItem("jwtToken");
    const formData = new FormData();
    formData.append("imageFile", selectedFile);

    try {
      await axios.put(`${API_BASE_Invoice}/api/Register/update-profile-image`, formData, {
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
  setError("Authentication token not found.");
  return;
}

    try {
      await axios.put(`${API_BASE_Invoice}/api/Register/update-password`, {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
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
      const res = await axios.get(`${API_BASE_Invoice}/api/Register/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      
      const { profileImageUrl } = res.data;
      setProfileImageUrl(`${API_BASE_Invoice}/${profileImageUrl.replace(/\\/g, '/')}`);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  ///////Fetch taxes By Country//////////// 
  useEffect(() => {
  const fetchTaxesByCountry = async () => {
    const country = localStorage.getItem("country"); // get registered country
      if (!country) return; // no country stored

    try {
      const res = await fetch(`${API_BASE_Invoice}/api/Tax/by-country/${country}`);
      const data = await res.json();
      console.log("Fetched taxes on load:", data);
      setTaxComponents(data);
    } catch (err) {
      console.error("Error fetching tax components on load:", err);
      setTaxComponents([]);
    }
  };

    
    fetchTaxesByCountry();
    fetchUserProfile();
    
  }, [formData.country]);

  
  
  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/login");
  };

  




const fetchProducts = async (query) => {
  if (!query) return [];

  try {
    const res = await fetch(`${API_BASE_Invoice}/api/Product/search?query=${encodeURIComponent(query)}`);
    return await res.json(); // expected: array of { id, name, price, description }
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};


console.log("selectedInvoice", selectedInvoice);

//////////////Handle Form Submission////////////
 const handleSubmit = async (e) => {
  

      // ✅ Log formData just before building payload
    console.log("Submitting formData:", formData);
  e.preventDefault();
  setSuccess(null);
    setError(null);
    setLoading(true);

  try {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    const userId = localStorage.getItem("userId");

    if (!token || !apiKey) {
      console.error("Missing token or API key");
      alert("Please log in and ensure your API key is available.");
      return;
    }

    const payload = {
      customerId: parseInt(formData.customerId, 10), // Use selectedCustomer if available
      items: formData.items,
      dueDate: formData.dueDate,
      currency: formData.currency,
      discountPercent:formData.discountPercent,
      country: formData.country,
      region: formData.region,
      totalTaxAmount: formData.totalTaxAmount,
      taxComponents: taxComponents.map(tax => ({
    name: tax.name,
    rate: tax.rate
  })),
      createdBy: userId?.name || "Unknown",
      status: formData.status,
    };

    const response = await fetch(`${API_BASE_Invoice}/api/Invoice`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    "X-Api-Key": apiKey,
  },
  body: JSON.stringify(payload), // ✅ Don't wrap in `{ createInvoiceDto: payload }`
});

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("Invoice POST response:", response.status, responseBody);
      console.log(typeof formData.customerId)

      
      alert("Failed to create invoice");
      return;
    }

    
    

  // Option 1: Re-fetch all
    fetchInvoices();

  // Option 2: Add new one to the beginning of list instantly
  setInvoices(prev => [responseBody, ...prev]);

  setSuccess("Invoice saved!");

    console.log("Invoice created:", responseBody);
    alert("Invoice created successfully");
    // Optionally: reset form or redirect
      // ✅ Reset formData and selected customer
    setFormData({
      customerId: 0,
      items: [{
     productId: '',
     name: '',
     quantity: 1,
     unitPrice: 0,
     description: '',
     product: null // clear product object
      }],
      dueDate: '',
      currency: 'GHS',
      country: 'Ghana',
      region: 'Greater Accra',
      totalTaxAmount: 0,
      createdBy: 'System',
      status: 'Draft',
    });

    setSelectedCustomer(null); // Assuming you’re using this state for customer selection
    //setIsCreating(false); // Close the create invoice form


  } catch (error) {
    console.error("Error submitting invoice:", error);
    alert("An error occurred while creating the invoice");
  }
  finally {
    setLoading(false);
  }
};

const addItem = () => {
  setFormData((prev) => ({
    ...prev,
    items: [...prev.items, { productId: '',name:'', quantity: 1, unitPrice: 0, description: '' }],
  }));
};

const removeItem = (index) => {
  setFormData((prev) => ({
    ...prev,
    items: prev.items.filter((_, i) => i !== index),
  }));
};

const updateItem = (index, field, value) => {
  setFormData((prev) => ({
    ...prev,
    items: prev.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ),
  }));
};

const calculateSubtotal = () => {
  return formData.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};

const calculateDiscount = () => {
  return (calculateSubtotal() * (formData.discountPercent ?? 0)) / 100;
};



const calculateTax = () => {
  const discountedSubtotal = calculateSubtotal() - calculateDiscount();
  const totalTaxRate = taxComponents.reduce((sum, tax) => sum + tax.rate, 0);
  return (discountedSubtotal * totalTaxRate) / 100;
};

const calculateTotal = () => {
  return calculateSubtotal()- calculateDiscount() + calculateTax();
};

const formatCurrency = (amount, currency = 'GHS') => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
  }).format(amount);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const handleDelete = (id) => {
  setInvoices(prev => prev.filter(inv => inv.id !== id));
  showNotification('Invoice deleted', 'success');
};



const handleDownloadPDF = async (id) => {
  try {
    const apiKey = localStorage.getItem("apiKey");
    const token = localStorage.getItem("jwtToken");
    if (!apiKey) {
      alert("API Key missing. Please log in again.");
      return;
    }

    const response = await fetch(`${API_BASE_Invoice}/api/ExportPdf/${id}/export-pdf`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "accept": "*/*",
        "X-API-KEY": apiKey,
      },
  });

    if (!response.ok) {
      throw new Error("Failed to download PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    // Clean up
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download invoice. Please try again.");
  }
};


const handleSendInvoiceEmail = async (invoiceId) => {
  try {
    // Optional: show a loading toast
    console.info("Sending invoice via email...");

    const token = localStorage.getItem("jwtToken");
    
    const res = await axios.post(
      `${API_BASE_Invoice}/api/Email/${invoiceId}/send-email`, // Adjust to your API route
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Success
    setShowSuccess(true);
    console.log(res.data.message || "Invoice sent successfully!");
  } catch (error) {
    console.error("Error sending invoice email:", error);
   toast.error(
        
          "Failed to send invoice. Please try again."
      );
  }
};

useApiInterceptor();
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
     <div className="flex items-center justify-between">
     <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Invoice Management</h1>
      <p className="text-gray-600">Create and manage your invoices efficiently</p>
     </div>

      {/* Country Selector */}
     <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700">Country:</label>
      <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 text-sm bg-gray-50">
          <span className="text-xl">{getFlagEmoji(countryCode)}</span>
          <span>{country}</span>
        </div>
      </div>
   </div>
   </div>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Invoices</h3>
          <div className="text-3xl font-bold text-gray-900">{invoices.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Draft Invoices</h3>
          <div className="text-3xl font-bold text-gray-900">
            {invoices.filter(inv => inv.status === 'Draft').length}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Value</h3>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(invoices.reduce((sum, inv) => sum + inv.total, 0))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Invoice List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    {/* Search Input */}
    <div className="flex-1">
      <input
        type="text"
        placeholder="Search invoice by ID..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      />
    </div>
              
              
              
              
              
              
              
              
              <button
                onClick={() => setIsCreating(true)}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Create Invoice
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading...</p>
              </div>
            ) : currentInvoices.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No invoices found. Create your first invoice!
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount %
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.customer.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          invoice.status === 'Draft' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.discountPercent ?? 0}
                        </td>


                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(invoice.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-center items-center mt-3 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

        {/* Right Column - Invoice Details or Create Form */}
        <div className="bg-white rounded-lg shadow-sm">
          {isCreating ? (
            <div>
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Create Invoice</h2>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer
                    </label>
                    <AutocompleteSearch
                        
                        placeholder="Search Customer by name or ID"
                        value={selectedCustomer}
                        fetchData={async (query) => {
                          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Customer/search?query=${encodeURIComponent(query)}`);
                          return await res.json(); // array of { id, name }
                        }}
                        getOptionLabel={(customer) => `${customer.name} `}
                        onSelect={(customer) => {
                        console.log("Selected customer:", customer);
                        setSelectedCustomer(customer);
                        setFormData((prev) => ({
                          ...prev,
                          customerId: customer.id, // <-- SET this
                        }));
                      }}
                      />
                  </div>
                  
                  
                  
                  
                  
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                    
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="GHS">GHS</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
                  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Discount %
  </label>
  <input
    type="number"
    min="0"
    max="100"
    value={formData.discountPercent}
    onChange={e => setFormData(prev => ({
      ...prev,
      discountPercent: parseFloat(e.target.value) || 0
    }))}
    className="w-50 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
  />
</div>

                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-grow text-center">
                      <h3 className="text-lg font-medium text-gray-900"><b>Add Invoice Items</b></h3>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={addItem}
                        className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
                      >
                        <Plus size={16} />
                        Add Item
                      </button>
                    </div>
                  </div>

                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item/Product
                        </label>
                        <AutocompleteSearch
                            
                            placeholder="Search product by name or ID"
                            value={item?.product || null}
                            fetchData={fetchProducts}
                            getOptionLabel={(product) => `${product.name}`}
                            onSelect={(product) => {
                              updateItem(index, "product", product);
                              updateItem(index, "productId", product.id);
                              updateItem(index, "name", product.name);
                              updateItem(index, "description", product.description);
                              updateItem(index, "unitPrice", product.price);
                            }}
                          />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unit Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          required
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 p-2"
                          disabled={formData.items.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          rows="2"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(calculateSubtotal(), formData.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Discount ({formData.discountPercent ?? 0}%):</span>
                  <span className="font-medium">
                    -{formatCurrency((calculateSubtotal() * (formData.discountPercent ?? 0)) / 100, formData.currency)}
                  </span>
                </div>



                  <div className="mb-2">
                    {taxComponents.map((tax) => (
                      <div key={tax.id} className="flex justify-between text-sm text-gray-600">
                        <span>{tax.name} ({tax.rate}%):</span>
                        <span>{formatCurrency((calculateSubtotal() * tax.rate) / 100, formData.currency)}</span>
                      </div>
                    ))}

                    

                    <div className="flex justify-between font-medium mt-1">
                      <span>Total Tax ({taxComponents.reduce((sum, t) => sum + t.rate, 0)}%):</span>
                      <span>{formatCurrency(calculateTax(), formData.currency)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal(), formData.currency)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <span>💾</span>
                    )}
                    Create Invoice
                  </button>
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              
                  
                </div>
                </div>
              
            
          ) : selectedInvoice ? (
            <div>
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
                  <div className="flex gap-2">
                    
                    <button
                      onClick={() => handleDownloadPDF(selectedInvoice.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Download size={16} />
                      Download PDF
                    </button>
                    
                    {/* Send via Email */}
                    <button  
                        onClick={() => handleSendInvoiceEmail(selectedInvoice.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                      >
                      <Send size={16} />
                      Send via Email
                    </button>
                    {/* Success modal */}
                      <SuccessModal
                        show={showSuccess}
                        onClose={() => setShowSuccess(false)}
                        message="Invoice email sent successfully!"
                      />

                    <button
                      onClick={() => setSelectedInvoice(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>

                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg  text-gray-900 mb-4 font-bold">Invoice Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Invoice Number:</span>
                        <span className="font-medium">{selectedInvoice.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issue Date:</span>
                        <span className="font-medium">{formatDate(selectedInvoice.issueDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span  className="font-medium">{formatDate(selectedInvoice.dueDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedInvoice.status === 'Draft' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedInvoice.status}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance Due:</span>
                        <span className="font-medium">{formatCurrency(selectedInvoice.balanceDue, selectedInvoice.currency)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-medium">{formatCurrency(selectedInvoice.amountPaid, selectedInvoice.currency)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-medium">{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</span>
                      </div>

                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <div className="font-medium">{selectedInvoice.customer.fullName}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <div className="font-medium">{selectedInvoice.customer.email}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <div className="font-medium">{selectedInvoice.customer.phone}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <div className="font-medium">{selectedInvoice.customer.address}</div>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice Items</h3>
                  <table className="w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Description   
                        </th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th> 
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Total 
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item) => (  
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900">
                            {item.description}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900">
                            {formatCurrency(item.unitPrice, selectedInvoice.currency)}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200 text-sm text-gray-900">
                            {formatCurrency(item.unitPrice * item.quantity, selectedInvoice.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>


                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(selectedInvoice.subtotal, selectedInvoice.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Discount ({selectedInvoice.discountPercent ?? 0}%):</span>
                    <span className="font-medium">
                      -{formatCurrency((selectedInvoice.subtotal * (selectedInvoice.discountPercent ?? 0)) / 100, selectedInvoice.currency)}
                    </span>
                  </div>
                  <div className="mb-2">
  {selectedInvoice.taxComponents?.map((tax) => (
    <div key={tax.id} className="flex justify-between text-sm text-gray-600">
      <span>{tax.name} ({tax.rate}%):</span>
      <span>
        {formatCurrency(((selectedInvoice.subtotal - (selectedInvoice.subtotal * (selectedInvoice.discountPercent ?? 0)) / 100) * tax.rate) / 100, selectedInvoice.currency)}
      </span>
    </div>
  ))}


  <div className="flex justify-between font-medium mt-1">
    <span>
      Total Tax ({selectedInvoice.taxComponents?.reduce((sum, t) => sum + t.rate, 0)}%):
    </span>
    <span>
      {formatCurrency(selectedInvoice.taxAmount, selectedInvoice.currency)}
    </span>
  </div>
</div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Select an invoice to view details or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
    
    </DashboardLayout>
  );
}
