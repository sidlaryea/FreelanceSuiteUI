import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Brain } from "lucide-react";

import NextBestAction from "./components/Dashboard/NextBestAction";
import KpiCard from "./components/Dashboard/KpiCard";
import InsightCard from "./components/Dashboard/InsightCard";
import LiklihoodColor from "./components/Dashboard/Table";
import ScoreFactor from "./components/Dashboard/ScoreFactor";

import Sidebar from "./components/Sidebar";





// ─── ICONS (inline SVG — no emoji) ──────────────────────────────────────────

const Icon = {
  dashboard: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  proposals: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 12h6M9 16h4M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>,
  clients:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="7" r="3"/><path d="M17 20H7a4 4 0 01-4-4 6 6 0 016-6h6a6 6 0 016 6 4 4 0 01-4 4z"/></svg>,
  insights:  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  billing:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  settings:  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  bell:      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  search:    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  chevron:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>,
  arrowUp:   <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg>,
  sparkle:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v3M12 18v3M3 12h3M18 12h3m-3.29-5.71l-2.12 2.12M8.41 15.59l-2.12 2.12M5.29 8.29l2.12 2.12M15.59 15.59l2.12 2.12"/></svg>,
  close:     <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const trendData = [
  { week: "W1", score: 52 }, { week: "W2", score: 58 },
  { week: "W3", score: 61 }, { week: "W4", score: 67 },
  { week: "W5", score: 70 }, { week: "W6", score: 74 },
  { week: "W7", score: 78 }, { week: "W8", score: 81 },
];




// ─── HELPERS ─────────────────────────────────────────────────────────────────

const scoreBadge = (s) =>
  s >= 75 ? "text-emerald-700 bg-emerald-50 ring-emerald-200"
  : s >= 50 ? "text-amber-700 bg-amber-50 ring-amber-200"
  : "text-red-600 bg-red-50 ring-red-200";

const likelihoodColor = (l) =>
  ({ "Very High": "text-emerald-600", High: "text-emerald-600", Medium: "text-amber-600", Low: "text-red-500" }[l] ?? "text-slate-500");

const statusCfg = {
  sent:     { label: "Sent",      cls: "text-sky-700 bg-sky-50 ring-sky-200" },
  draft:    { label: "Draft",     cls: "text-slate-500 bg-slate-100 ring-slate-200" },
  accepted: { label: "Accepted",  cls: "text-emerald-700 bg-emerald-50 ring-emerald-200" },
  review:   { label: "In Review", cls: "text-violet-700 bg-violet-50 ring-violet-200" },
};

const barColor = (v) => v >= 75 ? "#10B981" : v >= 50 ? "#F59E0B" : "#EF4444";

// ─── SCORE RING ───────────────────────────────────────────────────────────────

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

// ─── CHART TOOLTIP ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className="font-semibold">{payload[0].value}% avg score</p>
    </div>
  );
}

// ─── DRAWER ───────────────────────────────────────────────────────────────────

