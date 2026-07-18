import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import ProposalEditor from "./components/ProposalEditor";
import ProposalCoverPage from "./components/CoverPage";
import { FunnelStageEnum,funnelStageConfig  } from "./components/funnelStageConfig";
import ProposalMetaSection from "./components/ProposalMetaSection";
import PricingTable from "./components/PricingTable";
import ExecutiveSummary from "./components/ExecutiveSummary";
import TermsAndConditions from "./components/TermsAndConditions";
import ProposalScopeSection from "./components/ProposalScopeSection";
import TimelineSection from "./components/TimelineSection";
import DeliverableSection from "./components/DeliverableSection";
import ProposalPreviewModal from "./components/ProposalPreviewModal";
import { API_BASE_Invoice,API_BASE_Proposal } from "./config/api";



// Icons (same as ProjectOverviewPreviewPage)

// Budget currency used by PricingTable


const Icon = {
  dashboard: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  proposals: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 12h6M9 16h4M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>,
  clients:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="7" r="3"/><path d="M17 20H7a4 4 0 01-4-4 6 6 0 016-6h6a6 6 0 016 6 4 4 0 01-4 4z"/></svg>,
  insights:  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  billing:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  settings:  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v-.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06-.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  bell:      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  search:    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  chevron:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
  arrowLeft: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
};

export default function ProposalEditorPage() {
  const { id } = useParams(); // 🔥 draftId from URL
  const navigate = useNavigate();

  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentHtml, setContentHtml] = useState("");
  const [userData, setUserData] = useState(null);
  const [activeNav, setActiveNav] = useState("Proposals");
  const [pricingItems, setPricingItems] = useState([]);
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [ScopePreview, setScopePreview] = useState("");
  const [terms, setTerms] = useState("");
  const [signature, setSignature] = useState("");
  const [timeline, setTimeline] = useState("");
  const [deliverables, setDeliverables] = useState("");
  
  const [showPreview, setShowPreview] = useState(false);
  
  

  useEffect(() => {
    fetchDraft();
    fetchUserData();
  }, [id]);

const draftId =id; // Get draftId from URL



