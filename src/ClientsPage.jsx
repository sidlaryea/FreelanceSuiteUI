import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import axios from "axios";
import { getCrmClients, getClientRecommendations,getDashboardSummary } from "./services/clientService";
import AddClientModal from "./components/AddClientModal";
import ImportClientsModal from "./components/ImportClientsModal";




import {

  Search,
  Plus,
  Filter,
  ChevronDown,
  Eye,
  Edit2,
  FilePlus2,
  Send,
  CreditCard,
  Upload,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  BellDot,
  Activity,
  CalendarClock,
  MoreHorizontal,
  MessageSquare,
} from "lucide-react";



function formatCurrency(n, invoiceCurrency) {
  try {
    return Number(n ?? 0).toLocaleString(undefined, {
      style: "currency",
      currency: invoiceCurrency || "USD",
      maximumFractionDigits: 0,
    });
  } catch {
    return `${Number(n ?? 0).toFixed(0)}`;
  }
}

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [showImportClients, setShowImportClients] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("All Clients");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clients,setClients] = useState([]);
  const [loading,setLoading] = useState(true);
  const [activities,setActivities] = useState([]);
  const [recommendation,setRecommendations] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [activeNav, setActiveNav] = useState("All Clients");
  


  useEffect(() => {
    fetchUserData();
    fetchClients();

  }, []);

  const loadRecommendations = useCallback(async () => {
  try {
    const data = await getClientRecommendations(selectedClientId);
    setRecommendations(data);
    {console.log("Loaded recommendations:", data);}
  } catch (error) {
    console.error(error);
  }
}, [selectedClientId]);



const loadDashboardSummary = async () => {
  try {
    const response = await getDashboardSummary(selectedClientId);

    setDashboardSummary(response);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  if (!selectedClientId) return;

  loadDashboardSummary();
  
}, [selectedClientId]);




const fetchUserData = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    if (!token) return;
    try {
      
         const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Register/profile`,
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

  const fetchClients = async () => {
    try {
      setLoading(true);

      const data = await getCrmClients();
      
      // Normalize API response to ensure all required properties exist
      const normalizedClients = data.map(client => ({
        ...client,
        name: client.name || client.clientName || "Unknown",
        email: client.email || "",
        phone: client.phone || "",
        companyName: client.companyName || "",
        logo: client.logo || "",
        logoText: client.logoText || client.name?.charAt(0) || client.clientName?.charAt(0) || "?",
        status: client.status || "Active",
        healthScore: client.healthScore || 0,
        riskScore: client.riskScore || 0,
        proposalCount: client.proposalCount || 0,
        acceptedProposalCount: client.acceptedProposalCount || 0,
        lifetimeValue: client.lifetimeValue || 0,
        outstandingAmount: client.outstandingAmount || 0,
        lastActivityAt: client.lastActivityAt || null,
        nextFollowUp: client.nextFollowUp || "No scheduled follow-up",
        assignedTo: client.assignedTo || "Unassigned",
        aiInsights: client.aiInsights || { tags: [] },
      }));
      
      setClients(normalizedClients);

    } catch (err) {
      console.error("Failed to load clients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!selectedClientId) return;

  loadRecommendations();
}, [selectedClientId, loadRecommendations]);




  

const token = localStorage.getItem("jwtToken");
const apiKey = localStorage.getItem("apiKey");

const getClientActivities = useCallback(async (clientId) => {
  const response = await fetch(
    `http://localhost:5214/Proposal/api/Client/api/internal/client-activities/${clientId}`,
  
  
  {
  headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      
      );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}, [token, apiKey]);




const loadActivities = useCallback(async () => {
  try {
    const data = await getClientActivities(selectedClientId);
    setActivities(data);
  } catch (err) {
    console.error(err);
  }
}, [selectedClientId, getClientActivities]);


useEffect(() => {
  if (!selectedClientId) return;

  loadActivities();
}, [selectedClientId, loadActivities]);

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const topRecommendation = Array.isArray(recommendation)
    ? recommendation[0]
    : null;


  if (loading) return <div>Loading clients...</div>; 

  const totalClients = clients.length;

const paidInvoices = dashboardSummary
    ? `${dashboardSummary.paidInvoices} `
    : "0 ";
       

const outstandingValue =
  dashboardSummary
    ? `${dashboardSummary.outstandingInvoiceCount} `
    : "0 ";

const totalProposals = clients.reduce(
  (sum, c) => sum + (c.proposalCount || 0),
  0
);

const totalAccepted = clients.reduce(
  (sum, c) => sum + (c.acceptedProposalCount || 0),
  0
);

