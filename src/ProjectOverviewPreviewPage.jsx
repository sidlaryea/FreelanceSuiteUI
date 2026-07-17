import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Sidebar from "./components/Sidebar";
import UpgradeLimitModal from "./components/Ui/UpgradeLimitModal";
import { API_BASE_Invoice,API_BASE_Proposal } from "./config/api";


// Icons (same as Dashboard2)
const Icon = {
  dashboard: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  proposals: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 12h6M9 16h4M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>,
  clients:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="7" r="3"/><path d="M17 20H7a4 4 0 01-4-4 6 6 0 016-6h6a6 6 0 016 6 4 4 0 01-4 4z"/></svg>,
  insights:  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  billing:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  settings:  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  bell:      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  search:    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  chevron:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
  arrowLeft: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
};

export default function ProjectOverviewPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ setUserData] = useState(null);
  const [showCompleteDetailsModal, setShowCompleteDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({});
  const [industries, setIndustries] = useState([]);
  const [clients, setClients] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [budgetCurrency, setBudgetCurrency] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const normalizeText = (value) => value?.toString().trim().toLowerCase() || "";
  const [editedHtml, setEditedHtml] = useState("");
  const [previews, setPreviews] = useState([]);
  const [selectedPreviewId, setSelectedPreviewId] = useState(null);
  const [pricingItems, setPricingItems] = useState([]);
const [showUpgradeModal,setShowUpgradeModal] = useState(false);
  


  const previewRef = useRef();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https"
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"]
      })
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setEditedHtml(editor.getHTML());
    }
  });

  const editorButtonClass = (isActive = false, isDisabled = false) =>
    `px-3 py-1.5 rounded-md text-sm border transition-colors ${
      isActive
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
    } ${isDisabled ? "opacity-50 cursor-not-allowed hover:bg-white" : ""}`;



  useEffect(() => {
  const loadData = async () => {
      const [industryList] = await Promise.all([
        fetchIndustries(),
        fetchClients(),
        fetchCurrencies()
      ]);
      fetchUserData();
      await fetchOverview(industryList || []);
    };
    loadData();
  }, []);

  const fetchPreviews = async (requirementId) => {
    if (!requirementId) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("apiKey");

      const response = await axios.get(
        `${API_BASE_Proposal}/api/ProposalAi/requirement/${requirementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );

      setPreviews(response.data);

      // ✅ auto select latest preview
      if (response.data.length > 0) {
        const latest = response.data[0];
        setSelectedPreviewId(latest.id);
        setEditedHtml(latest.html);
        editor?.commands.setContent(latest.html);
      }
    } catch (error) {
      console.error("Failed to fetch previews", error);
    }
  };

  useEffect(() => {
    const requirementId = overview?.requirementId || id;
    if (!requirementId) return;

    fetchPreviews(requirementId);
  }, [id, overview?.requirementId]);

  const fetchOverview = async (industryList = industries) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("apiKey");
      
      const response = await axios.get(
        `${API_BASE_Proposal}/api/ProjectOverview/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );
      setOverview(response.data);

    

      const resolvedIndustryId =
        response.data.industryId?.toString() ||
        industryList.find(ind => ind.id?.toString() === response.data.industry?.toString())?.id?.toString() ||
        industryList.find(ind => normalizeText(ind.name) === normalizeText(response.data.industry))?.id?.toString() ||
        "";

      // populate form with all fields - use string ID for select
      setForm({
        projectTitle: response.data.projectTitle || "",
        projectDescription: response.data.projectDescription || "",
        coreProblem: response.data.coreProblem || "",
        businessGoal: response.data.businessGoal || "",
        industryId: resolvedIndustryId,
        budgetRange: response.data.budgetRange || "",
        budgetCurrency:response.data.budgetCurrency || "",
        timeline: response.data.timeline || "",
        targetAudience: response.data.targetAudience || "",
        projectType: response.data.projectType || "",
        keyFeaturesSummary: response.data.keyFeaturesSummary || "",
        clientId: response.data.clientId?.toString() || ""
      });
    } catch (error) {
      console.error("Failed to load overview", error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    setError("");
  };

  const handleBudgetCurrencyChange = (e) => {
    const value = e.target.value;
    setBudgetCurrency(value);
    if (budgetAmount) {
      setForm(prev => ({ ...prev, budgetRange: `${value} ${budgetAmount}` }));
    }
  };

  const handleBudgetAmountChange = (e) => {
    const value = e.target.value;
    setBudgetAmount(value);
    if (budgetCurrency) {
      setForm(prev => ({ ...prev, budgetRange: `${budgetCurrency} ${value}` }));
    }
  };

  const getIndustryNameById = (industryId) => {
    if (!industryId) return "";
    return industries.find(ind => ind.id.toString() === industryId.toString())?.name || "";
  };

  const getIndustryIdByName = (industryName) => {
    if (!industryName) return "";
    const matchedIndustry = industries.find(ind =>
      ind.id.toString() === industryName.toString() ||
      normalizeText(ind.name) === normalizeText(industryName)
    );
    return matchedIndustry?.id?.toString() || "";
  };

  // Sync budget on mount/form change
  useEffect(() => {
    if (form.budgetRange) {
      const match = form.budgetRange.match(/^([A-Z]{3})\s*(.+)$/);
      if (match) {
        setBudgetCurrency(match[1]);
        setBudgetAmount(match[2]);
      }
    }
  }, [form.budgetRange]);


useEffect(() => {
  if (overview?.aiProposalPreviewHtml) {
    const initialHtml = formatIfPlainText(overview.aiProposalPreviewHtml);
    setEditedHtml(initialHtml);
    editor?.commands.setContent(initialHtml, false);
  }
}, [overview?.aiProposalPreviewHtml, editor]);


  const updateOverview = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("apiKey");

      const fallbackIndustryId =
        form.industryId?.toString() ||
        overview?.industryId?.toString() ||
        getIndustryIdByName(overview?.industry);

      const selectedIndustryId = fallbackIndustryId ? parseInt(fallbackIndustryId, 10) : null;
      const industryName = getIndustryNameById(fallbackIndustryId) || overview?.industry || "";

      const payload = {
        projectTitle: form.projectTitle,
        projectDescription: form.projectDescription,
        projectType: form.projectType,
        ...(selectedIndustryId
          ? {
              industryId: selectedIndustryId,
              industry: fallbackIndustryId
            }
          : {}),
        budgetRange: form.budgetRange,
        budgetCurrency: form.budgetCurrency,
        timeline: form.timeline,
        businessGoal: form.businessGoal,
        targetAudience: form.targetAudience,
        coreProblem: form.coreProblem,
        keyFeaturesSummary: form.keyFeaturesSummary
      };


      console.log("Updating with payload:", payload);

      await axios.put(
        `${API_BASE_Proposal}/api/ProjectOverview/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );

      setOverview(prev => ({
        ...prev,
        ...payload,
        industryId: selectedIndustryId ?? prev?.industryId,
        industry: industryName || prev?.industry
      }));
      setShowEditModal(false);
      setShowCompleteDetailsModal(false);
      await fetchOverview();
    } catch (error) {
      console.error("Failed to update overview", error);
      setError(error.response?.data?.message || "Failed to update project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    
    if (!token) return;
    
    try {
      const response = await axios.get(
        `${API_BASE_Invoice}/api/Register/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // const getUserInitials = () => {
  //   if (userData?.name) {
  //     const names = userData.name.split(' ');
  //     return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  //   }
  //   if (userData?.email) {
  //     return userData.email[0].toUpperCase();
  //   }
  //   return "U";
  // };

  const fetchIndustries = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    try {
      const response = await axios.get(`${API_BASE_Invoice}/api/Industries`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      });
      setIndustries(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to load industries", error);
      return [];
    }
  };

  const fetchClients = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    try {
      const response = await axios.get(`${API_BASE_Proposal}/api/Client/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      });
      setClients(response.data);
    } catch (error) {
      console.error("Failed to load clients", error);
    }
  };

  const fetchCurrencies = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    try {
      const response = await axios.get(`${API_BASE_Invoice}/api/Currency/GetAllCurrencies`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      });
      setCurrencies(response.data.filter(c => c.isActive));
    } catch (error) {
      console.error("Failed to load currencies", error);
    }
  };

  // Generate Preview Function
  const generatePreview = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  const requirementId = overview?.requirementId;

  if (!requirementId) {
    alert("Missing requirement ID.");
    return;
  }

  setIsLoadingPreview(true);

  try {
    const response = await axios.post(
      `${API_BASE_Proposal}/api/ProposalAi/generate-preview/${requirementId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      }
    );

    const newPreview = {
      id: response.data.previewId,
      html: response.data.preview
    };

    // ✅ ADD to list
    setPreviews(prev => [newPreview, ...prev]);

    // ✅ SELECT it
    setSelectedPreviewId(newPreview.id);
    setEditedHtml(newPreview.html);
    editor?.commands.setContent(newPreview.html);
    window.location.reload();

  } catch (error) {
    console.error(error);
  } finally {
    setIsLoadingPreview(false);
  }
};

