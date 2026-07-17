import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/Layout/TopNav";
import { Brain } from "lucide-react";
import KpiCard from "./components/Dashboard/KpiCard";
import { getDashboardHome } from "./api/dashboardApi";
import NextActionCard from "./components/Dashboard/NextActionCard"
import AiInsightsCard from "./components/Dashboard/AiInsightsCard"; 
import AiRecommendations from "./components/Dashboard/AiRecommendations"
import ScoreFactor from "./components/Dashboard/ScoreFactor";
import { API_BASE_Invoice,API_BASE_Proposal } from "./config/api";

 

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]= useState("Dashboard");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  /////////////////////////// Fetch proposals from API//////////////////////////////////////////
  useEffect(() => {
    /////////////////////// Fetch Analytics data from API //////////////////////////////////////////
  const fetchDashboard = async () => {
  try {
    const data = await getDashboardHome();
    setDashboardData(data);
  } catch (error) {
    console.error("Error loading dashboard", error);
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
    fetchDashboard();
    
    fetchUserData();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }
  const summary = dashboardData?.summary;
  const aiInsights =dashboardData?.aiInsights;
  const getProposalStatus = (status) => {
  switch (status) {
    case 0:
      return {
        label: "Draft",
        cls: "bg-slate-100 text-slate-700",
      };

    case 1:
      return {
        label: "Submitted",
        cls: "bg-sky-100 text-sky-700",
      };

    case 2:
      return {
        label: "Accepted",
        cls: "bg-emerald-100 text-emerald-700",
      };

    case 3:
      return {
        label: "Rejected",
        cls: "bg-red-100 text-red-700",
      };

    default:
      return {
        label: "Unknown",
        cls: "bg-slate-100 text-slate-700",
      };
  }
};

const getScoreBadge = (score) => {
  if (score >= 85)
    return "bg-emerald-100 text-emerald-700";

  if (score >= 70)
    return "bg-amber-100 text-amber-700";

  return "bg-red-100 text-red-700";
};


  const handleViewProposal = async (proposal) => {
  try {
    setAnalysisLoading(true);

    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

    const response = await axios.post(
      `${API_BASE_Invoice}Proposal/api/Proposal/${proposal.proposalId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey,
        },
      }
    );

    setSelectedProposal({
      ...proposal,
      analysis: response.data,
    });
  } catch (error) {
    console.error("Failed to load AI analysis", error);
  } finally {
    setAnalysisLoading(false);
  }
};


const scoreBadge = (s) =>
  s >= 75 ? "text-emerald-700 bg-emerald-50 ring-emerald-200"
  : s >= 50 ? "text-amber-700 bg-amber-50 ring-amber-200"
  : "text-red-600 bg-red-50 ring-red-200";

  
const Icon ={close:<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>};
function Drawer({ proposal, onClose }) {
  const open = !!proposal;

  const barColor = (v) => v >= 75 ? "#10B981" : v >= 50 ? "#F59E0B" : "#EF4444";

  function ScoreRing({ score, size = 86 }) {
  const r = size / 2 - 7;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const stroke = barColor(score);
  return (
    <div style={{ width: size, height: size }} className="relative flex-shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth="7"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={stroke} strokeWidth="7"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-semibold text-slate-800 text-[15px] tracking-tight">{score}%</span>
      </div>
    </div>
  );
}


  
  return (
    <>
    
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/25 z-40 transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      <aside className={`fixed top-0 right-0 bottom-0 w-[430px] bg-white z-50 flex flex-col border-l border-slate-200 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? "translate-x-0" : "translate-x-full"}`}>
        {proposal && (
          <>
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-900 text-[15px]">{proposal.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{proposal.client} · {proposal.date}</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                {Icon.close}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <div className="flex items-center gap-5">
                <ScoreRing score={proposal.analysis?.finalScore || 0} />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2">Overall Score</p>
                  <div className="flex items-center gap-2">
  <span
    className={`text-xs font-medium px-2 py-0.5 rounded ring-1 ${
      scoreBadge(proposal.analysis?.finalScore || 0)
    }`}
  >
    Grade {proposal.analysis?.grade}
  </span>
</div>
                  <p className="text-xs text-slate-400 mt-2">
  Strongest: {proposal.analysis?.strongestFactor}
</p>
<p className="text-xs text-slate-400">
  Weakest: {proposal.analysis?.weakestFactor}
</p>
                </div>
              </div>

              <div className="border-t border-slate-100"/>
              {proposal.analysis?.scores && (
  <>
    <ScoreFactor
      label="Executive Summary"
      value={proposal.analysis.scores.executiveSummary}
    />

    <ScoreFactor
      label="Problem Understanding"
      value={proposal.analysis.scores.problemUnderstanding}
    />

    <ScoreFactor
      label="Solution Clarity"
      value={proposal.analysis.scores.solutionClarity}
    />

    <ScoreFactor
      label="Deliverables"
      value={proposal.analysis.scores.deliverables}
    />

    <ScoreFactor
      label="Timeline"
      value={proposal.analysis.scores.timeline}
    />

    <ScoreFactor
      label="Pricing Clarity"
      value={proposal.analysis.scores.pricingClarity}
    />

    <ScoreFactor
      label="Client Personalization"
      value={proposal.analysis.scores.clientPersonalization}
    />

    <ScoreFactor
      label="Professionalism"
      value={proposal.analysis.scores.professionalism}
    />
  </>
)}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-slate-400">{Icon.sparkle}</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">AI Suggestions</p>
                </div>
                <ul className="space-y-3.5">
  {proposal.analysis?.recommendations?.map((s, i) => (
    <li
      key={i}
      className="flex gap-3 text-sm text-slate-700 leading-relaxed"
    >
      <span className="text-slate-300 font-medium tabular-nums flex-shrink-0">
        0{i + 1}
      </span>
      {s}
    </li>
  ))}
</ul>
<div>
  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-3">
    Strengths
  </p>

  <ul className="space-y-2">
    {proposal.analysis?.strengths?.map((item, index) => (
      <li
        key={index}
        className="text-sm text-emerald-700"
      >
        • {item}
      </li>
    ))}
  </ul>
</div>
<div>
  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-3">
    Weaknesses
  </p>

  <ul className="space-y-2">
    {proposal.analysis?.weaknesses?.map((item, index) => (
      <li
        key={index}
        className="text-sm text-amber-700"
      >
        • {item}
      </li>
    ))}
  </ul>
</div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex gap-2.5">
              <button className="flex-1 bg-slate-900 text-white text-sm font-medium rounded-lg py-2 hover:bg-slate-700 transition-colors">
                Edit Proposal
              </button>
              <button className="flex-1 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg py-2 hover:bg-slate-50 transition-colors">
                Send to Client
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}





  return (
    <div className="flex h-screen bg-white " style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} userData={userData} />
      {/* ── MAIN ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* TOPNAV */}
        <header className="relative h-14 bg-white border-b border-slate-100 px-7 flex items-center justify-between overflow-visible">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Dashboard</span>
            <span className="text-slate-300"></span>
            <span className="text-slate-700 font-medium">Overview</span>
          </div>
         <TopNav />
        </header>
        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          {/* Page header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[19px] font-semibold text-slate-900 tracking-tight">Overview</h1>
            </div>
          </div>
           {/* KPI CARDS */}
          <div className="grid grid-cols-5 gap-4">
            <KpiCard title="Proposal Views" value={summary?.proposalViewsCount ?? 0} icon={<Brain size={20} className="text-indigo-600" />}/>
            <KpiCard title="Acceptance Rate"value={`${summary?.acceptanceRate ?? 0}%`} icon={<Brain size={20} className="text-emerald-600" />}/>
            <KpiCard title="Accepted Deals" value={summary?.acceptedDeals ?? 0} icon={<Brain size={20} className="text-blue-600" />}/>
            <KpiCard title="Avg Time To Accept" value={`${summary?.averageTimeToAcceptHours ?? 0} hrs`} icon={<Brain size={20} className="text-purple-600" />}/>
            <KpiCard title="Avg AI Proposal Rating" value={`${aiInsights?.averageScore ?? 0}%`} icon={<Brain size={20} className="text-orange-600" />}/>

          </div>

          {/* NEXT ACTIONS */}
            <div className="bg-white border border-slate-100 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-800">
                  Next Actions
                </h2>

                <span className="text-xs text-slate-400">
                  {dashboardData?.nextActions?.length || 0} actions
                </span>
              </div>

              <div className="space-y-3">
                {dashboardData?.nextActions?.length > 0 ? (
                  dashboardData.nextActions.map((action, index) => (
                    <NextActionCard
                      key={index}
                      action={action}
                    />
                  ))
                ) : (
                  <div className="text-sm text-slate-400">
                    No pending actions.
                  </div>
                )}
              </div>
            </div>

               

                {/* Recent Proposals Table */}

                <div className="bg-white border border-slate-100 rounded-xl">
  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
    <h2 className="text-sm font-semibold text-slate-800">
      Recent Proposals
    </h2>

   
  </div>

  <table className="w-full">
    <thead>
      <tr className="border-b border-slate-50">
        <th className="text-left text-xs text-slate-400 px-5 py-3">
          Proposal
        </th>

        <th className="text-left text-xs text-slate-400 px-5 py-3">
          AI Rating %
        </th>

        <th className="text-left text-xs text-slate-400 px-5 py-3">
          Status
        </th>

         <th className="text-left text-xs text-slate-400 px-5 py-3">
          Views
        </th>

         <th className="text-left text-xs text-slate-400 px-5 py-3">
          Last Viewed
        </th>

        <th className="text-left text-xs text-slate-400 px-5 py-3">
          Created
        </th>

        <th />
      </tr>
    </thead>

    <tbody>
      {dashboardData?.recentProposals?.map((proposal) => {
        const status = getProposalStatus(
          proposal.status
        );

        return (
          <tr
            key={proposal.proposalId}
            className="border-b border-slate-50 hover:bg-slate-50 transition"
          >
            <td className="px-5 py-4">
              <p className="text-sm font-medium text-slate-800">
                {proposal.proposalTitle}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                {proposal.clientName}
              </p>
            </td>

            <td className="px-5 py-4">
              <span
                className={`text-xs px-2 py-1 rounded-md font-semibold ${getScoreBadge(
                  proposal.aiScore
                )}`}
              >
                {proposal.aiScore}
              </span>
            </td>

            <td className="px-5 py-4">
              <span
                className={`text-xs px-2 py-1 rounded-md font-medium ${status.cls}`}
              >
                {status.label}
              </span>
            </td>

            <td className="px-5 py-4">
              <span
                className={`text-xs px-2 py-1 rounded-md font-medium ${proposal.viewCount}`}
              >
                {proposal.viewCount}
              </span>
            </td>

            <td className="px-5 py-4">
              <span className="text-xs px-2 py-1 rounded-md font-medium bg-slate-100 text-slate-700">
                {(() => {
                  const value = proposal.lastViewedAt;
                  const date = value ? new Date(value) : null;
                  if (!date || Number.isNaN(date.getTime())) return "—";

                  const diffMs = Date.now() - date.getTime();
                  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                  if (diffHours >= 1) return `${diffHours} hrs ago`;

                  const diffMinutes = Math.floor(diffMs / (1000 * 60));
                  return diffMinutes <= 0 ? "Just now" : `${diffMinutes} mins ago`;
                })()}
              </span>
            </td>

            <td className="px-5 py-4 text-sm text-slate-500">
              {new Date(
                proposal.createdAt
              ).toLocaleDateString()}
            </td>

            <td className="px-5 py-4 text-right">
              <button onClick={() => handleViewProposal(proposal)} className="text-indigo-600 text-sm hover:text-indigo-700 cursor-pointer">
                      View
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>




        </main>
      </div>

      {/* DRAWER */}
      <Drawer proposal={selectedProposal} onClose={() => setSelectedProposal(null)}/>
    </div>
  );
}