function Drawer({ proposal, onClose }) {
  const open = !!proposal;
  
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
                <ScoreRing score={proposal.score} />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2">Overall Score</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ring-1 ${scoreBadge(proposal.score)}`}>
                      {proposal.score >= 75 ? "Strong" : proposal.score >= 50 ? "Needs Work" : "Weak"}
                    </span>
                    <span className={`text-sm font-medium ${likelihoodColor(proposal.likelihood)}`}>
                      {proposal.likelihood} likelihood
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Scored across 4 AI factors</p>
                </div>
              </div>

              <div className="border-t border-slate-100"/>
              <ScoreFactor label="Personalization" value={65} />
              <ScoreFactor label="Clarity" value={80} />
              <ScoreFactor label="Pricing Structure" value={70} />
              <ScoreFactor label="Executive Summary Strength" value={60} />
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-slate-400">{Icon.sparkle}</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">AI Suggestions</p>
                </div>
                <ul className="space-y-3.5">
                  {proposal.suggestions?.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                      <span className="text-slate-300 font-medium tabular-nums flex-shrink-0 pt-px">0{i + 1}</span>
                      {s}
                    </li>
                  )) || <li className="text-sm text-slate-500">No suggestions available</li>}
                </ul>
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

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav]       = useState("Dashboard");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected]         = useState(null);
  
  // State for API data
  const [proposalsData, setProposalsData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  /////////////////////////// Fetch proposals from API//////////////////////////////////////////
  useEffect(() => {
    const fetchProposals = async () => {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("apiKey");
      
      if (!token) return;
      
      try {
        const response = await axios.get(
          "http://localhost:5214/proposal/api/Proposal",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-API-KEY": apiKey
            }
          }
        );
        setProposalsData(response.data || []);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        // Use mock data if API fails
        setProposalsData([
          { id: 1, projectTitle: "Website Revamp", clientName: "Acme Ltd", aiScore: 84, status: "sent", createdAt: "2025-03-28" },
          { id: 2, projectTitle: "ERP Upgrade", clientName: "Nova Bank", aiScore: 62, status: "draft", createdAt: "2025-03-25" },
          { id: 3, projectTitle: "Marketing Plan", clientName: "Bloom Co", aiScore: 91, status: "accepted", createdAt: "2025-03-20" },
        ]);
      }
    };
      
    /////////////////////// Fetch Analytics data from API //////////////////////////////////////////
    const fetchAnalytics = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  try {
    const response = await axios.get(
      "http://localhost:5214/api/analytics/proposals",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      }
    );

    setAnalytics(response.data);
  } catch (error) {
    console.error("Error fetching analytics:", error);
  }
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
    fetchAnalytics();
    fetchProposals();
    fetchUserData();
    setLoading(false);
  }, []);




  // Calculate KPIs from proposals
  const totalProposals = proposalsData.length;
  //const acceptedProposals = proposalsData.filter(p => p.status === 'accepted' || p.status === 'Accepted').length;
  //const acceptanceRate = totalProposals > 0 ? Math.round((acceptedProposals / totalProposals) * 100) : 0;
  const avgScore = totalProposals > 0 ? Math.round(proposalsData.reduce((acc, p) => acc + (p.aiScore || 0), 0) / totalProposals) : 0;

  // Map API data to display format
  const displayProposals = proposalsData.map(p => ({
    id: p.id || p.Id,
    name: p.projectTitle || p.name || "Untitled Proposal",
    client: p.clientName || p.client?.name || "Unknown Client",
    score: p.aiScore || p.score || 0,
    likelihood: (p.aiScore || 0) >= 75 ? "High" : (p.aiScore || 0) >= 50 ? "Medium" : "Low",
    status: p.status?.toLowerCase() || "draft",
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    factors: { Personalization: p.aiScore || 0, Clarity: p.aiScore || 0, "Value Prop": p.aiScore || 0, "Call to Action": p.aiScore || 0 },
    suggestions: p.aiSuggestions || ["Improve your proposal score by adding more details"],
  }));

  const filtered = activeFilter === "All"
    ? displayProposals
    : displayProposals.filter((p) => statusCfg[p.status]?.label === activeFilter);

  // Default insights when API data not available
  

  const recommendations = displayProposals.slice(0, 3).map(p => ({
    proposal: p.name,
    action: p.aiScore >= 75 ? "Ready to send" : "Add more details to improve score",
    impact: p.aiScore >= 75 ? "High" : "+10 pts"
  })) || [
    { proposal: "No proposals", action: "Create your first proposal", impact: "New" },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>


      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} userData={userData} />


      {/* ── MAIN ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">

        {/* TOPNAV */}
        <header className="h-14 bg-white border-b border-slate-100 px-7 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Dashboard</span>
            <span className="text-slate-300">{Icon.chevron}</span>
            <span className="text-slate-700 font-medium">Overview</span>
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
        <main className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* Page header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[19px] font-semibold text-slate-900 tracking-tight">Overview</h1>
              <p className="text-sm text-slate-400 mt-0.5">Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <button className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              + New Proposal
            </button>
          </div>

           <NextBestAction
              message="1 proposal needs improvement before sending."
    impact="+12% acceptance probability"
    onAction={() => navigate("/proposals/123/edit")}
            />

          {/* KPI CARDS */}
          

         <div className="grid grid-cols-4 gap-4">

<KpiCard
  title="Proposal Views"
  value={analytics?.totalViews || 0}
  icon={<Brain size={20} className="text-indigo-600" />}
/>