//Generate Detailed Preview Function
const generateDetailedPreview = async () => {

  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");
  const requirementId = overview?.requirementId;
  if (!requirementId) {
    alert("Missing requirement ID.");
    return;
  }
  setIsLoadingPreview(true);
  try {
    const response = await axios.post(
      `${API_BASE_Proposal}/api/ProposalAi/generate-detailed-preview/${requirementId}`,
      
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      }
    );
    const {  pricing } = response.data;
    const newPreview = {  
      id: requirementId,
      html: response.data.detailedPreview
    };

 

    // ✅ SAVE PRICING TEMPORARILY
    setPricingItems(pricing || []);

    // ✅ ADD to list
    setPreviews(prev => [newPreview, ...prev]);
    // ✅ SELECT it
    setSelectedPreviewId(newPreview.id);
    setEditedHtml(newPreview.html);
    console.log(response.data);
    editor?.commands.setContent(newPreview.html);
    //window.location.reload();
  } catch (error) {
if (
    error.response?.data?.code === "PROPOSAL_LIMIT_REACHED"
  ) {
    setShowUpgradeModal(true);
    return;
  }

    console.error(error);
  } finally {
    setIsLoadingPreview(false);
  }
};




///////////Generate Proposal Draft Function (from existing preview) - redirects to draft page after creation ///////////

