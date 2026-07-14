import { useState, useEffect, React } from "react";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";
import { jwtDecode } from "jwt-decode";
//import { PaystackButton } from "react-paystack";
import { ensurePaystack } from "./Utils/ensurePaystack";
import ReceiptViewer from "./components/Ui/ReceiptViewer";
import { formatNumber } from "./Utils/formatNumber";
import { useApiInterceptor } from "./components/Hooks/useApiInterceptor";



export default function PaymentPage() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(selectedInvoice?.total || 0);
  const [transactions, setTransactions] = useState([]);
  const [balanceRemaining, setBalanceRemaining] = useState(0);
  
  
  const [unpaidInvoices, setUnpaidInvoices] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [expectedTotal, setExpectedTotal] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  //const [partiallyPaidAmount,setPartiallyPaidAmount] = useState(0);
const [userProfile, setUserProfile] = useState(null);
const [selectedTxnId, setSelectedTxnId] = useState(null);
  const [reference, setReference] = useState("");

  // Logic to calculate KPIs
  useEffect(() => {
    if (invoices.length > 0) {
     // setTotalInvoices(invoices.length);
      setUnpaidInvoices(invoices.filter(inv => inv.status === "Draft").length + invoices.filter(inv => inv.status === "PartiallyPaid").length);
      //setPartiallyPaidAmount(invoices.filter(inv => inv.status === "PartiallyPaid").reduce((acc, inv) => acc + inv.amountPaid, 0));
      setBalanceRemaining(invoices.reduce((acc, inv) => acc + inv.balanceDue, 0));
      setExpectedTotal(invoices.reduce((acc, inv) => acc + Math.round((inv.total || 0) * 100) / 100, 0));
    }
  }, [invoices]);

  useEffect(() => {
    if (transactions.length > 0) {
      setTotalPayments(transactions.reduce((acc, txn) => acc + (txn.amountPaid || 0), 0));
    }
  }, [transactions]);
 
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
const [profileImageUrl, setProfileImageUrl] = useState("./user-placeholder.png");

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
     
  const [error, setError] = useState(null);
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
  setError("Authentication token not found.");
  return;
}

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/Register/update-password`, {
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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/Register/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { profileImageUrl, ...restProfile } = res.data;
      setProfileImageUrl(`${import.meta.env.VITE_API_URL}/${profileImageUrl.replace(/\\/g, '/')}`);
      setUserProfile(restProfile);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  


const fetchInvoices = async () => {
  
    console.log("Fetching invoices..."); // Debug log
    try {
      const apiKey = localStorage.getItem("apiKey"); // Include this if your API requires auth
      const token = localStorage.getItem("jwtToken");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Invoice/GetInvoicesByUserId`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    fetchUserProfile();
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInvoices([]);
    } else {
      setFilteredInvoices(
        invoices.filter((inv) =>
        (
        inv.status === "Draft" ||
        inv.status === "Sent" ||
        inv.status === "PartiallyPaid") &&  

          inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, invoices]);



  useEffect(() => {
  ensurePaystack().catch((e) => {
    console.error("Failed to preload Paystack:", e);
  });
}, []);



  const paymentOptions = [
    { name: "Visa", logo: "./logos/Visa.png" },
    { name: "MasterCard", logo: "./logos/mastercard.png" },
    { name: "MTN Mobile Money", logo: "./logos/mtn.png" },
    { name: "AirtelTigo", logo: "./logos/tigo.jpg" },
    { name: "Telecel Cash", logo: "./logos/telecel.png" },
    {name:"Paystack", logo:"./logos/paystack_logo.png"},
    {name:"Cash", logo:"./logos/cash.png"},
    {name:"Wire Transfer", logo:"./logos/wire transfer.png"},

  ];

  
  
  
const handlePay = async () => {
  if (!selectedInvoice || !selectedMethod) {
    setError("Please select an invoice and payment method.");
    return;
  }

  // Strict reference validation for required methods
  if (selectedMethod !== "Paystack" && selectedMethod !== "Cash" && !reference) {
    setError("Please provide a reference");
    return;
  }

  setError(null);
  setLoading(true);

  try {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    

    const { name } = jwtDecode(token) || {};
    const createdBy = name || "Unknown User";

    // 🔹 If Paystack is chosen
    if (selectedMethod === "Paystack") {
      // 1. Fetch merchant Paystack setup
      const setupRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/PaymentSetup/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Setup response status:", setupRes.status);

      
      if (!setupRes.ok) throw new Error("❌ Failed to fetch payment setup");
      
      
      const setup = await setupRes.json();
      if (!setup?.enablePaystack) {
        alert("❌ Paystack not enabled for this account");
        return;
      }

      // 2. Prepare Paystack details
      const reference = `INV-${selectedInvoice.id}-${Date.now()}`;
      //const amountInPesewas = Math.round(selectedInvoice.total * 100);

      let amountToUse = Number(paymentAmount);
        if (!amountToUse || amountToUse <= 0) {
          amountToUse = Math.round(selectedInvoice.balanceDue);
        }
        const amountInPesewas = Math.round(amountToUse * 100);

      

       // 3) Ensure SDK is present
      await ensurePaystack();



      // ✅ Correct
const handler = window.PaystackPop.setup({
  key: setup.paystackPublicKey,
email: selectedInvoice.customer?.email,
  amount: amountInPesewas,
  currency: setup.paystackCurrency || "GHS",
  reference,
  metadata: { invoiceId: selectedInvoice.id, userId: setup.userId },
  onClose: () => {
    alert("❌ Paystack payment cancelled");
  },
  callback:  function (response)  {
    (async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Payment/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: setup.userId,
          invoiceId: selectedInvoice.id,
          reference: response.reference, // ✅ from Paystack response
          createdBy,
        }),
      });

            if (res.ok) {
              alert("✅ Paystack payment verified & recorded");
              setSuccess("Payment successfully recorded.");
              setSelectedInvoice(null);
              setSelectedMethod(null);
              setSearchTerm(""); // Reset search field
              fetchInvoices(); // Refresh the invoices list
              fetchTransactions();
            } else {
              alert("❌ Could not verify Paystack payment");
            }
          } catch (err) {
            console.error("Verification error:", err);
          }
        })();
        },
       
        
      });

      // Launch checkout
      handler.openIframe();

      return; // 🔹 Stop here so manual flow doesn’t run
    }

    // 🔹 Manual Payment flow
    const firstname = localStorage.getItem("firstname");
    const autoGeneratedRef = `INV-${selectedInvoice.id}-${Date.now()}`;
    const paymentData = {
      invoiceId: selectedInvoice.id,
      transactionId: transactionId || `TXN-${Date.now()}`,
      amount: paymentAmount && paymentAmount > 0 ? Number(paymentAmount) :selectedInvoice.balanceDue,
      paymentMethod: selectedMethod,
      paymentDate: new Date().toISOString(),
      reference:  selectedMethod === "Paystack" || selectedMethod === "Cash" ? reference || autoGeneratedRef :(reference && reference.trim() !== "" ?reference:null ),
      manualReference: reference && reference.trim() !== "" ? reference : null,
      createdBy: firstname,
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Payment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    alert("✅ Manual payment recorded");
    setSuccess("Payment successfully recorded.");
    setReference("");
    setTransactionId("");
    setSelectedInvoice(null);
    setSelectedMethod(null);
    setSearchTerm(""); // Reset search field
    fetchInvoices(); // Refresh the invoices list
    fetchTransactions();
  } catch (err) {
    console.error("Payment error:", err);
    setError("Something went wrong while processing payment ❌");
  } finally {
    setLoading(false);
  }
};