<KpiCard
  title="Acceptance Rate"
  value={`${analytics?.acceptanceRate || 0}%`}
  icon={<Brain size={20} className="text-emerald-600" />}
/>

<KpiCard
  title="Accepted Deals"
  value={analytics?.acceptedProposals || 0}
  icon={<Brain size={20} className="text-blue-600" />}
/>

<KpiCard
  title="Avg Time To Accept"
  value={`${analytics?.averageTimeToAcceptHours || 0} hrs`}
  icon={<Brain size={20} className="text-purple-600" />}
/>

</div>
          

          {/* CHART + AI INSIGHTS */}
          <div className="grid grid-cols-[1fr_310px] gap-4">

            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Personalisation Score Trend</p>
                  <p className="text-xs text-slate-400 mt-0.5">8-week rolling average</p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200 px-2 py-0.5 rounded-full">
                  +{avgScore > 0 ? avgScore - 50 : 0} pts
                </span>
              </div>
              <ResponsiveContainer width="100%" height={148}>
                <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F172A" stopOpacity={0.08}/>
                      <stop offset="100%" stopColor="#0F172A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false}/>
                  <YAxis domain={[45, 90]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTooltip/>}/>
                  <Area type="monotone" dataKey="score" stroke="#0F172A" strokeWidth={2}
                    fill="url(#scoreGrad)" dot={false} activeDot={{ r: 4, fill: "#0F172A", strokeWidth: 0 }}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col">
              
              <InsightCard
                title="Increase Personalization"
                description="Add client-specific pain points in executive summary."
                impact="+9% acceptance probability"
                onClick={() => setSelected(displayProposals[0])}
              />             
            </div>
          </div>

          {/* DEVICE ANALYTICS */}
          {analytics && (
            <div className="bg-white rounded-xl border border-slate-100 p-5">

              <p className="text-sm font-semibold text-slate-800 mb-4">
                Device Analytics
              </p>

              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={[
                    { device: "Desktop", views: analytics.desktopViews },
                    { device: "Mobile", views: analytics.mobileViews },
                    { device: "Tablet", views: analytics.tabletViews }
                  ]}
                >
                  <XAxis dataKey="device" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#0F172A" fill="#0F172A" />
                </AreaChart>
              </ResponsiveContainer>

            </div>
          )}        

          {/* PROPOSALS TABLE */}
          <div className="bg-white rounded-xl border border-slate-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800">Proposals</p>
              <div className="flex items-center gap-1">
                {["All", "Sent", "Draft", "In Review"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors
                      ${activeFilter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50">
                  {["Proposal", "Score", "Likelihood", "Status", "Date", ""].map((h, i) => (
                    <th key={i} className="text-left text-[11px] font-medium text-slate-400 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="border-b border-slate-50 last:border-none hover:bg-slate-50/60 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{p.client}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ring-1 ${scoreBadge(p.score)}`}>
                        {p.score}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${likelihoodColor(
                        p.likelihood
                      )}`}
                    />
                    <span className={`text-xs font-medium ${likelihoodColor(p.likelihood)}`}>{p.likelihood}</span>
                  </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ring-1 ${statusCfg[p.status]?.cls || statusCfg.draft.cls}`}>
                        {statusCfg[p.status]?.label || "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-400">{p.date}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-xs text-slate-300 group-hover:text-slate-600 transition-colors flex items-center justify-end gap-0.5">
                        View {Icon.chevron}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                      No proposals found. Create your first proposal!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* RECOMMENDATIONS */}
          <div className="bg-white rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 px-5 py-4 border-b border-slate-100">
              <span className="text-slate-400">{Icon.sparkle}</span>
              <p className="text-sm font-semibold text-slate-800">Recommendations</p>
              <span className="ml-auto text-xs text-slate-400">{recommendations.length} actions</span>
            </div>
            <div>
              {recommendations.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 last:border-none hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-slate-300 font-medium text-xs tabular-nums mt-0.5">0{i + 1}</span>
                    <div>
                      <p className="text-sm text-slate-700">{r.action}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{r.proposal}</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold flex-shrink-0 ml-6">{r.impact}</span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* DRAWER */}
      <Drawer proposal={selected} onClose={() => setSelected(null)}/>
    </div>
  );
}
