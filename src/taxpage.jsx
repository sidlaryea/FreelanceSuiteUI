import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Check, X, Star } from "lucide-react";
import DashboardLayout from "./components/DashboardLayout";

export default function TaxRatesPage() {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [showMore, setShowMore] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [taxRates, setTaxRates] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    country: '',
    region: '',
    isActive: true,
    currencyId: 1
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("/user-placeholder.png");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
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

  const getFlag = (countryCode) => {
  if (!countryCode) return "🏳️";
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
};

useEffect(() => {
const fetchCurrencies = async () => {
    try {
      const res = await axios.get("http://localhost:5214/api/Currency/GetAllCurrencies");

      const mappedCurrencies = res.data.map(c => ({
        id: c.id,
        code: c.currencyCode,
        name: c.currencyName ?? c.currencyCode,
        symbol: c.symbol ?? "",
        flag: getFlag(c.countryCode),
        country: c.countryCode
      }));

      setCurrencies(mappedCurrencies);

      // Set initial selected currency: check localStorage first, then GHS, then first available
      const defaultCode = localStorage.getItem('defaultCurrency');
      const initialCurrency = defaultCode
        ? mappedCurrencies.find(c => c.code === defaultCode)
        : mappedCurrencies.find(c => c.code === 'GHS') || mappedCurrencies[0];
      if (initialCurrency) setSelectedCurrency(initialCurrency);

    } catch (error) {
      console.error("Failed to load currencies", error);
    }
  };

  fetchCurrencies();
}, []);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first.");
    const token = localStorage.getItem("jwtToken");
    const formDataUpload = new FormData();
    formDataUpload.append("imageFile", selectedFile);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-profile-image`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
      await axios.put(
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
        headers: { Authorization: `Bearer ${token}` },
      });
      const { profileImageUrl } = res.data;
      setProfileImageUrl(`${import.meta.env.VITE_API_URL}/${profileImageUrl.replace(/\\/g, "/")}`);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  const fetchTaxRates = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/TaxComponent/GetAllTaxComponents`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    const data = response.data || [];

    const updatedData = data.map(tax => {
      const matchingCurrency = currencies.find(
        c => c.code?.toLowerCase() === tax.currencyCode?.toLowerCase()
      );
      return { 
        ...tax, 
        currencyId: matchingCurrency ? matchingCurrency.id : null 
      };
    });

    setTaxRates(updatedData);
    console.log("Fetched tax rates:", updatedData);
  } catch (error) {
    console.error("Failed to fetch tax rates:", error);
  }
};

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (currencies.length > 0) {
      fetchTaxRates();
    }
  }, [currencies]);

  
const selectedCurrencyId = selectedCurrency?.id ?? null;
  const activeTaxes = taxRates.filter(
  t => (!selectedCurrencyId || t.currencyId === selectedCurrencyId) && t.isActive
).length;
  const totalTaxRate = taxRates
  .filter(t => (!selectedCurrencyId || t.currencyId === selectedCurrencyId) && t.isActive)
  .reduce((sum, t) => sum + t.rate, 0);
