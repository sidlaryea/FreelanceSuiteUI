import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {API_BASE_Invoice} from "./config/api"

export default function CompleteSetup() {
  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    countryId: '',
    companyName: '',
    phone: '',
    address: '',
    logo: '',
    projectTitle: '',
    projectDescription: '',
    industry: '',
    budgetRange: '',
    timeline: '',
    coreproblem: '',
    businessgoal: '',
    paymentTerms: '',
    payStackPublicKey: '',
    payStackSecretkey: '',
    paySatckCurrency: 'GHS',
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    allowPartialPayments: false,
    allowOfflinePayments: false
  });

  const [activeTab, setActiveTab] = useState(0);
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [paystackEnabled, setPaystackEnabled] = useState(false);
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: false,
  });

  const tabTitles = ["Client Info", "Project Details", "Proposal Review", "Payment Setup"];
  
  const nextTab = () => {
  if (activeTab < tabTitles.length - 1) {
    setActiveTab(prev => prev + 1);
  } else {
    handlesubmit();
  }
};

  const getFlagEmoji = (countryCode) => {
    return countryCode
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
  };

  function formatPhone(value) {
    const numbers = value.replace(/\D/g, '');
    const match = numbers.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    const [, a, b, c] = match;
    return !b ? a : `(${a}) ${b}${c ? `-${c}` : ''}`;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Generate Preview Function
  const generatePreview = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  if (!token) return alert("You must be logged in.");
  if (!form.projectTitle) return alert("Please enter a project title first.");

  setIsLoadingPreview(true);

  try {
    const projectPayload = {
      projectTitle: form.projectTitle,
      projectDescription: form.projectDescription,
      industry: form.industry,
      budgetRange: form.budgetRange,
      timeline: form.timeline,
      coreProblem: form.coreproblem,
      businessGoal: form.businessgoal
    };

    const projectResponse = await axios.post(
      `${API_BASE_Invoice}/proposal/api/ProjectOverview`,
      projectPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      }
    );

    const newRequirementId =
      projectResponse.data.requirementId || projectResponse.data.id;

    const previewResponse = await axios.post(
      `${API_BASE_Invoice}/proposal/api/ProposalAi/generate-preview/${newRequirementId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      }
    );

    editor?.commands.setContent(previewResponse.data.preview || "");
    
    

  } catch (error) {
    console.error("Generate preview failed:", error);

    if (error.response) {
      alert(
        error.response.data?.message ||
        `Server error: ${error.response.status}`
      );
    } else {
      alert("Network error. Please try again.");
    }
    } finally {
    setIsLoadingPreview(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handlesubmit = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    if (!token) return alert("You must be logged in.");

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    if (!userId) return alert("User ID not found in token.");

    try {
      // 1. Submit Client Info
      const clientInfoPayload = {
        Name: form.clientName,
        Email: form.clientEmail,
        country: form.countryId,
        companyName: form.companyName,
        Phone: form.phone,
        address: form.address,
        logoFilePath: "",
        userId
      };

      const clientResponse = await axios.post(
        `${API_BASE_Invoice}/proposal/api/Client`,
        clientInfoPayload,
        { headers: { Authorization: `Bearer ${token}`, "X-API-KEY": apiKey } }
      );

      const clientId = clientResponse.data.id;

      // 2. Upload Logo (if selected)
      if (logo && clientId) {
        const logoData = new FormData();
        logoData.append("file", logo);

        await axios.post(
          `${API_BASE_Invoice}/proposal/api/Client/update-logo/${clientId}`,
          logoData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
              "X-API-KEY": apiKey,
            },
          }
        );
      }

      // 3. Submit Project Info
      const projectPayload = {
        projectTitle: form.projectTitle,
        projectDescription: form.projectDescription,
        industry: form.industry,
        budgetRange: form.budgetRange,
        timeline: form.timeline,
        coreproblem: form.coreproblem,
        businessgoal: form.businessgoal
      };

      await axios.post(
        `${API_BASE_Invoice}/proposal/api/ProjectOverview`,
        projectPayload,
        { headers: { Authorization: `Bearer ${token}`, "X-API-KEY": apiKey } }
      );

      // 4. Submit Payment Setup (only if Paystack is enabled)
      if (paystackEnabled) {
        const paymentPayload = {
          id: 0,
          userId,
          enablePaystack: true,
          paystackPublicKey: form.payStackPublicKey,
          paystackSecretKey: form.payStackSecretkey,
          paystackCurrency: form.paySatckCurrency || "GHS",
          bankAccountNumber: form.accountNumber,
          bankName: form.bankName,
          accountName: form.accountHolderName || "",
          allowPartialPayments: form.allowPartialPayments || false,
          acceptOfflinePayments: form.allowOfflinePayments || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await axios.post(
          `${API_BASE_Invoice}/api/PaymentSetup/Save User Payment Setup`,
          paymentPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      alert("Setup completed successfully!");
      localStorage.setItem("setupComplete", "true");
      navigate("/dashboard");

    } catch (error) {
      console.error("Setup submission failed:", error);
      alert("Something went wrong during setup. Please try again.");
    }
  };

  useEffect(() => {
    axios.get(`${API_BASE_Invoice}/api/Industries`)
      .then((res) => {
        const sortedIndustries = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setIndustries(sortedIndustries);
      })
      .catch((err) => console.error("Failed to fetch the industries:", err));
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_Invoice}/api/Country`)
      .then((res) => {
        const sortedCountries = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      })
      .catch((err) => console.error("Failed to fetch countries:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-4xl">
        <div className="flex flex-col items-center mb-10">
          <img src="/logo.png" alt="Logo" className="h-12 w-12 mb-2" />
          <h2 className="text-3xl font-bold text-blue-700">Let's Create Your First Proposal.</h2>
          <p className="text-gray-500 text-center max-w-lg">
            Help us personalize your Proposal by completing these four quick steps.
          </p>
        </div>

        <div className="flex justify-center mb-6 space-x-4">
          {tabTitles.map((title, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {title}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-md shadow-inner min-h-[340px] transition-all duration-300">
          {activeTab === 0 && (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="clientName"
                placeholder="Client Name"
                value={form.clientName}
                onChange={handleChange}
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
              
              <input
                type="email"
                name="clientEmail"
                placeholder="Client Email"
                value={form.clientEmail}
                onChange={handleChange}
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
              <select
                name="countryId"
                value={form.countryId}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl border-2 border-gray-200"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {getFlagEmoji(country.code)} {country.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="companyName"
                placeholder="Clients Company"
                value={form.companyName}
                onChange={handleChange}
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
              <input
                type="telephone"
                name="phone"
                placeholder="Phone Number EX: (123) 456-7890"
                value={form.phone}
                onChange={(e) =>
                  handleChange({ target: { name: "phone", value: formatPhone(e.target.value) } })
                }
                required
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
              <input
                type="text"
                name="address"
                placeholder="Clients Address"
                value={form.address}
                onChange={handleChange}
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3"
              />
              <input
                type="file"
                name="logo"
                placeholder="Cleints Business Logo"
                accept="image/*"
                className="input bg-white border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleFileChange}
              />
              {preview && <img src={preview} alt="Preview" className="mt-4 h-20" />}
            </form>
          )}

          {activeTab === 1 && (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <input type="text" name="projectTitle" onChange={handleChange} value={form.projectTitle} placeholder="Project Title" className="input bg-white border border-gray-300 rounded-lg px-4 py-3 w-full" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                <textarea onChange={handleChange} name="projectDescription" placeholder="Tell us about the project" value={form.projectDescription} className="input bg-white border border-gray-300 rounded-lg px-4 py-3 w-full" rows="4"></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Core Problem</label>
                <textarea onChange={handleChange} name="coreproblem" placeholder="Example: Manual customer onboarding is slow" value={form.coreproblem} className="input bg-white border border-gray-300 rounded-lg px-4 py-3 w-full" rows="4"></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Goal</label>
                <textarea onChange={handleChange} name="businessgoal" placeholder="Example: Increase online sales by 40%" value={form.businessgoal} className="input bg-white border border-gray-300 rounded-lg px-4 py-3 w-full" rows="4"></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  name="industryId"
                  value={form.industryId}
                  onChange={(e) =>
                    setForm({ ...form, industryId: e.target.value, industry: e.target.value })
                  }
                  required
                  className="w-full p-4 rounded-xl border-2 border-gray-200"
                >
                  <option value="">Select an Industry</option>
                  {industries.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <input type="text" name="budgetRange" onChange={handleChange} value={form.budgetRange} placeholder="Budget (Optional)" className="input bg-white border border-gray-300 rounded-lg px-4 py-3 w-full" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                <select name="timeline" value={form.timeline} onChange={handleChange} className="input bg-white border border-gray-300 rounded-lg px-4 py-3 w-full">
                  <option value="">Select Timeline</option>
                  <option value="mvp_2_4_weeks">MVP (2-4 Weeks)</option>
                  <option value="standard_1_2_months">Standard Build (1-2 Months)</option>
                  <option value="complex_3_6_months">Complex Project (3-6 Months)</option>
                  <option value="ongoing">Ongoing / Retainer</option>
                  <option value="not_sure">Not Sure Yet</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button 
                  type="button"
                  onClick={generatePreview}
                  disabled={isLoadingPreview || !form.projectTitle}
                  className="text-blue-600 underline text-sm cursor-pointer disabled:opacity-50"
                >
                  {isLoadingPreview ? "Generating Preview..." : "Click → To Preview Proposal"}
                </button>
              </div>
            </form>
          )}

         {activeTab === 2 && (
  <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
    
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">Proposal Preview</h2>

      <button
        onClick={generatePreview}
        disabled={isLoadingPreview}
        className={`cursor-pointer px-4 py-2 rounded-md text-white font-medium transition 
          ${isLoadingPreview 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {isLoadingPreview ? "Generating..." : "Generate Preview"}
          </button>
        </div>

        <div className="prose max-w-none bg-white p-4 rounded-md border">
          <EditorContent editor={editor} />
        </div>

        </div>
        )}

          {activeTab === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <input type="checkbox" checked={paystackEnabled} onChange={() => setPaystackEnabled(!paystackEnabled)} className="accent-blue-600" />
                <label className="text-gray-700 font-medium">Enable Paystack</label>
              </div>

              {paystackEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="payStackPublicKey" onChange={handleChange} value={form.payStackPublicKey} placeholder="Paystack Public Key" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />
                  <input type="text" name="payStackSecretkey" onChange={handleChange} value={form.payStackSecretkey} placeholder="Paystack Secret Key (optional)" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />
                  <select className="input bg-white border border-gray-300 rounded-lg px-4 py-3" value={form.paySatckCurrency} onChange={handleChange} name="currency">
                    <option value="GHS">GHS - Ghana Cedi</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                  <a href="https://support.paystack.com/en/articles/1006030" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm md:col-span-2">Where do I find my Paystack keys?</a>

                  <input type="text" onChange={handleChange} name="accountHolderName" value={form.accountHolderName} placeholder="Account Holder Name" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />
                  <input type="text" onChange={handleChange} name="accountNumber" value={form.accountNumber} placeholder="Account Number / Wallet Number" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />
                  <input type="text" onChange={handleChange} name="bankName" value={form.bankName} placeholder="Bank Name / MoMo Provider" className="input bg-white border border-gray-300 rounded-lg px-4 py-3" />

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
              <div className="text-center pt-4">
                <button onClick={() => navigate("/login")} className="text-blue-600 underline text-sm">Skip for now → Configure later in dashboard</button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <button onClick={nextTab} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
              {activeTab < 3 ? "Next" : "Finish & Login"}
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }
