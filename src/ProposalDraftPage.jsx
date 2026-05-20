import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar";

const Icon = {
  dashboard: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  proposals: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 12h6M9 16h4M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>,
  clients:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="7" r="3"/><path d="M17 20H7a4 4 0 01-4-4 6 6 0 016-6h6a6 6 0 016 6 4 4 0 01-4 4z"/></svg>,

  billing:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  settings:  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06-.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  bell:      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  search:    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  chevron:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
};

export default function ProposalListPage() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("Proposals");
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const mapFunnelToStatus = (stage) => {
    switch (stage) {
      case "DraftStarted":
      case "ProposalPreviewGenerated":
        return { label: "Draft", color: "bg-slate-100 text-slate-700" };

      case "EmailCaptured":
      case "EstimateViewed":
      case "ConsultationRequested":
        return { label: "Engaged", color: "bg-blue-100 text-blue-700" };

      case "ConvertedToProposal":
        return { label: "Ready", color: "bg-indigo-100 text-indigo-700" };

      case "ProposalSent":
        return { label: "Sent", color: "bg-amber-100 text-amber-700" };

      case "ProposalAccepted":
        return { label: "Won", color: "bg-emerald-100 text-emerald-700" };

      case "ProposalRejected":
      case "ClosedLost":
        return { label: "Lost", color: "bg-red-100 text-red-700" };

      case "InvoiceAccepted":
      case "PaymentInitiated":
        return { label: "Payment", color: "bg-purple-100 text-purple-700" };

      case "ProjectActive":
        return { label: "In Progress", color: "bg-cyan-100 text-cyan-700" };

      case "ProjectCompleted":
        return { label: "Completed", color: "bg-green-100 text-green-700" };

      default:
        return { label: "Draft", color: "bg-slate-100 text-slate-700" };
    }
  };

  // Filter and pagination
  const filteredDrafts = drafts.filter(draft => {
    const projectTitle = draft.projectOverview?.title || "";
    const clientName = draft.client?.name || "";

    const matchesSearch =
      projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase());

    const status = mapFunnelToStatus(draft.funnelStageDescription).label;

    const matchesTab =
      activeTab === "All" || status === activeTab;

    return matchesSearch && matchesTab;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDrafts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDrafts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchDrafts();
    fetchUserData();
  }, []);

  const fetchDrafts = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    try {
      const response = await axios.get(
        "http://localhost:5214/Proposal/api/ProposalDraft/user/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );
      console.log('API Response:', response.data);
      setDrafts(response.data || []);
    } catch (error) {
console.error("Failed to load proposal drafts", error);
      console.log('Response:', error.response?.data);
      console.log('Status:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

 const generateFinal = (draftId) => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

    return async () => {
      try {
        const response = await axios.post(
          `http://localhost:5214/Proposal/api/Proposal/generate-from-draft/${draftId}`,
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
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    if (!token) return;
    try {
      const response = await axios.get(
        "http://localhost:5214/api/Register",
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

 

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Never';
  };

  const getActions = (item) => {
    switch (item.funnelStage) {

      case 0:
      case 1:
        return (
          <>
            <button onClick={() => navigate(`/ProposalDraftEditorPage/${item.id}`)} className="text-blue-600 hover:underline text-sm cursor-pointer">
              Edit
            </button>
            <button className="text-indigo-600 hover:underline text-sm cursor-pointer" onClick={generateFinal(item.id)}>
              Generate
            
            </button>
          </>
        );


    case 7:
      return (
        <>
          <button onClick={() => navigate(`/ProposalDraftEditorPage/${item.id}`)} className="text-blue-600 hover:underline text-sm cursor-pointer">
              Edit
            </button>
          <button onClick={() => navigate(`/final-proposal/${item.proposalId}`)} className="text-blue-600 hover:underline text-sm cursor-pointer">
            View
          </button>
          <button className="text-emerald-600 hover:underline text-sm cursor-pointer">
            Send
          </button>
        </>
      );

    case 8:
      return (
        <>
          <button onClick={() => navigate(`/proposal/${item.proposalId}`)} className="text-blue-600 hover:underline text-sm cursor-pointer">
            View
          </button>
          <button className="text-slate-600 hover:underline text-sm cursor-pointer">
            Copy Link
          </button>
        </>
      );

    case 9:
      return (
        <>
          <button onClick={() => navigate(`/proposal/${item.proposalId}`)} className="text-blue-600 hover:underline text-sm cursor-pointer">
            View
          </button>
          <button className="text-emerald-600 hover:underline text-sm">
            Create Invoice
          </button>
        </>
      );

    case 10:
      return (
        <button className="text-cyan-600 hover:underline text-sm cursor-pointer">
          View Project
        </button>
      );

    default:
      return null;
  }
};




  if (loading) {
    return (
      <div className="flex h-screen bg-white overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} userData={userData} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-500">Loading drafts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} userData={userData} />

      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <header className="h-14 bg-white border-b border-slate-100 px-7 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Dashboard</span>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-slate-300"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            <span className="text-slate-700 font-medium">Proposal Drafts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 w-52 focus-within:border-slate-400 transition-colors">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">{Icon.search}</svg>
              <input 
                className="bg-transparent outline-none text-sm text-slate-700 flex-1 placeholder:text-slate-400" 
                placeholder="Search drafts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="relative w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              {Icon.bell}
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"/>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[19px] font-semibold text-slate-900 tracking-tight">Proposals </h1>
              <p className="text-sm text-slate-400 mt-0.5">Track your deals and conversions</p>
            </div>
            <button
              onClick={() => navigate('/ProjectOverviewPage')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm cursor-pointer transition-colors flex items-center gap-1"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Generate New
            </button>
          </div>
          <div className="flex gap-2 mt-4">
                  {["All", "Draft", "Sent", "Won", "Lost"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        activeTab === tab
                          ? "bg-slate-900 text-white"
                          : "bg-white border border-slate-200 text-slate-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>



          {currentItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{drafts.length === 0 ? 'No proposal drafts yet' : 'No matching drafts'}</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">Create AI-powered project overviews first, then generate proposal drafts from the previews.</p>
              <button
                onClick={() => navigate('/ProjectOverviewPage')}
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 text-sm font-medium transition-colors inline-flex items-center gap-2"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                Create AI Preview
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-slate-100">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="p-4 text-[14px] text-slate-400"></th>
                    <th className="p-4 text-[14px] text-slate-400">Project</th>
                    <th className="p-4 text-[14px] text-slate-400">Client</th>
                    <th className="p-4 text-[14px] text-slate-400">Status</th>
                    <th className="p-4 text-[14px] text-slate-400">Client Estimate</th>
                    <th className="p-4 text-[14px] text-slate-400">Last Activity</th>
                    <th className="p-4 text-[14px] text-slate-400">Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => {
  const stageDisplay = mapFunnelToStatus(item.funnelStageDescription);

  return (
    
    <tr key={item.id} className="border-b hover:bg-slate-50">
      <img src={`http://localhost:5078${item.client?.logo}`}
      className="w-12 h-12 object-contain"
      /> 
      <td className="p-4 text-sm font-medium text-slate-800">
        {item.title || "Untitled"}
      </td>

      <td className="p-4 text-sm text-slate-600">
        {item.client?.name || "No client"}
      </td>

      <td className="p-4">
        <span className={`px-3 py-1 rounded-full text-xs ${stageDisplay.color}`}>
          {stageDisplay.label}
        </span>
      </td>

      <td className="p-4 text-sm font-semibold text-slate-900">
        {item.costEstimatePreview|| "No client"}
      </td>

      <td className="p-4 text-sm text-slate-600">
        {formatDate(item.updatedAt)}
      </td>

      <td className="p-4">
        <div className="flex gap-3">
          {getActions(item)}
        </div>
      </td>
    </tr>
  );
})}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-gray-50 rounded-b-xl">
                  <p className="text-sm text-slate-500">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(indexOfLastItem, filteredDrafts.length)}</span> of{" "}
                    <span className="font-medium">{filteredDrafts.length}</span> results
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = currentPage > 2 ? currentPage - 2 + i : i + 1;
                      if (page <= totalPages) {
                        return (
                          <button
                            key={page}
                            onClick={() => paginate(page)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-slate-900 text-white shadow-sm"
                                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      return null;
                    })}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