const fetchTransactions = async () => {
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/Payment/last?limit=30`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Fetch response status:", response.status);

    if (!response.ok) {
      throw new Error("❌ Failed to fetch last transactions");
    }

    // Parse JSON response
    const data = await response.json();
    console.log("✅ Transactions loaded:", data);
    console.log("Transaction data structure:", JSON.stringify(data, null, 2)); // Log the structure
    

    // Return transactions to be used by caller
    setTransactions(data);
  } catch (error) {
    console.error("⚠️ Error fetching transactions:", error);
    return [];
  }
};
  



  // Email receipt function
  const handleEmailReceipt = (txnId) => {
    const txn = transactions.find(t => t.id === txnId);
    if (!txn) return;

    // In production: call backend endpoint to send email
    alert(`Emailing receipt for Transaction #${txnId}`);
  };
  
  
  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

useApiInterceptor(); // Initialize the API interceptor



  return (
    <DashboardLayout
      profileImageUrl={profileImageUrl}
      userProfile={userProfile}
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
        

      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
        <div className="mb-8">
     <div className="flex items-center justify-between">
     <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Invoice Management</h1>
      <p className="text-gray-600">Create and manage your payments efficiently!</p>
     </div>

     
   </div>
   </div>
        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Unpaid Invoices</p>
            <h2 className="text-xl font-semibold text-red-600">{unpaidInvoices}</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Remaining Balance</p>
            <h2 className="text-xl font-semibold text-teal-700">GHS {formatNumber(balanceRemaining)}</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Payments</p>
            <h2 className="text-xl font-semibold text-teal-700">GHS {formatNumber(totalPayments)}</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Expected Total </p>
            <h2 className="text-xl font-semibold text-green-600">GHS {formatNumber(expectedTotal)}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Activity Pane */}
          <div className="bg-white rounded shadow p-6 space-y-4 lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Retrieve Invoice</h2>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Invoice</label>
           <input
          type="text"
          placeholder="Type invoice number..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedInvoice(null);
          }}
        />


          {/* Dropdown List */}
      {filteredInvoices.length > 0 && (
        <ul className="border rounded mt-2 max-h-40 overflow-y-auto bg-white shadow z-10">
          {filteredInvoices.map((invoice) => (
            <li
              key={invoice.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
              onClick={() => {
                setSelectedInvoice(invoice);
                setSearchTerm(invoice.invoiceNumber); // show in input
                setFilteredInvoices([]); // hide dropdown
              }}
            >
              {invoice.invoiceNumber} – GHS {formatNumber(invoice.balanceDue)}
            </li>
          ))}
        </ul>
      )}




            {selectedInvoice && (
              <div className="text-sm text-gray-700">
                <p><strong>Customer Name:</strong> {selectedInvoice.customer.fullName}</p>
          <p><strong>Invoice Issue Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
          <p><strong>Balance Due:</strong> GHS {formatNumber(selectedInvoice.balanceDue)}</p>
          <p><strong>Paid Amount:</strong> GHS {formatNumber(selectedInvoice.amountPaid)}</p>


          
             
              </div>
            )}
          </div>

          {/* Center Pane: Payment Options */}
          <div className="bg-white rounded shadow p-6 space-y-4 lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Select Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              {paymentOptions.map((option, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition ${
                    selectedMethod === option.name ? "border-teal-500" : "border-gray-200"
                  }`}
                  onClick={() => setSelectedMethod(option.name)}
                >
                  <img src={option.logo} alt={option.name} className="h-8 object-contain" />
                  <span className="text-sm font-medium text-gray-700">{option.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Activity Pane */}
          <div className="bg-white rounded shadow p-6 space-y-4 lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Payment Summary</h2>
            {["BankTransfer", "MobileMoney", "POS"].includes(selectedMethod) && ( 
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
    <input
      type="text"
      className="w-full border p-2 rounded"
      placeholder="Enter payment reference (e.g. MoMo Txn ID)"
      value={reference}
      onChange={(e) => setReference(e.target.value)}
    />
  </div>
)}
            {selectedInvoice && selectedMethod ? (
                    <>
                        <p className="text-sm text-gray-700 mb-3">
                          You're paying <strong>GHS {formatNumber(paymentAmount && Number(paymentAmount) > 0 ? paymentAmount : selectedInvoice.balanceDue)}</strong> via{" "}
                          <strong>{selectedMethod}</strong>
                        </p>

                        {/* Partial Payment Input */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Payment Amount (GHS)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={selectedInvoice.balanceDue}
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full p-2 border rounded mt-1"
                            placeholder={`Max: GHS ${selectedInvoice.balanceDue.toFixed(2)}`}
                          />
                        </div>

                        {/* Reference Input (only for non-cash / non-paystack) */}
                        {selectedMethod !== "Paystack" && selectedMethod !== "Cash" && (
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Reference / Transaction ID
                            </label>
                            <input
                              required
                              type="text"
                              value={reference}
                              onChange={(e) => {
                                const val = e.target.value;
                                // Only allow alphanumeric, dash, underscore, min 6 chars, max 30
                                if (/^[a-zA-Z0-9-_]{0,30}$/.test(val)) {
                                  setReference(val);
                                }
                              }}
                              className={`w-full p-2 border rounded mt-1 ${
                                reference.length > 0 && !/^[a-zA-Z0-9-_]{6,30}$/.test(reference)
                                  ? "border-red-500"
                                  : ""
                              }`}
                              placeholder="Enter transaction reference"
                              minLength={6}
                              maxLength={30}
                            />
                            {reference.length > 0 && !/^[a-zA-Z0-9-_]{6,30}$/.test(reference) && (
                              <p className="text-red-600 text-xs mt-1">
                                Reference must be 6-30 characters, letters, numbers, dash or underscore only.
                              </p>
                            )}
                          </div>
                        )}

                        {/* Pay Button */}
                        <button
                          onClick={handlePay}
                          disabled={!selectedMethod}
                          className={`px-4 py-2 rounded-md text-white ${
                            selectedMethod === "Paystack"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          } disabled:opacity-50`}
                        >
                          {loading
                            ? "Processing..."
                            : selectedMethod === "Paystack"
                            ? "Proceed to Paystack Checkout"
                            : `Record ${selectedMethod} Payment`}
                        </button>

                        {/* Feedback */}
                        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
                        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                      </>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Select an invoice and a payment method to proceed.
                    </p>
                  )}
          </div>
        </div>
      


       {/* Last Transactions */}
<div className="bg-white p-4 rounded shadow">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold">Last Transactions</h2>
     
    
  </div>

<ul className="mt-4 divide-y divide-gray-200">
  {transactions && transactions.length > 0
    ? transactions.map((txn) => (
        <li key={txn.id} className="flex justify-between items-start py-3">
          {/* Left side */}
          <div>
            <p className="font-medium text-gray-700">
              {txn.customer?.fullName || "Unknown Customer"} (
              {txn.customer?.phone || "No phone"})
            </p>
            <p className="text-gray-500 truncate max-w-[250px]">
              {txn.items?.map((it) => it.name).join(", ") || "No items"}
            </p>
            <p className="text-xs text-gray-400">
              Payment Method: {txn.lastPayment?.paymentMethod || "N/A"}
            </p>
          </div>

          {/* Right side */}
          <div className="text-right">
            <span className="font-semibold text-gray-800 block">
              GHS {formatNumber(txn.amountPaid || 0)}
            </span>
            <div className="flex gap-2 justify-end mt-1">
              <button
                onClick={() => setSelectedTxnId(txn.id)}
                className="text-xs text-blue-500 hover:underline"
              >
                View Receipt
              </button>
              <button
                onClick={() => handleEmailReceipt(txn.id)}
                className="text-xs text-green-500 hover:underline"
              >
                Email Receipt
              </button>
            </div>
          </div>
        </li>
      ))
    : (
      <li className="py-3 text-gray-500 text-sm">No transactions found</li>
    )
  }
</ul>
</div>
{/* Show modal if a transaction is selected */}
      {selectedTxnId && (
        <ReceiptViewer
          txnId={selectedTxnId}
          onClose={() => setSelectedTxnId(null)}
        />
      )}

      
    </div>
    </DashboardLayout>
    
  );
}
