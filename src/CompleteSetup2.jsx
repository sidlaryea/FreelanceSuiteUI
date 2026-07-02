import { useState, useEffect } from "react";
import axios from "axios";
//import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./assets/onboard.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// ─── SVG icons ────────────────────────────────────────────────────────────────
const CheckIco = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:12,height:12}}>
    <polyline points="2,7 5.5,10.5 12,3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ArrowIco = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}>
    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const SparkIco = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:13,height:13}}>
    <path d="M8 1.5v13M1.5 8h13M4 4l8 8M12 4l-8 8" strokeLinecap="round"/>
  </svg>
);
const UploadIco = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="#6366f1" strokeWidth="1.8" style={{width:18,height:18}}>
    <path d="M3 14v3h14v-3M10 11V2M6 6l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const LogoIco = () => (
  <svg viewBox="0 0 22 22" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2" style={{width:20,height:20}}>
    <polygon points="11,2 20,7 20,15 11,20 2,15 2,7"/>
    <circle cx="11" cy="11" r="3" fill="rgba(255,255,255,.55)" stroke="none"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function F({ label, span2, children }) {
  return (
    <div className={`cs-field${span2 ? " cs-col2" : ""}`}>
      {label && <label className="cs-label">{label}</label>}
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label, sub }) {
  return (
    <label className="cs-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div className={`cs-pill${checked ? " on" : ""}`} />
      <div>
        <div className="cs-toggle-label">{label}</div>
        {sub && <div className="cs-toggle-sub">{sub}</div>}
      </div>
    </label>
  );
}

function Skeleton() {
  return (
    <div>
      {[90, 70, 80, 55, 65, 45, 75].map((w, i) => (
        <div key={i} className="cs-skel" style={{ width: `${w}%`, height: i === 0 ? 18 : 13 }} />
      ))}
    </div>
  );
}
const token = localStorage.getItem("jwtToken");
let firstName = "";

if (token) {
  const decoded = jwtDecode(token);
  firstName = decoded.FirstName;
}


const flag = (code) =>
  code.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt()));