const generateDraftFromPreview = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  if (missingFields) {
    setError("");
    setShowCompleteDetailsModal(true);
    return;
  }

  if (!overview?.aiProposalPreviewHtml) {
    alert("Please generate a detailed AI preview first.");
    return;
  }

  // Backend draft generation expects pricingItems; if user didn't regenerate the response,
  // pricingItems will still be empty.
  // if (!Array.isArray(pricingItems) || pricingItems.length === 0) {
  //   setError("");
  //   setShowCompleteDetailsModal(true);
  //   setError("Save Changes And Click Regenerate Reponse Before Generating Draft");
  //   return;
  // }

  try {
    const response = await axios.post(
      `${API_BASE_Proposal}/api/ProposalDraft/generate-from-overview/${overview.id}`,
      {
        pricingItems: pricingItems // send current pricing if any - backend will decide how to use it
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      }
    );

if (response.data?.id) {
  navigate(`/ProposalDraftEditorPage/${response.data.id}`);
} else {
  console.error('No draft ID received from API');
  alert('Failed to create draft. No ID received.');
}

} catch (error) {
    console.error(error);
  }
};

///////////////////////// PDF Export Function///////////////////////////////////////
const exportToPDF = async () => {
  const element = previewRef.current;

  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2, // better quality
    useCORS: true
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${overview.projectTitle || "proposal"}.pdf`);
};


const saveEditedPreview = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    const htmlToSave = editor?.getHTML() || editedHtml;

    await axios.put(
      `${API_BASE_Proposal}/api/ProposalAi/update-preview/${selectedPreviewId}`,
      { html: htmlToSave },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      }
    );

    setOverview((prev) => ({
      ...prev,
      aiProposalPreviewHtml: htmlToSave
    }));
    setEditedHtml(htmlToSave);
    alert("Preview updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to save changes");
  }
};

const cleanPreviewHtml = (html) => {
  if (!html) return "";

  // Remove markdown wrappers
  html = html.replace(/```html/gi, "").replace(/```/g, "").trim();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Remove unwanted tags
  doc.querySelectorAll("head, style, script, link, meta, title").forEach(el => el.remove());

  const body = doc.body;

  // ✅ Replace <section> with styled blocks
  body.querySelectorAll("section").forEach(section => {
    const div = document.createElement("div");
    div.innerHTML = section.innerHTML;
    div.className = "mb-6";
    section.replaceWith(div);
  });

  // ✅ Force headings to stand out
  body.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(h => {
    h.classList.add("font-bold");
    // Add accessible heading spacing for any levels inside prose output
    if (!h.classList.contains("mt-4")) {
      h.classList.add("mt-4");
    }
  });

  // ✅ Remove layout-breaking styles
  body.querySelectorAll("*").forEach(el => {
    el.removeAttribute("style");
    // Preserve prose classes - only remove non-prose classes
    if (el.classList) {
      const safeClasses = Array.from(el.classList).filter(c => c.match(/^prose-/) !== null || c === "font-bold" || c === "mt-4");
      if (!el.className.includes("ql-")) { // Remove Quill editor classes
      el.className = safeClasses.join(" ");
      }
    }
  });

  return DOMPurify.sanitize(body.innerHTML);
};





const formatIfPlainText = (html) => {
  if (!html) return "";

  // Remove ```html wrappers
  let cleaned = html
    .replace(/```html/gi, "")
    .replace(/```/g, "")
    .trim();

  // If it already contains HTML tags, return as-is
  if (/<\/?[a-z][\s\S]*>/i.test(cleaned)) {
    return cleaned;
  }

  const headings = [
    "Introduction",
    "Understanding of the Problem",
    "Proposed Solution",
    "Timeline",
    "Budget Justification",
    "Closing Statement"
  ];

  const normalizedHeadings = headings.map(h => h.toLowerCase());
  const blocks = [];
  let currentLines = [];

  const flushBlock = () => {
    if (!currentLines.length) return;

    const textBlock = currentLines.join(" ").trim();
    if (!textBlock) {
      currentLines = [];
      return;
    }

    const lower = textBlock.toLowerCase();
    const headingIdx = normalizedHeadings.indexOf(lower);

    if (headingIdx !== -1) {
      blocks.push(`<h2>${headings[headingIdx]}</h2>`);
    } else {
      const paragraph = currentLines.join(" ").replace(/\s*\n\s*/g, "<br />");
      blocks.push(`<p>${paragraph}</p>`);
    }

    currentLines = [];
  };

  cleaned.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushBlock();
      return;
    }

    const headingIdx = normalizedHeadings.indexOf(trimmed.toLowerCase());
    if (headingIdx !== -1) {
      flushBlock();
      blocks.push(`<h2>${headings[headingIdx]}</h2>`);
      return;
    }

    currentLines.push(trimmed);
  });

  flushBlock();

  return blocks.join("");
};


