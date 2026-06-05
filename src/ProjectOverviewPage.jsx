import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "./components/Sidebar";
import CreateProjectModal from "./components/CreateProjectModal";


export default function ProjectOverviewsPage() {
  const [overviews, setOverviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("AI Previews");
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    projectTitle: "",
    projectType: "",
    clientId: "",
    coreProblem: "",
    targetAudience: "",
    businessGoal: "",
    keyFeaturesSummary: "",
    projectDescription: "",
    industryId: "",
    budgetRange: "",
    timeline: ""
  });
  const [industries, setIndustries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [budgetCurrency, setBudgetCurrency] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [error, setError] = useState("");
  const [clients, setClients] = useState([]);

  const getIndustryName = (industryId) => {
    if (!industryId) return "N/A";
    const industry = industries.find(ind => ind.id === parseInt(industryId));
    return industry ? industry.name : industryId;
  };

  const navigate = useNavigate();

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = overviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(overviews.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Icons (same as Dashboard2)



  useEffect(() => {
    fetchOverviews();
    fetchUserData();
    fetchIndustries();
    fetchCurrencies();
    fetchClients();
  }, []);

  const fetchOverviews = async () => {
      const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");
    try {
      const response = await axios.get(
        "http://localhost:5214/Proposal/api/ProjectOverview/byUser",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey
      }
    }  
    );
      
      setOverviews(response.data);
    } catch (error) {
      console.error("Failed to load project overviews", error);
    }
    setLoading(false);
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




  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
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
    const industry = industries.find(ind => ind.id === parseInt(industryId));
    return industry ? industry.name : "";
  };

  const fetchIndustries = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    try {
      const response = await axios.get("http://localhost:5214/api/Industries", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      });
      setIndustries(response.data);
    } catch (error) {
      console.error("Failed to load industries", error);
    }
  };

  const fetchCurrencies = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    try {
      const response = await axios.get("http://localhost:5214/api/Currency/GetAllCurrencies", {
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

  const fetchClients = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    try {
      const response = await axios.get("http://localhost:5214/proposal/api/Client/user/", {
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

const createProjectOverview = async (formData) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const apiKey = localStorage.getItem("apiKey");
      const payload = {
        clientId: formData.clientId,
        projectTitle: formData.projectTitle,
        projectDescription: formData.projectDescription,
        projectType: formData.projectType,
        industry: getIndustryNameById(formData.industryId),
        budgetRange: formData.budgetRange,
        timeline: formData.timeline,
        businessGoal: formData.businessGoal,
        targetAudience: formData.targetAudience,
        coreProblem: formData.coreProblem,
        keyFeaturesSummary: formData.keyFeaturesSummary
      };
      await axios.post(
        "http://localhost:5214/proposal/api/ProjectOverview",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );
      setShowCreateModal(false);
      setForm({
        projectTitle: "",
        projectType: "",
        clientId: "",
        coreProblem: "",
        targetAudience: "",
        businessGoal: "",
        keyFeaturesSummary: "",
        projectDescription: "",
        industryId: "",
        budgetRange: "",
        timeline: ""
      });
      fetchOverviews();
    } catch (error) {
      console.error("Project creation failed", error);
      setError("Failed to create project. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.projectTitle || !form.projectType || !form.clientId || !form.projectDescription || !form.industryId || !form.budgetRange || !form.timeline || !form.businessGoal || !form.coreProblem || !form.targetAudience || !form.keyFeaturesSummary) {
      setError("Please fill in all required fields");
      return;
    }
    createProjectOverview(form);
  };

  return (
    <div className="flex h-screen bg-[#f6f8fc] overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} userData={userData} />


      {/* ── MAIN ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f6f8fc]">
        {/* TOPNAV */}
        <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-7 flex items-center justify-between flex-shrink-0 shadow-sm">

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Dashboard</span>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-slate-300"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>

            <span className="text-slate-700 font-medium">AI Previews</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 w-52 focus-within:border-slate-400 transition-colors shadow-sm">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>

              <input className="bg-transparent outline-none text-sm text-slate-700 flex-1 placeholder:text-slate-400" placeholder="Search…"/>
            </div>
            <button className="relative w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>

              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"/>
            </button>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
          <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-8 text-white shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">AI Generated Project Overviews</h1>
                <p className="text-sm text-slate-200 mt-2">Manage your AI-generated project previews with intelligent summaries and easy actions.</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className=" cursor-pointer h-12 px-5 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition flex items-center gap-2"
              >
                + Create New Project
              </button>
            </div>
          </section>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-slate-100">
                <tr className="text-left text-sm text-gray-600">
                  <th className="p-4 text-[11px] font-medium text-slate-400">Project</th>
                  <th className="p-4 text-[11px] font-medium text-slate-400">Industry</th>
                  <th className="p-4 text-[11px] font-medium text-slate-400">Budget</th>
                  <th className="p-4 text-[11px] font-medium text-slate-400">Timeline</th>
                  <th className="p-4 text-[11px] font-medium text-slate-400">Status</th>
                  <th className="p-4 text-[11px] font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-400">Loading...</td>
                  </tr>
                )}
                {currentItems.map((overview) => (
                  <tr key={overview.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-800">{overview.projectTitle}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {getIndustryName(overview.industry)}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {overview.budgetCurrency} {overview.budgetRange}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {overview.timeline}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        {overview.status}
                      </span>
                    </td>
                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => navigate(`/ProjectOverviewPreviewPage/${overview.id}`)}
                        className="text-blue-600 hover:underline text-sm cursor-pointer transition-colors"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/generate-draft/${overview.id}`)}
                        className="text-green-600 hover:underline text-sm cursor-pointer transition-colors"
                      >
                        Generate Draft
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastItem, overviews.length)}</span> of{" "}
                  <span className="font-medium">{overviews.length}</span> results
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-3 py-1.5 text-sm rounded-lg ${
                        currentPage === page
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

<CreateProjectModal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  onSubmit={handleSubmit}
  form={form}
  onChange={handleChange}
  clients={clients}
  industries={industries}
  currencies={currencies}
  budgetCurrency={budgetCurrency}
  budgetAmount={budgetAmount}
  onBudgetCurrencyChange={handleBudgetCurrencyChange}
  onBudgetAmountChange={handleBudgetAmountChange}
  error={error}
/>

          </div>
        </main>
      </div>
    </div>
  );
}