const fmtPhone = (v) => {
  const n = v.replace(/\D/g, "");
  const m = n.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!m) return v;
  const [, a, b, c] = m;
  return !b ? a : `(${a}) ${b}${c ? `-${c}` : ""}`;
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CompleteSetup() {

  

  const [form, setForm] = useState({
    
    OrganizationName:"",
    OrganizationIndustry:"", organizationEmail:"", organizationPhone:"", organizationAddress:"", organizationLogoUrl:"", organizationWebsite:"", 
    
    
    
    clientName: "", clientEmail: "", countryId: "", companyName: "",
    phone: "", address: "", projectTitle: "", projectDescription: "",
    industry: "",
    budgetRange: "",
    budgetCurrency: "",
    timeline: "",
    coreproblem: "",
    businessgoal: "",
    clientId: null,
    payStackPublicKey: "",
    payStackSecretkey: "",
    paySatckCurrency: "GHS",
    accountHolderName: "", accountNumber: "", bankName: "",
    allowPartialPayments: false, allowOfflinePayments: false,
  });

  const [tab, setTab] = useState(0);
  const [tabKey, setTabKey] = useState(0);
  const [paystack, setPaystack] = useState(false);
  const [orgLogoFile, setOrgLogoFile] = useState(null);
  const [orgLogoPreview, setOrgLogoPreview] = useState(null);
  const [clientLogoFile, setClientLogoFile] = useState(null);
  const [clientLogoPreview, setClientLogoPreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [showRawPreview, setShowRawPreview] = useState(false);
  const [requirementId, setRequirementId] = useState(null);
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  
  const navigate = useNavigate();

  // Budget range helpers: store budgetRange in DB as "<currencyCode> <amount>"
  const handleBudgetCurrencyChange = (e) => {
  const currency = e.target.value;

  const amountOnly = form.budgetRange
    ?.replace(/^[A-Z]{3}\s*/, "")
    ?.trim() || "";

  setForm((prev) => ({
    ...prev,
    budgetCurrency: currency,
    budgetRange: `${currency} ${amountOnly}`.trim(),
  }));
};

  const handleBudgetAmountChange = (e) => {
  const amount = e.target.value;

  setForm((prev) => ({
    ...prev,
    budgetRange: `${prev.budgetCurrency} ${amount}`.trim(),
  }));
};

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: false,
  });

  const STEPS = ["Organization Details","Client Info", "Project Info", "Preview", "Setup Payment"];

  const ch = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const onOrgFile = (e) => {
    const f = e.target.files[0];
    if (f) { 
      setOrgLogoFile(f); 
      setOrgLogoPreview(URL.createObjectURL(f)); 
    }
  };
  
  const onClientFile = (e) => {
    const f = e.target.files[0];
    if (f) { 
      setClientLogoFile(f); 
      setClientLogoPreview(URL.createObjectURL(f)); 
    }
  };
  const goTab = (n) => { 
    setTab(n);
    setTabKey(k => k + 1);
  };
    



  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  

  useEffect(() => {
    axios.get(`${API_URL}/api/Industries`)
      .then((res) => {
        const sortedIndustries = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setIndustries(sortedIndustries);
      })
      .catch((err) => console.error("Failed to fetch the industries:", err));
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/api/Country`)
      .then((res) => {
        const sortedCountries = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      })
      .catch((err) => console.error("Failed to fetch countries:", err));
  }, []);

  const progress = (tab / (STEPS.length - 1)) * 100;

  // eslint-disable-next-line no-unused-vars
  const [currencies, setCurrencies] = useState([]);


  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await axios.get("http://localhost:5214/api/Currency/GetAllCurrencies");
        const mapped = (res.data || []).filter(c => c.isActive ?? true).map(c => ({
          id: c.id,
          code: c.currencyCode || c.code,
          name: c.currencyName || c.currencyCode || c.code,
          symbol: c.symbol || "",
        }));
        setCurrencies(mapped);

        if (!form.budgetCurrency && mapped.length > 0) {
          const defaultCode = "GHS";
          const initial = mapped.find(c => c.code === defaultCode) || mapped[0];
          setForm(prev => ({ ...prev, budgetCurrency: initial.code }));
        }
      } catch (e) {
        console.error("Failed to fetch currencies", e);
      }
    };

    fetchCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

//Save Organization info///
const saveOrganizationInfo = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

const orgInfoPayload = {
    name: form.OrganizationName,
    industry: form.OrganizationIndustry,
    email: form.organizationEmail,
    phone: form.organizationPhone,
    address: form.organizationAddress,
    website: form.organizationWebsite,
};
const response = await axios.post(
  `${API_URL}/proposal/api/Organization`,
  orgInfoPayload,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-KEY": apiKey
    }
  }
);

const orgId = response.data.id;
// Upload Logo (if selected)
if (orgLogoFile && orgId) {
  const logoData = new FormData();
  logoData.append("file", orgLogoFile);
  await axios.post(
    `${API_URL}/proposal/api/Organization/update-logo/${orgId}`,

    logoData,
    {
       headers:{
        Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "X-API-KEY": apiKey,
        },
    }
    );
  }
return orgId;
};





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const saveClientInfo = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");
  const clientInfoPayload = {
    Name: form.clientName,
    Email: form.clientEmail,
    country: form.countryId,
    companyName: form.companyName,
    phone: form.phone,
    address: form.address
  };

  const response = await axios.post(
    `${API_URL}/proposal/api/Client`,
    clientInfoPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey
      }
    }
  );

  const clientId = response.data.id;

  // Persist chosen clientId so project payload can refer to it
  setForm(prev => ({ ...prev, clientId }));

  // Upload Logo (if selected)
  if (clientLogoFile && clientId) {
    const logoData = new FormData();
    logoData.append("file", clientLogoFile);

    await axios.post(
      `${API_URL}/proposal/api/Client/update-logo/${clientId}`,
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

  return clientId;
};

  const saveProjectInfo = async () => {




  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  const projectPayload = {
    clientId: form.clientId,
    projectTitle: form.projectTitle,
    projectDescription: form.projectDescription,
    industry: form.industry,
    budgetRange: form.budgetRange,
    budgetCurrency:form.budgetCurrency,
    timeline: form.timeline,
    coreProblem: form.coreproblem,
    businessGoal: form.businessgoal
  };

  try {

    const response = await axios.post(
      `${API_URL}/proposal/api/ProjectOverview`,
      projectPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      }
    );

    // ⭐ Get RequirementId from backend response
    const requirementId =
      response.data.requirementId || response.data.id;

    // ⭐ Store in React state
    setForm(prev => ({
      ...prev,
      requirementId,
    }));
    setRequirementId(requirementId);

    return requirementId;

    
  } catch (error) {
    console.error("Save project failed", error);
    throw error;
  }
};

  const generatePreview = async () => {

  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  if (!token) return alert("You must be logged in.");
  
  // Set generating state to true to show loading animation
  setGenerating(true);

  try {

    const previewResponse = await axios.post(
      `${API_URL}/proposal/api/ProposalAi/generate-preview/${form.requirementId || requirementId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      }
    );

    const preview = previewResponse.data.preview || "";

    editor?.commands.setContent(preview);
    setPreviewHtml(preview);

    const idToSave = form.requirementId || requirementId;
    if (idToSave) {
      await axios.put(
        `${API_URL}/proposal/api/ProposalAi/update-preview/${idToSave}`,
        { html: preview },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );
    }

  } catch (error) {
    console.error(error);
  } finally {
    // Set generating state to false when done
    setGenerating(false);
  }
};