const selectedPreview = previews.find(p => p.id === selectedPreviewId);

  const missingFields =
overview &&
(!overview.targetAudience ||
 !overview.projectType ||
 !overview.keyFeaturesSummary);


 useEffect(() => {
  if (previews.length > 0 && !selectedPreviewId) {
    const first = previews[0];
    setSelectedPreviewId(first.id);
    setEditedHtml(first.html);
    editor?.commands.setContent(first.html);
  }
}, [previews]);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#f6f8fc] overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f6f8fc] overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <Sidebar />

      {/* ── MAIN ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f6f8fc]">
        {/* TOPNAV */}
        <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-7 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <button onClick={() => navigate("/ProjectOverviewPage")} className="hover:text-slate-600 transition-colors flex items-center gap-1">
              <span>{Icon.arrowLeft}</span>
              <span>AI Previews</span>
            </button>
            <span className="text-slate-300">{Icon.chevron}</span>
            <span className="text-slate-700 font-medium">Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 w-52 focus-within:border-slate-400 transition-colors">
              <span className="text-slate-400">{Icon.search}</span>
              <input className="bg-transparent outline-none text-sm text-slate-700 flex-1 placeholder:text-slate-400" placeholder="Search…"/>
            </div>
            <button className="relative w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              {Icon.bell}
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"/>
            </button>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto px-7 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-8 text-white shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-300 mb-2">Project Overview Preview</p>
                  <h1 className="text-3xl font-semibold tracking-tight">{overview?.projectTitle || 'Loading...'}</h1>
                  <p className="mt-3 max-w-2xl text-slate-200">Review the AI preview, edit content, and export your proposal with a consistent page experience.</p>
                </div>
                
              </div>
            </div>

            <div className="bg-white/95 rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h2 className="text-[19px] font-semibold text-slate-900 tracking-tight">
                  {overview?.projectTitle || 'Loading...'}
                </h2>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-6">
                <div>
                  <h3 className="text-[14px] font-medium text-slate-400 uppercase tracking-widest mb-2">
                    Project Description
                  </h3>
                  <p className="text-1xl text-slate-600">
{overview?.projectDescription || ''}
                  </p>
                </div>

                

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[14px] font-medium text-slate-400 uppercase tracking-widest mb-2">
                      Industry
                    </h3>
{industries.find(ind => ind.id.toString() === (overview?.industryId || overview?.industry)?.toString())?.name || 'Industry not found'}
                  </div>

                  <div>
                    <h3 className="text-[14px] font-medium text-slate-400 uppercase tracking-widest mb-2">
                      Budget Range
                    </h3>
 {overview?.budgetRange || 'Not Provided Yet'}
                  </div>

                  <div>
                    <h3 className="text-[14px] font-medium text-slate-400 uppercase tracking-widest mb-2">
                      Timeline
                    </h3>
{overview?.timeline || ''}
                  </div>

                  <div>
                    <h3 className="text-[14px] font-medium text-slate-400 uppercase tracking-widest mb-2">
                      Target Audience
                    </h3>
{overview?.targetAudience || "Not Provided Yet"}
                  </div>
                </div>


                <div>
                  <h3 className="text-[14px] font-medium text-slate-400 uppercase tracking-widest mb-2">
                    Business Goal
                  </h3>
{overview?.businessGoal || ''}
                </div>

                <div>
                  <h3 className="text-[14px] font-medium text-slate-400 uppercase tracking-widest mb-2">
                    Core Problem
                  </h3>
{overview?.coreProblem || ''}
                </div>

                <div>
                  <h3 className="text-[14px] font-medium text-slate-400 uppercase tracking-widest mb-2">
                    Key Features Summary
                  </h3>
{overview?.keyFeaturesSummary || "Features will be defined later."}
                </div>
              </div>
            </div>
            <div className="h-6"> </div>

            {overview?.aiProposalPreviewHtml && (
              <div className={`p-4 rounded-3xl mt-6 ${
  missingFields 
    ? "bg-yellow-50 border border-yellow-200"
    : "bg-green-50 border border-green-200"
}`}>
                {missingFields ? (
                  <p className="text-yellow-700 text-sm">
                    Complete your Project Requirements Details to improve the AI proposal Response.
                    <button
                      onClick={() => setShowCompleteDetailsModal(true)}
                      className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 ml-4 cursor-pointer"
                    >
                      Complete Details
                    </button>
                  </p>
                ) : (
                  <p className="text-green-700 text-sm">
                    You have successfully updated your project details. To see improvements in the AI proposal, click here:
                    <button
                      onClick={generateDetailedPreview}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 ml-4 cursor-pointer"
                    >
                    Regenerate Response
                    </button>
                  </p>
                )}
              </div>
            )}
                

                

            {/* AI PROPOSAL PREVIEW */}
            <div className="bg-white/95 rounded-3xl border border-slate-200 p-6 mt-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-slate-900">AI Generated Proposal Preview</h2>
                <div className="flex flex-wrap gap-2">
                  {previews.map((p, index) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPreviewId(p.id);
                        setEditedHtml(p.html);
                        editor?.commands.setContent(p.html);
                      }}
                      className={`px-3 py-1 rounded-2xl text-sm font-medium ${
                        selectedPreviewId === p.id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Version {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              {isLoadingPreview ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm text-slate-500">Generating AI proposal...</p>
                </div>
              ) : selectedPreview ? (
                <div
                  ref={previewRef}
                  className="prose prose-slate max-w-3xl mx-auto prose-h1:text-2xl prose-h1:font-bold prose-h2:text-lg prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-2 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-3 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:my-3 prose-strong:text-slate-900 [&_*]:break-words [&_*]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: cleanPreviewHtml(formatIfPlainText(selectedPreview.html)) }}
                />
              ) : (
                <p className="text-slate-500 text-sm">AI preview not generated yet.</p>
              )}
            </div>

            <div className="bg-white/95 rounded-3xl border border-slate-200 p-4 mt-4 shadow-sm">
              <label className="block text-2xl font-medium text-slate-700 mb-3">
                Edit Proposal Content
              </label>

              <div className="flex flex-wrap gap-2 mb-3 ">
                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={editorButtonClass(editor?.isActive("bold"))}>Bold</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={editorButtonClass(editor?.isActive("italic"))}>Italic</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={editorButtonClass(editor?.isActive("underline"))}>Underline</button>
                
                <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editorButtonClass(editor?.isActive("bulletList"))}>Bullets</button>
                
                <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={editorButtonClass(editor?.isActive("heading", { level: 1 }))}>H1</button>
                <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={editorButtonClass(editor?.isActive("heading", { level: 2 }))}>H2</button>
                <button type="button" onClick={() => editor?.chain().focus().setParagraph().run()} className={editorButtonClass(editor?.isActive("paragraph"))}>Paragraph</button>
                <button type="button" onClick={() => editor?.chain().focus().setTextAlign("left").run()} className={editorButtonClass(editor?.isActive({ textAlign: "left" }))}>Left</button>
                <button type="button" onClick={() => editor?.chain().focus().setTextAlign("center").run()} className={editorButtonClass(editor?.isActive({ textAlign: "center" }))}>Center</button>
                <button type="button" onClick={() => editor?.chain().focus().setTextAlign("right").run()} className={editorButtonClass(editor?.isActive({ textAlign: "right" }))}>Right</button>
                <button type="button" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().chain().focus().undo().run()} className={editorButtonClass(false, !editor?.can().chain().focus().undo().run())}>Undo</button>
                <button type="button" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().chain().focus().redo().run()} className={editorButtonClass(false, !editor?.can().chain().focus().redo().run())}>Redo</button>
              </div>

              <div className="border border-slate-300 rounded-lg p-4 min-h-[260px] [&_.ProseMirror]:min-h-[220px] [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_p]:my-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_a]:text-blue-600 [&_.ProseMirror_a]:underline">
                <EditorContent editor={editor} />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(true)}
                        className="bg-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-300 cursor-pointer transition-colors"
                        >
                        Edit Project Info
                      </button>

                      <button
                              onClick={exportToPDF}
                              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 cursor-pointer transition-colors"
                            >
                              Export PDF
                          </button>

                          <button
                                  onClick={saveEditedPreview}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 cursor-pointer transition-colors"
                                >
                                  Save Edits
                                </button>

                                

<button
                        onClick={() => {
                          if (overview?.aiProposalPreviewHtml) {
                            if (missingFields) {
                              setShowCompleteDetailsModal(true);
                              setError("Complete Requirement Details Before Generating Draft");
                              return;
                            }
                            generateDraftFromPreview();
                          } else {
                            generatePreview();
                          }
                        }}
                        disabled={isLoadingPreview}

                        className={`bg-blue-600 text-white px-6 py-3 rounded-lg text-sm hover:bg-blue-700 cursor-pointer transition-colors ${isLoadingPreview ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                        {isLoadingPreview ? 'Generating Preview...' : overview?.aiProposalPreviewHtml ? 'Generate Proposal Draft' : ' Generate AI Preview'}
                      </button>
                      


{showCompleteDetailsModal && (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

<div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">

<h2 className="text-lg font-semibold mb-6">
Complete Project Details
</h2>

{error && (
  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
    {error}
  </div>
)}

<div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${saving ? 'pointer-events-none opacity-75' : ''}`}>

  <div className="md:col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">
Project Type
</label>
<select
  name="projectType"
  value={form.projectType || ""}
  onChange={handleChange}
  disabled={saving}
  className="w-full border border-gray-300 rounded-lg px-4 py-3 disabled:opacity-50"
>
  <option value="">Select project type...</option>
  <option value="Web Application">Web Application</option>
  <option value="Mobile App">Mobile App</option>
  <option value="Desktop Application">Desktop Application</option>
  <option value="API/Backend Service">API/Backend Service</option>
  <option value="SaaS Platform">SaaS Platform</option>
  <option value="E-commerce Platform">E-commerce Platform</option>
  <option value="CMS/Content Platform">CMS/Content Platform</option>
  <option value="Data Analytics Dashboard">Data Analytics Dashboard</option>
  <option value="IoT Application">IoT Application</option>
  <option value="Other">Other</option>
</select>
</div>

<div className="md:col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">
Target Audience
</label>

<input
type="text"
name="targetAudience"
value={form.targetAudience || ""}
onChange={handleChange}
placeholder="Example: Small and Medium Enterprises in the retail sector, aged 30-50."
className="w-full border border-gray-300 rounded-lg px-4 py-3"
/>
</div>

<div className="md:col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">
Key Features Summary
</label>

<textarea
name="keyFeaturesSummary"
value={form.keyFeaturesSummary || ""}
onChange={handleChange}
rows="4"
placeholder="Example: The proposed solution will include a robust set of features designed to ensure performance, scalability, and ease of use. Key functionalities include [core feature 1], [core feature 2], and [core feature 3], along with advanced capabilities such as [automation/integration/security].The system will be built with a focus on user experience, reliability, and future scalability, ensuring it can grow alongside your business needs."
className="w-full border border-gray-300 rounded-lg px-4 py-3"
/>
</div>

  <div className="md:col-span-2 flex justify-end gap-3 mt-4">

<button
type="button"
onClick={() => setShowCompleteDetailsModal(false)}
disabled={saving}
className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-300 disabled:opacity-50"
>
Cancel
</button>

<button
type="button"
onClick={updateOverview}
disabled={saving}
className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
>
{saving ? 'Saving...' : 'Save Changes'}
</button>

</div>

</div>

</div>
</div>
)}

{showEditModal && (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

<div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">

<h2 className="text-lg font-semibold mb-6">
Edit Project
</h2>

{error && (
  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
    {error}
  </div>
)}

<form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => {
  e.preventDefault();
  updateOverview();
}}>

{/* Project Title */}

<div className="md:col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">
Project Title
</label>

<input
type="text"
name="projectTitle"
value={form.projectTitle || ""}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3"
/>
</div>

{/* Project Type */}

<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Project Type
</label>

<select
name="projectType"
value={form.projectType || ""}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3"
>
<option value="">Select Project Type</option>
<option value="web_app">Web Application</option>
<option value="mobile_app">Mobile App</option>
<option value="website">Website</option>
<option value="ecommerce">E-commerce</option>
<option value="saas">SaaS Platform</option>
<option value="api">API/Backend</option>
<option value="automation">Automation</option>
<option value="other">Other</option>
</select>
</div>

{/* Client */}

<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Client
</label>

<select
name="clientId"
value={form.clientId || ""}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3"
>
<option value="">Select Client</option>
{clients.map((client) => (
<option key={client.id} value={client.id}>
{client.name}
</option>
))}
</select>
</div>

{/* Project Description */}

<div className="md:col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">
Project Description
</label>

<textarea
name="projectDescription"
rows="4"
value={form.projectDescription || ""}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3"
/>
</div>

{/* Core Problem */}

<div className="md:col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">
Core Problem
</label>

<textarea
name="coreProblem"
rows="3"
value={form.coreProblem || ""}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3"
/>
</div>

{/* Target Audience */}

<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Target Audience
</label>

<textarea
name="targetAudience"
rows="3"
value={form.targetAudience || ""}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3"
/>
</div>

{/* Business Goal */}

<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Business Goal
</label>

<textarea
name="businessGoal"
rows="3"
value={form.businessGoal || ""}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3"
/>
</div>

{/* Key Features Summary */}

<div className="md:col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">
Key Features Summary
</label>

<textarea
name="keyFeaturesSummary"
rows="3"
value={form.keyFeaturesSummary || ""}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3"
/>
</div>

{/* Industry */}

<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Industry
</label>

<select
name="industryId"
value={form.industryId || ""}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3"
>
<option value="">Select Industry</option>
{industries.map((industry) => (
<option key={industry.id} value={industry.id}>
{industry.name}
</option>
))}
</select>
</div>

{/* Budget */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Budget Range
  </label>
  <div className="grid grid-cols-3 gap-3">
    <div className="col-span-2">
      <select
        name="budgetCurrency"
        value={budgetCurrency}
        onChange={handleBudgetCurrencyChange}
        className="w-full border border-gray-300 rounded-lg px-4 py-3"
      >
        <option value="">Select Currency</option>
        {currencies.map((currency) => (
          <option key={currency.id} value={currency.symbol}>
            {currency.symbol} ({currency.currencyName})
          </option>
        ))}
      </select>
    </div>
    <div className="col-span-1">
      <input
        type="text"
        name="budgetAmount"
        value={budgetAmount}
        onChange={handleBudgetAmountChange}
        placeholder="e.g. 50000 - 100000"
        className="w-full border border-gray-300 rounded-lg px-4 py-3"
      />
    </div>
  </div>
</div>

{/* Timeline */}

<div className="md:col-span-2">
<label className="block text-sm font-medium text-gray-700 mb-2">
Timeline
</label>

<select
name="timeline"
value={form.timeline || ""}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3"
>
<option value="">Select Timeline</option>
<option value="mvp_2_4_weeks">MVP (2-4 Weeks)</option>
<option value="standard_1_2_months">Standard (1-2 Months)</option>
<option value="complex_3_6_months">Complex (3-6 Months)</option>
<option value="ongoing">Ongoing</option>
</select>
</div>

{/* Buttons */}

<div className="md:col-span-2 flex justify-end gap-3 mt-4">

<button
type="button"
onClick={() => setShowEditModal(false)}
className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-300"
>
Cancel
</button>

<button
type="button"
onClick={updateOverview}
disabled={saving}
className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
>
{saving ? 'Saving...' : 'Update Project'}
</button>

</div>

</form>

</div>

</div>
)}

<UpgradeLimitModal
  open={showUpgradeModal}
  onClose={() => setShowUpgradeModal(false)}
  usage={{
    planName: "Free",
    used: 3,
    limit: 3,
  }}
/>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