const getStatusStyles = (color) => {
  switch (color) {
    case "green":
      return "bg-green-50 text-green-600 border-green-200";
    case "blue":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "red":
      return "bg-red-50 text-red-600 border-red-200";
    case "yellow":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "purple":
      return "bg-purple-50 text-purple-600 border-purple-200";
    default:
      return "bg-amber-50 text-amber-600 border-amber-200";
  }
};

  

  const fetchDraft = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

    try {
      const response = await axios.get(
        `${API_BASE_Proposal}/api/ProposalDraft/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );
      setExecutiveSummary(response.data.executiveSummary || "");
      setDraft(response.data);
      setContentHtml(response.data.contentHtml || "");
      setScopePreview(response.data.scopePreview || "");
      setTimeline(response.data.timelinePreview || "");
      setTerms(response.data.termsSectionHtml || "");
      setSignature(response.data.signnatureSectionHtml || "");
      setDeliverables(response.data.deliverablesPreview || "");
      
// budgetCurrency is passed directly to PricingTable via draft.budgetcurrency/budgetCurrency

    } catch (error) {
      console.error("Failed to fetch draft", error);
    } finally {
      setLoading(false);
    }
  };

  // When loading draft
useEffect(() => {
  if (draft?.pricingItems) {
    setPricingItems(draft.pricingItems);
  }
}, [draft]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

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
      console.error(error);
    }
  };

  // ✅ Save Draft After editing
  const saveDraft = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

    try {
      await axios.put(
        `${API_BASE_Proposal}/api/ProposalDraft/${id}`,
        {
          executiveSummary: executiveSummary,
          contentHtml: contentHtml,
          scopePreview: ScopePreview,
          deliverablesPreview: deliverables,
          timelinePreview: timeline,
          pricingTableJson: JSON.stringify(pricingItems),
          pricingItems: pricingItems,
          termsAndConditionsHtml: terms,
          signatureSectionHtml: signature,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );

      alert("Draft saved successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save draft");
    }
  };

const stageKey = FunnelStageEnum[draft?.stage] || "DraftStarted";
const config = funnelStageConfig[stageKey];

  

  // ✅ Generate Final Proposal
  const generateFinal = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

    try {
      const response = await axios.post(
        `${API_BASE_Proposal}/api/Proposal/generate-from-draft/${id}`,
        
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );

      navigate(`/final-proposal/${response.data.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate final proposal");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white overflow-hidden font-outfit">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-500">Loading draft...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden font-outfit">
      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} userData={userData} />

      {/* ── MAIN ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* TOPNAV */}
        <header className="h-14 bg-white border-b border-slate-100 px-7 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <button onClick={() => navigate(-1)} className="hover:text-slate-600 transition-colors flex items-center gap-1">
              <span>{Icon.arrowLeft}</span>
              <span>Proposals</span>
            </button>
            <span className="text-slate-300">{Icon.chevron}</span>
            <span className="text-slate-700 font-medium">{draft?.projectRequirement?.projectTitle || "Proposal Editor"}</span>
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

  <main className="flex-1 overflow-y-auto bg-slate-100 px-6 py-8">
  <div className="max-w-5xl mx-auto space-y-8">

    {/* COVER */}
    <ProposalCoverPage 
      userData={draft?.organization} 
      client={draft?.client} 
      
    />

    {/* META */}
    <ProposalMetaSection 
      userData={draft?.organization} 
      client={draft?.client} 
      overview={draft?.projectOverview}
    />

    <ProposalPreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)}
    executiveSummary={executiveSummary} 
    htmlContent={contentHtml} 
    pricingItems={pricingItems}
    ScopePreview={ScopePreview} 
    timelinePreview={timeline}
    terms={terms}
    signature={signature}
    draftId={draftId}
    userData={draft?.organization}
    client={draft?.client}
    currency={draft.budgetCurrency}
    />

    {/* DOCUMENT SHEET */}
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-slate-400">
            {config?.message || "Draft · editing in progress"}
          </p>

          {draft?.time && (
            <p className="text-xs text-slate-400">
              Last saved: {new Date(draft.time).toLocaleDateString()}{" "}
              {new Date(draft.updatetime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </div>

        <span className={`text-xs rounded-full px-3 py-1 border ${getStatusStyles(config?.color)}`}>
          {config?.label || "Draft"}
        </span>
      </div>

      {/* BODY (🔥 THIS WAS MISSING) */}
      <div className="px-8 py-10 space-y-10">

        {/* EXECUTIVE SUMMARY */}
        <section>
  <h2 className="text-xl font-semibold mb-3">Executive Summary</h2>

  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 max-h-60 overflow-y-auto">
    <ProposalEditor
      content={executiveSummary}
      onChange={setExecutiveSummary}
      placeholder="Write a compelling summary of the project, value, and expected outcome..."
      compact 
    />
  </div>
</section>

        {/* EDITOR */}
        <section>
          <ProposalEditor 
            content={contentHtml} 
            onChange={setContentHtml} 
          />
        </section>

        {/* SCOPE OF WORK */}
        <section>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 max-h-40 overflow-y-auto">
              <ProposalEditor 
                content={ScopePreview} 
                onChange={setScopePreview}
                placeholder="Define the project scope, deliverables, timeline, and success criteria..."
                compact
              />
            </div>
            {/* Preview */}
            <ProposalScopeSection scopeHtml={ScopePreview} />
          </div>
        </section>

          {/*DELIVERABLES*/}
          <section>
  <div className="space-y-4">
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 max-h-40 overflow-y-auto">
      <ProposalEditor
        content={deliverables}
        onChange={setDeliverables}
        placeholder="List key deliverables, milestones, and project phases..."
        compact
      />
    </div>
    {/* Preview */}
    <DeliverableSection deliverablesHtml={deliverables} />
  </div>
</section>


        {/* TIMELINE */}
        <section>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 max-h-40 overflow-y-auto">
              <ProposalEditor 
                content={timeline} 
                onChange={setTimeline}
                placeholder="Outline project phases, milestones, and estimated durations..."
                compact
              />
            </div>
            {/* Preview */}
            <TimelineSection timelineHtml={timeline} />
          </div>
        </section>


        {/* PRICING */}
        <section>
          {(() => {
            const draftBudgetCurrency = draft.budgetCurrency ;

            return (
              <PricingTable
                initialItems={pricingItems}
                onChange={setPricingItems}
                budgetCurrency={draftBudgetCurrency}
              />
            );
          })()}
        </section>



        {/* TERMS */}
        {terms && (
          <section>
  <h2 className="text-xl font-semibold mb-3">Terms & Conditions</h2>

  <ProposalEditor
    content={terms}
    onChange={setTerms}
    placeholder="Define payment terms, delivery expectations, and legal conditions..."
    compact
  />
</section>
        )}

        {/* SIGNATURE */}
        {signature && (
          <section>
                    
                    <ProposalEditor
                      content={signature}
                      onChange={setSignature}
                      placeholder="Add signature lines, dates, and acceptance text..."
                      compact
                    />
                  </section>
        )}

      </div>
    </div>

    {/* ACTION BAR */}
    <div className="flex justify-end gap-3">
      

      <button onClick={saveDraft} className="px-5 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition cursor-pointer flex items-center gap-2">Save draft</button>

      <button onClick={async () => { 
        console.log('Preview - ScopePreview length:', ScopePreview?.length || 0, ScopePreview?.substring(0, 100));
        
        setShowPreview(true); 
      }} className="bg-slate-800 text-white px-4 py-2 rounded-lg cursor-pointer">Preview</button>

      <button onClick={generateFinal} className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer flex items-center gap-2">
        Generate Final Proposal
      </button>
    </div>

  </div>
</main>
      </div>
    </div>
  );
}