const savePaymentSetup = async () => {
  if (!paystack) return;

  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");
  const paymentPayload = {
    enablePaystack: true,
    paystackPublicKey: form.payStackPublicKey,
    paystackSecretKey: form.payStackSecretkey,
    paystackCurrency: form.paySatckCurrency || 'GHS',
    accountName: form.accountHolderName,
    bankAccountNumber: form.accountNumber,
    bankName: form.bankName,
    allowPartialPayments: form.allowPartialPayments,
    acceptOfflinePayments: form.allowOfflinePayments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()

  };

  await axios.post(
    `${API_URL}/api/PaymentSetup/Save User Payment Setup`,
    paymentPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey
      }
    }
  );
};
const handleFinish = async () => {
   const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");
  const statusRes = await axios.get(
    `${API_URL}/api/onboarding/status`,
    { headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey
      }}
  );

  if (statusRes.data.proposalSetupComplete) {
    navigate("/dashboard");
  } else {
    goTab(statusRes.data.nextRequiredStep);
  }
};

  // Validate required fields for each tab before proceeding
const validateCurrentTab = (currentTab) => {
  const missing = [];

  if (currentTab === 0) {
    // Organization Info validation
    if (!form.OrganizationName) missing.push("Organization name");
    if (!form.OrganizationIndustry) missing.push("Industry");
    if (!form.organizationEmail.trim()) missing.push("Organization email");
    if (!form.organizationAddress) missing.push("Organization Address");
  } else if (currentTab === 1) {
    // Client Info validation
    if (!form.clientName?.trim()) missing.push("Client name");
    if (!form.clientEmail?.trim()) missing.push("Client email");
    if (!form.countryId) missing.push("Country");
  } else if (currentTab === 2) {
    // Project Info validation
    if (!form.projectTitle?.trim()) missing.push("Project title");
    if (!form.projectDescription?.trim()) missing.push("Project description");
    if (!form.industry) missing.push("Industry");
    if (!form.timeline) missing.push("Timeline");
  } else if (currentTab === 3) {
    // Proposal Preview validation
    return true;
  } else if (currentTab === 4) {
    // Payment tab validation
    if (!form.OrganizationName) missing.push("Organization name");
    if (!form.clientName) missing.push("Client Name");
    if (!form.projectTitle) missing.push("Project title");

    if (paystack) {
      if (!form.payStackPublicKey) missing.push("Paystack public key");
      if (!form.accountHolderName) missing.push("Account holder name");
      if (!form.accountNumber) missing.push("Account number");
      if (!form.bankName) missing.push("Bank / MoMo provider");
    }
  }

  if (missing.length) {
    alert(
      `Please complete required fields before continuing.\n${missing.join(", ")}`
    );
    return false;
  }

  return true;
};