const selectedCurrencyObj = currencies.find(c => c.code === selectedCurrency);

    const filteredTaxes = taxRates.filter(tax => {
  const countryMatch =
    countryFilter === 'all' ||
    (tax.country && tax.country.toLowerCase() === countryFilter.toLowerCase());

  const currencyMatch =
    !selectedCurrencyId || tax.currencyId === selectedCurrencyId;

  const searchMatch =
    !searchQuery ||
    tax.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tax.country?.toLowerCase().includes(searchQuery.toLowerCase());

  const statusMatch =
    statusFilter === 'all' ||
    (statusFilter === 'active' ? tax.isActive : !tax.isActive);

  return countryMatch && currencyMatch && searchMatch && statusMatch;
});
  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

  const handleSubmitNew = async () => {
    if (!formData.name || !formData.rate || !formData.country || !formData.region) {
      alert('Please fill in all required fields');
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Authentication token not found.");
      return;
    }

    const payload = {
      name: formData.name,
      rate: parseFloat(formData.rate),
      country: formData.country,
      region: formData.region,
      isActive: formData.isActive,
      productCurrencyId: formData.currencyId
    };

    try {
      if (editingTax) {
        // For editing, assuming PUT endpoint exists
        await axios.put(`${import.meta.env.VITE_API_URL}/api/TaxComponent/${editingTax.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("Tax component updated successfully!");
      } else {
        // For adding new tax
        await axios.post(`${import.meta.env.VITE_API_URL}/api/TaxComponent`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        alert("Tax component added successfully!");
      }

      // Refresh tax rates after successful submission
      fetchTaxRates();
      openModalNew();
      closeModal();
      
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const openModalNew = (tax = null) => {
    if (tax) {
      setEditingTax(tax);
      setFormData(tax);
    } else {
      setEditingTax(null);
      setFormData({
        name: '',
        rate: '',
        country: '',
        region: '',
        isActive: true,
        currencyId: selectedCurrencyId ?? 1
      });
    }
    setShowModal(true);
  };

  const closeModalNew = () => {
    setShowModal(false);
    setEditingTax(null);
    setFormData({
      name: '',
      rate: '',
      country: '',
      region: '',
      isActive: true,
      currencyId: 1
    });
  };

  const deleteTax = (id) => {
    if (window.confirm('Are you sure you want to delete this tax component?')) {
      setTaxRates(taxRates.filter(t => t.id !== id));
    }
  };

  const countries = [
  ...new Set(
    taxRates
      .filter(t => !selectedCurrencyId || t.currencyId === selectedCurrencyId)
      .map(t => t.country)
  )
].filter(Boolean);

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
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tax Rates Setup</h1>
          <button
            onClick={() => openModalNew()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 " />
            Add Tax Rate
          </button>
        </div>



            {/* Currency Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Currency
                </label>

            <div className="flex flex-wrap gap-2 items-center">
              {currencies
                .filter((c) => ["GHS", "USD", "EUR", "GBP"].includes(c.code)) // Show only top 4
                .map((currency) => (
                  <button
                    key={currency.id}
                    onClick={() => setSelectedCurrency(currency)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition cursor-pointer ${
                      selectedCurrency?.code === currency.code
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{currency.flag}</span>
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-sm">{currency.symbol}</span>
                  </button>
                ))}

                    {/* Set as Default Button */}
                    <button
                      onClick={() => {
                        localStorage.setItem('defaultCurrency', selectedCurrency.code);
                        alert(`${selectedCurrency.code} set as default currency`);
                      }}
                      className="px-3 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg border border-yellow-300 flex items-center gap-1 cursor-pointer"
                      title="Set as Default Currency"
                    >
                      <Star className="w-4 h-4" />
                      Set Default
                    </button>

                    {/* More Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowMore((prev) => !prev)}
                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-2 cursor-pointer"
                      >
                        More <span>▼</span>
                      </button>

                      {showMore && (
                        <div className="absolute z-20 mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto w-48">
                          {currencies.map((currency) => (
                            <button
                              key={currency.id}
                              onClick={() => {
                                setSelectedCurrency(currency);
                                setShowMore(false);
                              }}
                              className={`flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700 ${
                                localStorage.getItem('defaultCurrency') === currency.code ? 'bg-yellow-50' : ''
                              }`}
                            >
                              <span className="text-lg">{currency.flag}</span>
                              <span className="font-medium">{currency.code}</span>
                              <span className="text-sm">{currency.symbol}</span>
                              {localStorage.getItem('defaultCurrency') === currency.code && (
                                <Star className="w-4 h-4 text-yellow-500 ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
              </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Tax Components</p>
                <p className="text-2xl font-bold text-green-600">{activeTaxes}</p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tax Rate</p>
                <p className="text-2xl font-bold text-blue-600">{totalTaxRate.toFixed(2)}%</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">%</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Components</p>
                <p className="text-2xl font-bold text-gray-800">{filteredTaxes.length}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">#</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by name or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCountryFilter('all');
                }}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tax Rates Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              Tax Rates ({filteredTaxes.length})
              <span className="ml-2 text-sm text-gray-500">
                {selectedCurrencyObj && `${selectedCurrencyObj.name} (${selectedCurrencyObj.symbol})`}
              </span>
            </h2>
          </div>

          {filteredTaxes.length === 0 ? (
           <div className="text-center py-8 text-gray-600">
  <p className="font-medium text-gray-700 mb-2">
     👋 No taxes found for this Country
  </p>
  <p className="mb-4 text-sm">
    Click Add taxes (e.g., VAT, Sales Tax, GST) for your country to get started.
  </p>
 
</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 border-b border-gray-200 font-medium text-gray-900">Name</th>
                    <th className="px-6 py-3 border-b border-gray-200 font-medium text-gray-900">Rate (%)</th>
                    <th className="px-6 py-3 border-b border-gray-200 font-medium text-gray-900">Country</th>
                    <th className="px-6 py-3 border-b border-gray-200 font-medium text-gray-900">Region/Province/State</th>
                    <th className="px-6 py-3 border-b border-gray-200 font-medium text-gray-900">Status</th>
                    <th className="px-6 py-3 border-b border-gray-200 font-medium text-gray-900 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTaxes.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{t.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{t.rate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{t.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{t.region}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          t.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {t.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openModalNew(t)}
                            className="text-blue-600 hover:text-blue-900 transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTax(t.id)}
                            className="text-red-600 hover:text-red-900 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTax ? 'Edit Tax Rate' : 'Add New Tax Rate'}
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., VAT, GST"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.rate}
                    onChange={(e) => setFormData({...formData, rate: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 15.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Ghana"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region/Province</label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Greater Accra"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">Is Active</label>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={closeModalNew}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {editingTax ? 'Update' : 'Add'} Tax Rate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