const winRate =
  totalProposals > 0
    ? ((totalAccepted / totalProposals) * 100).toFixed(0)
    : 0;


    const filteredClients = clients.filter((client) =>
  (
    client.name +
    " " +
    client.companyName +
    " " +
    client.email
  )
    .toLowerCase()
    .includes(query.toLowerCase())
);






  return (
    <div className="flex h-screen bg-[#f6f8fc] overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* KEEPING YOUR SIDEBAR UNTOUCHED */}
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} userData={userData} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* PREMIUM HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Clients</h1>

              <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                AI Relationship CRM
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-1">
              Manage customer relationships, proposals, invoices and engagement.
            </p>
          </div>

          

          <div className="flex items-center gap-3">
            <button
              className="cursor-pointer h-11 px-4 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
              onClick={() => setShowImportClients(true)}
            >
              <Upload size={16} />
              Import
            </button>

            <button
              onClick={() => setShowAddClient(true)}
              className="cursor-pointer h-11 px-4 rounded-2xl bg-slate-900 text-white hover:bg-black transition flex items-center gap-2 shadow-lg shadow-slate-200"
            >
              <Plus size={16} />
              Add Client
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <AddClientModal
            isOpen={showAddClient}
            onClose={() => setShowAddClient(false)}
            onClientAdded={() => fetchClients()}
          />
          <ImportClientsModal
            isOpen={showImportClients}
            onClose={() => setShowImportClients(false)}
            onImport={() => fetchClients()}
          />
          <div className="p-8">
            {/* KPI SECTION */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              {[
                {
                  label: "Total Clients",
                  value: totalClients,
                  
                },
                {
                  label: "Proposal Win Rate",
                  value: `${winRate}%`
                  
                },
                {
                  label: "Paid Invoices",
                  value: paidInvoices,
                  
                  
                },
                {
                  label: "Outstanding Invoices",
                  value: (outstandingValue),
                  
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{card.label}</p>

                      <h2 className="text-3xl font-bold text-slate-900 mt-3">
                        {card.value}
                      </h2>
                      {card.subtitle && (
                        <p className="mt-2 text-sm text-slate-500">
                          {card.subtitle}
                        </p>)}
                    </div>

                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <TrendingUp
                        size={18}
                        className="text-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm">
                    <span className="text-emerald-600 font-semibold">
                      {card.growth}
                    </span>
                    <span className="text-slate-500">vs last month</span>
                  </div>
                </div>
              ))}
            </section>

            {/* CONTROLS */}
            <section className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-xl">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />

                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search clients, companies, emails..."
                    className="w-full h-12 rounded-2xl bg-white border border-slate-200 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button className="h-12 px-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-2 hover:bg-slate-50">
                  <Filter size={16} />
                  Filter
                </button>

                <button className="h-12 px-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-2 hover:bg-slate-50">
                  Sort
                  <ChevronDown size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {[
                  "All Clients",
                  "High Value",
                  "Leads",
                  "VIP",
                  "At Risk",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 h-11 rounded-2xl text-sm transition ${
                      activeTab === tab
                        ? "bg-slate-900 text-white shadow-lg"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </section>

            {/* AI RECOMMENDATION BANNER */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 flex items-start justify-between flex-wrap gap-5">
                  <div>
                    <div className="flex items-center gap-2 text-blue-200 mb-3">
                      <Sparkles size={18} />
                      AI Recommendation
                    </div>

                   <h2 className="text-2xl font-bold max-w-2xl">
                          {topRecommendation
                            ? topRecommendation.title
                            : "No AI recommendations available"}
                        </h2>

                        <p className="text-slate-300 mt-3 max-w-2xl">
                          {topRecommendation?.message}
                        </p>
                                          </div>
                                          {topRecommendation && (
                                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10">
                                    <Sparkles size={16} />

                                    <span>
                                      Confidence:
                                      {" "}
                                      {topRecommendation.confidenceScore}%
                                    </span>
                                  </div>
                                )}

                  {/* <button className="h-12 px-5 rounded-2xl bg-white text-slate-900 font-medium hover:bg-slate-100">
                    Generate Proposal
                  </button> */}
                </div>
              </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-7">
              {/* CLIENT LIST */}
              <div className="xl:col-span-2 space-y-5">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`group bg-white rounded-3xl border p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      selectedClientId === client.id
                        ? "border-blue-500 shadow-lg"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100">
                              {client.logo ? (
                                <img
                                  src={`http://localhost:5078/${client.logo}`}
                                  alt={client.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold">
                                  {client.name?.charAt(0)}
                                </div>
                              )}
                            </div>

                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {client.name}
                            </h3>

                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                              {client.status}
                            </span>

                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                              {client.healthScore}% Health
                            </span>
                          </div>

                          <p className="text-slate-500 mt-1">
                            {client.companyName}
                          </p>

                          <p className="text-sm text-slate-400 mt-1">
                            {client.email} • {client.phone}
                          </p>
                        </div>
                      </div>

                      <button className="opacity-0 group-hover:opacity-100 transition w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    {/* METRICS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs text-slate-500 uppercase">
                          Proposals
                        </p>
                        <h4 className="text-xl font-bold mt-2">
                          {client.proposalCount}
                        </h4>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs text-slate-500 uppercase">
                          Accepted
                        </p>
                        <h4 className="text-xl font-bold mt-2">
                          {client.acceptedProposalCount}
                        </h4>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs text-slate-500 uppercase">
                          Revenue
                        </p>
                        <h4 className="text-xl font-bold mt-2">
{formatCurrency(client.paidAmount, client.invoiceCurrency)}
                        </h4>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs text-slate-500 uppercase">
                          Outstanding
                        </p>
                        <h4 className="text-xl font-bold mt-2">
                          {formatCurrency(
                            client.outstandingAmount,client.invoiceCurrency
                          )}
                        </h4>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <p className="text-sm text-slate-500">
                          Last Activity
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <Activity
                            size={16}
                            className="text-emerald-500"
                          />
                          <span className="font-medium text-slate-800">
                            {client.lastActivityAt? new Date(client.lastActivityAt).toLocaleString(): "No activity"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          { icon: Eye },
                          { icon: Edit2 },
                          { icon: FilePlus2 },
                          { icon: Send },
                          { icon: CreditCard },
                        ].map((action, idx) => {
                          const Icon = action.icon;

                          return (
                            <button
                              key={idx}
                              className="w-11 h-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 transition flex items-center justify-center"
                            >
                              <Icon size={17} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT SIDEBAR */}
              <aside>
                {selectedClient && (
                  <div className="sticky top-6 space-y-5">
                    {/* CLIENT PROFILE */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold">
                          {selectedClient.logoText || selectedClient.name?.charAt(0) || "?"}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {selectedClient.name || selectedClient.clientName}
                          </h3>

                          <p className="text-slate-500">
                            {selectedClient.companyName}
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                              Active
                            </span>

                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                              AI Healthy
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AI HEALTH */}
                      <div className="mt-6 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-900 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-200 text-sm">
                              AI Client Health
                            </p>

                            <h2 className="text-4xl font-bold mt-2">
                              {selectedClient.healthScore}%
                            </h2>
                          </div>

                          <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                            <ArrowUpRight size={24} />
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm mt-5 leading-relaxed">
                          Health Score: {selectedClient.healthScore}% • Risk Score: {selectedClient.riskScore}%
                        </p>
                      </div>

                      {/* AI TAGS */}
                      <div className="mt-5 flex gap-2 flex-wrap">
                        {selectedClient.aiInsights.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-2 rounded-2xl bg-slate-100 text-slate-700 text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                   {/* TIMELINE */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900">
                            Relationship Timeline
                          </h3>

                          <BellDot size={18} className="text-slate-400" />
                        </div>

                        <div className="mt-6 space-y-5">
                          {activities.length > 0 ? (
                            activities.map((activity) => (
                              <div key={activity.id} className="flex gap-4">
                                <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>

                                <div>
                                  <p className="font-medium text-slate-900">
                                    {activity.title}
                                  </p>

                                  <p className="text-sm text-slate-500">
                                    {activity.description}
                                  </p>

                                  <p className="text-xs text-slate-400 mt-1">
                                    {new Date(activity.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">
                              No activities found.
                            </p>
                          )}
                        </div>
                      </div>
{/*STATISTICS CARD*/}
<div className="bg-white rounded-3xl border border-slate-200 p-6">
  <h3 className="font-semibold text-slate-900 mb-5">
    Client Statistics
  </h3>

  <div className="space-y-4">
    <div>
      <p className="text-sm text-slate-500">
        Last Activity
      </p>

      <p className="font-medium text-slate-900">
        {selectedClient.lastActivityAt
          ? new Date(
              selectedClient.lastActivityAt
            ).toLocaleString()
          : "No activity"}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Proposals
      </p>

      <p className="font-medium text-slate-900">
        {selectedClient.proposalCount}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Accepted Proposals
      </p>

      <p className="font-medium text-slate-900">
        {selectedClient.acceptedProposalCount}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Lifetime Value
      </p>

      <p className="font-medium text-slate-900">
        {formatCurrency(selectedClient.paidAmount,selectedClient.invoiceCurrency)}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Outstanding Revenue
      </p>

      <p className="font-medium text-slate-900">
        {formatCurrency(selectedClient.outstandingAmount,selectedClient.invoiceCurrency)}
      </p>
    </div>
  </div>
</div>

                    {/* FOLLOW UP */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6">
                      <h3 className="font-semibold text-slate-900">
                        Communication
                      </h3>

                      <div className="space-y-4 mt-5">
                        <div className="flex items-start gap-3">
                          <CalendarClock
                            size={18}
                            className="text-slate-400 mt-1"
                          />

                          <div>
                            <p className="text-sm text-slate-500">
                              Next Follow-up
                            </p>

                            <p className="font-semibold text-slate-900">
                              {selectedClient.nextFollowUp}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MessageSquare
                            size={18}
                            className="text-slate-400 mt-1"
                          />

                          <div>
                            <p className="text-sm text-slate-500">
                              Assigned To
                            </p>

                            <p className="font-semibold text-slate-900">
                              {selectedClient.assignedTo}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full h-12 rounded-2xl bg-slate-900 text-white mt-6 hover:bg-black transition">
                        Schedule Follow-Up
                      </button>
                    </div>
                  </div>
                )}
              </aside>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}