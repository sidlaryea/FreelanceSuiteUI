import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Check, X, Shield, Clock, Users, Zap } from 'lucide-react';
import axios from 'axios';

const UpgradePage = () => {
  // States for navbar functionality
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  // User profile state
  const [userProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    profilePic: '',
    email: 'john.doe@example.com',
    plan: 'Free'
  });

  // Payment modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStep, setPaymentStep] = useState('plan'); // 'plan', 'business', 'payment'
  
  // Business information form
  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    taxId: ''
  });

  useEffect(() => {

    
    const fetchBusinessInfo = async () => {
const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/BusinessInfo`,

         {
          headers: { Authorization: `Bearer ${token}` 
          , "X-API-KEY": apiKey
        },
        
        }
      );
        setBusinessInfo(response.data);
      } catch (error) {
        console.error('Error fetching business info:', error);
      }
    };
    fetchBusinessInfo();
  }, []);

  // Payment form
  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'card', // 'card', 'mobile_money'
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    mobileNumber: '',
    mobileProvider: 'mtn' // 'mtn', 'vodafone', 'airteltigo'
  });

  const profileImageUrl = userProfile.profilePic || './user-placeholder.png';

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      period: 'Forever free',
      description: 'Perfect for freelancers just getting started',
      features: [
        'Up to 20 invoices/month',
        'Email support',
        'Export as PDF',
        'Basic templates'
      ],
      buttonText: 'Get Started',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19,
      period: '/mo',
      yearlyPrice: 199,
      description: 'Ideal for growing businesses needing flexibility',
      features: [
        'Unlimited invoices',
        'Priority email support',
        'Branded PDF templates',
        'Advanced reporting',
        'API access',
        'Custom fields'
      ],
      buttonText: 'Click To Subscribe',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700 cursor-pointer',
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      price: 49,
      period: '/mo',
      yearlyPrice: 499,
      description: 'For teams and enterprises with advanced needs',
      features: [
        'Everything in Pro',
        'Custom branding',
        'Priority support & SLA',
        'Team access and permissions',
        'Advanced integrations',
        'Dedicated account manager'
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer',
      popular: false
    }
  ];

  // Navbar functions (from your provided code)
  const handleSignOut = () => {
    localStorage.clear();
    window.location.replace("/InvoiceAPI_LandingPage/login");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openChangeImageDialog = () => setIsChangeImageDialogOpen(true);
  const closeChangeImageDialog = () => setIsChangeImageDialogOpen(false);
  const openChangePasswordDialog = () => setIsChangePasswordDialogOpen(true);
  const closeChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    // Upload logic would go here
    alert("Upload functionality would be implemented here");
    closeChangeImageDialog();
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("All password fields are required.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    // Change password logic would go here
    alert("Password change functionality would be implemented here");
    closeChangePasswordDialog();
  };

  // Payment modal functions
  const openPaymentModal = (plan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
    setPaymentStep('business');
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPlan(null);
    setPaymentStep('plan');
    setBusinessInfo({
      businessName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      taxId: ''
    });
    setPaymentInfo({
      paymentMethod: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      mobileNumber: '',
      mobileProvider: 'mtn'
    });
  };

  // const handleBusinessInfoSubmit = () => {
  //   setPaymentStep('payment');
  // };

  const handlePaymentSubmit = async () => {
  try {
    const token = localStorage.getItem("jwtToken");

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/Payment/initialize`,
      {
        email: businessInfo.email,
        amount: selectedPlan.price * 100, // convert to smallest currency unit
        callbackUrl: `${window.location.origin}/paymentverify`
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (res.data.authorizationUrl) {
      window.location.href = res.data.authorizationUrl; // redirect user to Paystack
    }
  } catch (err) {
    console.error(err);
    alert("Payment initialization failed.");
  }
};

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Enhanced Navbar */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <img src="./logo.png" alt="InvoiceAPI Logo" className="h-9 w-9 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold text-blue-600 transition-colors group-hover:text-blue-700">
              InvoiceAPI by SidConsult
            </span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 transition-colors group ml-auto mr-4">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">Dashboard</Link>
            <a href="./invoicedashboard" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">Generate Invoices</a>
            <a href="./UpgradePage" className="text-blue-600 hover:text-blue-600 transition-colors font-bold underline">Billing</a>
            <a href="#/" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">API Documentation</a>
            <a href="#/" className="text-blue-600 hover:text-blue-600 transition-colors font-bold">Support</a>
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="text-l font-bold text-blue-600 transition-colors group-hover:text-blue-700">:</div>
            <div className="relative group">
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <img src={profileImageUrl} alt="User" className="w-10 h-10 rounded-full object-cover ms-3" />
              </div>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300">
                <a href="#/" onClick={openModal} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Manage Account
                </a>
                <a href="#/" onClick={handleSignOut} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Sign Out
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Choose the plan that fits your business best. No hidden fees. Cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className={`text-5xl font-bold ${plan.id === 'starter' ? 'text-blue-600' : plan.id === 'business' ? 'text-purple-600' : 'text-blue-600'}`}>
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 text-lg">{plan.period}</span>
                      {plan.yearlyPrice && (
                        <div className="text-sm text-gray-500 mt-1">
                          or ${plan.yearlyPrice}/year (save 12%)
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => plan.id === 'starter' ? null : openPaymentModal(plan)}
                    disabled={plan.id === 'starter'}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${plan.buttonStyle} text-white ${
                      plan.id === 'starter' ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Why Choose InvoiceAPI?</h2>
              <p className="text-blue-100 text-lg">Powerful features to streamline your invoicing workflow</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-blue-100">Generate invoices in seconds with our optimized API</p>
              </div>

              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
                <p className="text-blue-100">Bank-level security with 99.9% uptime guarantee</p>
              </div>

              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Team Collaboration</h3>
                <p className="text-blue-100">Work together with advanced permission controls</p>
              </div>

              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
                <p className="text-blue-100">Get help whenever you need it from our expert team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Manage Account</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <ul className="space-y-3">
              <li>
                <button onClick={openChangeImageDialog} className="text-blue-600 hover:text-blue-800 transition-colors">
                  Change Profile Image
                </button>
              </li>
              <li>
                <button onClick={openChangePasswordDialog} className="text-blue-600 hover:text-blue-800 transition-colors">
                  Change Password
                </button>
              </li>
              <li>
                <a href="#/" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Change User Profile Information
                </a>
              </li>
              <li>
                <a href="/ManageUsers" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Manage Users
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Upgrade to {selectedPlan.name}
                </h2>
                <button onClick={closePaymentModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                ${selectedPlan.price}/{selectedPlan.period.replace('/', '')} - {selectedPlan.description}
              </p>
            </div>

            {paymentStep === 'business' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Business Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company Name *"
                    value={businessInfo.businessName}
                    onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Contact Person *"
                    value={businessInfo.contactPerson}
                    onChange={(e) => setBusinessInfo({...businessInfo, contactPerson: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Business Address"
                    value={businessInfo.address}
                    onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={businessInfo.city}
                    onChange={(e) => setBusinessInfo({...businessInfo, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={typeof businessInfo.country === 'object' && businessInfo.country !== null ? businessInfo.country.name : businessInfo.country}
                    onChange={(e) => setBusinessInfo({...businessInfo, country: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Tax ID (Optional)"
                    value={businessInfo.taxId}
                    onChange={(e) => setBusinessInfo({...businessInfo, taxId: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={!businessInfo.businessName || !businessInfo.contactPerson || !businessInfo.email || !businessInfo.phone}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {paymentStep === 'payment' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
                
                {/* Payment Method Selection */}
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setPaymentInfo({...paymentInfo, paymentMethod: 'card'})}
                    className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                      paymentInfo.paymentMethod === 'card' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentInfo({...paymentInfo, paymentMethod: 'mobile_money'})}
                    className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                      paymentInfo.paymentMethod === 'mobile_money' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-6 h-6 mx-auto mb-2 bg-green-500 rounded"></div>
                    <span className="font-medium">Mobile Money</span>
                  </button>
                </div>

                {paymentInfo.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={paymentInfo.cardholderName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {paymentInfo.paymentMethod === 'mobile_money' && (
                  <div className="space-y-4">
                    <select
                      value={paymentInfo.mobileProvider}
                      onChange={(e) => setPaymentInfo({...paymentInfo, mobileProvider: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="mtn">MTN Mobile Money</option>
                      <option value="vodafone">Vodafone Cash</option>
                      <option value="airteltigo">AirtelTigo Money</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Mobile Number (e.g., 0244123456)"
                      value={paymentInfo.mobileNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, mobileNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Plan: {selectedPlan.name}</span>
                    <span>${selectedPlan.price}/{selectedPlan.period.replace('/', '')}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span>Total</span>
                    <span>${selectedPlan.price}</span>
                  </div>
                </div>

                <button
                  onClick={handlePaymentSubmit}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Complete Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Change Image Modal */}
      {isChangeImageDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Change Profile Image</h2>
              <button onClick={closeChangeImageDialog} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleUpload}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Upload
                </button>
                <button
                  onClick={closeChangeImageDialog}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <button onClick={closeChangePasswordDialog} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Change Password
                </button>
                <button
                  onClick={closeChangePasswordDialog}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional modals for image and password change would go here */}
      {/* ... (keeping them minimal for space) */}
    
    
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

export default UpgradePage;