// Validate required fields before finishing onboarding. This runs even when
// Paystack is not toggled; when Paystack is enabled additional payment fields
// are required.
const validateBeforeFinish = () => {
  const missing = [];

  if (!form.clientName) missing.push("Client name");
  if (!form.clientEmail) missing.push("Client email");
  if (!form.projectTitle) missing.push("Project title");

  if (paystack) {
    if (!form.payStackPublicKey) missing.push("Paystack public key");
    if (!form.accountHolderName) missing.push("Account holder name");
    if (!form.accountNumber) missing.push("Account number");
    if (!form.bankName) missing.push("Bank / MoMo provider");
  }

  if (missing.length) {
    alert(
      `Please complete required fields before continuing.\n${missing.join(", ")}`
    );
    return false;
  }

  return true;
};





  return (
    <div className="cs-wrap">
      <div className="cs-orb" />
      <div className="cs-card">

        {/* Header */}
        
        <div className="cs-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="./logo.png" alt="Logo" className="h-10 w-12 mb-4 mt-2 rounded " />
        
          <div className="cs-header-title" style={{ marginTop: '16px' }}>Welcome! {firstName} Lets Create Your First Proposal</div>
          <div className="cs-header-sub">Help us personalize your Proposal by completing these four quick steps.</div>
          <div className="cs-trail">
            {STEPS.map((s, i) => (
              <div key={i} className="cs-trail-item">
                <div className="cs-trail-step" onClick={() => goTab(i)}>
                  <div className={`cs-step-bubble${i === tab ? " active" : i < tab ? " done" : ""}`}>
                    {i < tab ? <CheckIco /> : i + 1}
                  </div>
                  <div className={`cs-step-name${i === tab ? " active" : i < tab ? " done" : ""}`}>{s}</div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`cs-trail-line${i < tab ? " done" : ""}`} style={{ marginTop: 16 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="cs-progress">
          <div className="cs-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Body */}
        <div className="cs-body">

          {/* Tab 0 – Organization Setup */}
{tab === 0 && (
  <div className="cs-enter" key={tabKey}>
    <div className="cs-section-title">Set Up Your Organization</div>
    <div className="cs-section-desc">
      Tell us about your business. This will personalize your proposals and dashboard.
    </div>

    <div className="cs-grid">
      
      <F label="Organization Name">
        <input
          className="cs-input"
          name="OrganizationName"
          placeholder="Sid Consult"
          value={form.OrganizationName}
          onChange={ch}
        />
      </F>

      <F label="Industry">
        <select className="cs-select" name="OrganizationIndustry" value={form.OrganizationIndustry}
                    onChange={e => setForm(f => ({ ...f, OrganizationIndustry: e.target.value }))}>
                    <option value="">Select industry…</option>
                    {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
      </F>

      <F label="Business Email">
        <input
          className="cs-input"
          type="email"
          name="organizationEmail"
          placeholder="hello@sidconsult.com"
          value={form.organizationEmail}
          onChange={ch}
        />
      </F>

      <F label="Business Phone">
        <input
          className="cs-input"
          name="organizationPhone"
          placeholder="(024) 123-4567"
          value={form.organizationPhone}
          onChange={e =>
            ch({
              target: {
                name: "organizationPhone",
                value: fmtPhone(e.target.value)
              }
            })
          }
        />
      </F>

      <F label="Business Address" span2>
        <input
          className="cs-input"
          name="organizationAddress"
          placeholder="123 Ring Rd, Accra"
          value={form.organizationAddress}
          onChange={ch}
        />
      </F>

      <F label="Website" span2>
        <input
          className="cs-input"
          type="url"
          name="organizationWebsite"
          placeholder="www.SidConsult.com"
          value={form.organizationWebsite}
          onChange={ch}
        />
      </F>


      <F label="Organization Logo (Optional)" span2>
        <label className="cs-file-zone">
          <div className="cs-upload-ico"><UploadIco /></div>
          <span className={`cs-file-text${orgLogoFile ? " has" : ""}`}>
            {orgLogoFile
              ? orgLogoFile.name
              : "Click to upload your logo (PNG, JPG, SVG)"}
          </span>
          {orgLogoPreview && (
            <img
              src={orgLogoPreview}
              className="cs-logo-thumb"
              alt="preview"
            />
          )}
          <input type="file" accept="image/*" onChange={onOrgFile} />
        </label>
      </F>

    </div>
    <Link className="cs-skip block text-center " to="/dashboard">
  Click Here To Skip for now — configure later in dashboard
</Link>
  </div>
  
)}

          {/* Tab 1 – Client Info */}
          {tab === 1 && (
            <div className="cs-enter" key={tabKey}>
              <div className="cs-section-title">Client Information</div>
              <div className="cs-section-desc">Who are you building this proposal for?</div>
              <div className="cs-grid">
                <F label="Client Name">
                  <input className="cs-input" name="clientName" placeholder="Jane Doe" value={form.clientName} onChange={ch} />
                </F>
                <F label="Client Email">
                  <input className="cs-input" type="email" name="clientEmail" placeholder="jane@company.com" value={form.clientEmail} onChange={ch} />
                </F>
                <F label="Country">
                  <select className="cs-select" name="countryId" value={form.countryId} onChange={ch}>
                    <option value="">Select country…</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{flag(c.code)} {c.name}</option>)}
                  </select>
                </F>
                <F label="Company Name">
                  <input className="cs-input" name="companyName" placeholder="Acme Corp" value={form.companyName} onChange={ch} />
                </F>
                <F label="Phone">
                  <input className="cs-input" name="phone" placeholder="(024) 123-4567" value={form.phone}
                    onChange={e => ch({ target: { name: "phone", value: fmtPhone(e.target.value) } })} />
                </F>
                <F label="Address">
                  <input className="cs-input" name="address" placeholder="123 Ring Rd, Accra" value={form.address} onChange={ch} />
                </F>
                <F label="Client Logo" span2>
                  <label className="cs-file-zone">
                    <div className="cs-upload-ico"><UploadIco /></div>
                    <span className={`cs-file-text${clientLogoFile ? " has" : ""}`}>
                      {clientLogoFile ? clientLogoFile.name : "Click to upload client logo (PNG, JPG, SVG)"}
                    </span>
                    {clientLogoPreview && <img src={clientLogoPreview} className="cs-logo-thumb" alt="preview" />}
                    <input type="file" accept="image/*" onChange={onClientFile} />
                  </label>
                </F>
              </div>
            </div>
          )}

          {/* Tab 1 – Project Details */}
          {tab === 2 && (
            <div className="cs-enter" key={tabKey}>
              <div className="cs-section-title">Project Details</div>
              <div className="cs-section-desc">Describe the work so we can craft your proposal</div>
              <div className="cs-grid">
                <F label="Project Title" span2>
                  <input className="cs-input" name="projectTitle" placeholder="E.g. Customer Portal Redesign" value={form.projectTitle} onChange={ch} />
                </F>
                <F label="Project Description" span2>
                  <textarea className="cs-textarea" name="projectDescription" placeholder="Briefly describe what this project involves…" value={form.projectDescription} onChange={ch} rows={3} />
                </F>
                <F label="Core Problem" span2>
                  <textarea className="cs-textarea" name="coreproblem" placeholder="E.g. Manual onboarding takes 2 weeks and loses clients" value={form.coreproblem} onChange={ch} rows={2} />
                </F>
                <F label="Business Goal" span2>
                  <textarea className="cs-textarea" name="businessgoal" placeholder="E.g. Increase conversions by 40% in 6 months" value={form.businessgoal} onChange={ch} rows={2} />
                </F>
                <F label="Industry">
                  <select className="cs-select " style={{ width: "80%" }} name="industry" value={form.industry}
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}>
                    <option value="">Select Industry…</option>
                    {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </F>
                <F label="Budget Range" span1>
                  <div className="cs-budget-row" style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 10 }}>
                    <select
                      className="cs-select"
                      name="budgetCurrency"
                      value={form.budgetCurrency}
                      onChange={handleBudgetCurrencyChange}
                    >
                      {currencies.map((c) => (
                        <option key={c.id ?? c.code} value={c.code}>
                          {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                  className="cs-input"
                  style={{ width: "100%" }}
                  name="budgetRange"
                  placeholder="E.g. 5000"
                  value={form.budgetRange?.replace(/^[A-Z]{3}\s*/, "") || ""}
                  onChange={handleBudgetAmountChange}
                />
                  </div>
                </F>
                <F label="Timeline" span2>
                  <select className="cs-select" name="timeline" value={form.timeline} onChange={ch}>
                    <option value="">Select Timeline…</option>
                    <option value="mvp_2_4_weeks">MVP — 2 to 4 weeks</option>
                    <option value="standard_1_2_months">Standard build — 1 to 2 months</option>
                    <option value="complex_3_6_months">Complex project — 3 to 6 months</option>
                    <option value="ongoing">Ongoing / Retainer</option>
                    <option value="not_sure">Not sure yet</option>
                  </select>
                </F>
              </div>
              {/* <div style={{ marginTop: 16 }}>
                <button className="cs-btn-ai" onClick={generatePreview} disabled={generating || !form.projectTitle}>
                  <SparkIco /> {generating ? "Generating…" : "Preview proposal with AI →"}
                </button>
              </div> */}
            </div>
          )}

          {/* Tab 2 – Proposal Preview */}
          {tab === 3 && (
            <div className="cs-enter" key={tabKey}>
              <div className="cs-section-title">Proposal Preview</div>
              <div className="cs-section-desc">AI-generated based on your project details</div>
              <div className="cs-gen-row">
                <span className="cs-gen-label">
                  {previewHtml ? "Review and continue when ready" : "Click Generate to see your proposal"}
                </span>
                <button className="cs-btn-ai" onClick={generatePreview} disabled={generating}>
                  <SparkIco /> {generating ? "Generating…" : "Generate Preview"}
                </button>
              </div>
              <div className="cs-preview-box">
                {generating ? (
                  <Skeleton />
                ) : previewHtml ? (
                  editor ? (
                    <div className="cs-preview-html"><EditorContent editor={editor} /></div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  )
                ) : (
                  <div>
                    <div className="cs-preview-empty">
                      <div className="cs-empty-icon">📄</div>
                      <span>Your AI proposal preview will appear here</span>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <button className="cs-btn-ai" onClick={() => setShowRawPreview(s => !s)} style={{ padding: '6px 10px' }}>
                        {showRawPreview ? "Hide raw preview" : "Show raw preview"}
                      </button>
                      {showRawPreview && (
                        <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8, maxHeight: 220, overflow: 'auto', background: '#f7f7f7', padding: 8 }}>
                          {previewHtml || "(empty)"}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3 – Payment */}
          {tab === 4 && (
            <div className="cs-enter" key={tabKey}>
              <div className="cs-section-title">Payment Setup</div>
              <div className="cs-section-desc">Configure how clients pay you</div>
              <Toggle checked={paystack} onChange={() => setPaystack(p => !p)}
                label="Enable Paystack"
                sub="Accept card and mobile money payments from clients" />

              {paystack && (
                <>
                  <div className="cs-pay-dark">
                    <div className="cs-pay-dark-title">Paystack API Keys</div>
                    <div className="cs-grid">
                      <F label="Public Key">
                        <input className="cs-input" name="payStackPublicKey" placeholder="pk_live_…" value={form.payStackPublicKey} onChange={ch} />
                      </F>
                      <F label="Secret Key (optional)">
                        <input className="cs-input" name="payStackSecretkey" placeholder="sk_live_…" value={form.payStackSecretkey} onChange={ch} />
                      </F>
                      <F label="Currency" span2>
                        <select className="cs-select" name="paySatckCurrency" value={form.paySatckCurrency} onChange={ch}>
                          <option value="GHS">GHS — Ghana Cedi</option>
                          <option value="NGN">NGN — Nigerian Naira</option>
                          <option value="USD">USD — US Dollar</option>
                          <option value="KES">KES — Kenyan Shilling</option>
                          <option value="ZAR">ZAR — South African Rand</option>
                          <option value="XOF">XOF — West African CFA franc</option>
                          <option value="EGP">EGP — Egyptian Pounds</option>
                          <option value="RWF">RWF — Rwandan Francs</option>
                        </select>
                      </F>
                    </div>
                  </div>

                  <div className="cs-info-chip">
                    🔑 Find your keys in <strong style={{margin:"0 3px"}}>Paystack → Settings → API Keys.</strong>
                    <a href="https://support.paystack.com/en/articles/1006030" target="_blank" rel="noopener noreferrer"> To find them click here →</a>
                  </div>

                  <div className="cs-divider">Bank / Mobile Money Details</div>

                  <div className="cs-grid" style={{ marginTop: 12 }}>
                    <F label="Account Holder Name">
                      <input className="cs-input" name="accountHolderName" placeholder="Full legal name" value={form.accountHolderName} onChange={ch} />
                    </F>
                    <F label="Account / Wallet Number">
                      <input className="cs-input" name="accountNumber" placeholder="0XX XXX XXXX" value={form.accountNumber} onChange={ch} />
                    </F>
                    <F label="Bank / MoMo Provider" span2>
                      <input className="cs-input" name="bankName" placeholder="E.g. GCB Bank or MTN MoMo" value={form.bankName} onChange={ch} />
                    </F>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                    <Toggle checked={form.allowPartialPayments}
                      onChange={e => setForm(f => ({ ...f, allowPartialPayments: e.target.checked }))}
                      label="Accept Partial Payments" sub="Clients can pay in installments" />
                    <Toggle checked={form.allowOfflinePayments}
                      onChange={e => setForm(f => ({ ...f, allowOfflinePayments: e.target.checked }))}
                      label="Allow Offline Payments" sub="Bank / MoMo details will appear on invoices" />
                  </div>
                </>
              )}
              <div className="cs-skip">Skip for now — configure later in dashboard</div>
            </div>
          )}

          {/* Actions */}
        <div className="cs-actions">
  <button
    className="cs-btn-back"
    style={{ visibility: tab === 0 ? "hidden" : "visible" }}
    onClick={() => goTab(tab - 1)}
  >
    ← Back
  </button>

  <button
    type="button"
    className="cs-btn-next"
    onClick={async () => {
      // First, validate the current tab before proceeding
      if (!validateCurrentTab(tab)) return;
      
      try {
        if (tab === 0) {
          await saveOrganizationInfo();
          goTab(1);
        } else if (tab === 1) {
          await saveClientInfo();
          goTab(2);
        } else if (tab === 2) {
          await saveProjectInfo();
          goTab(3);
         } else if (tab === 3) {
          //Generate Preview before going to payment setup
          
          goTab(4);
        } else if (tab === 4) {
          // Run shared validation (includes core fields and, when Paystack is
          // enabled, the payment fields). The helper shows the same alert
          // message used elsewhere and returns false when validation fails.
          if (!validateBeforeFinish()) return;

          await savePaymentSetup();
          await handleFinish();
        }
      } catch (err) {
        console.error("step navigation error", err);
        alert("An error occurred. Please check your connection and try again.");
      }
    }}
  >
    {tab < STEPS.length - 1 ? "Continue" : "Finish & Go to Dashboard"}
  </button>
</div>

        </div>
      </div>
    </div>
  );
}
