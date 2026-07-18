import Sidebar from "./components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Download, Plus, Filter, ChevronRight, TrendingUp } from "lucide-react";

import {loadDashboardSummary as fetchDashboardSummary,loadInvoiceList,loadSubscriptionSummary as fetchSubscriptionSummary} from  "./services/clientService";
import TopNav from "./components/Layout/TopNav";
import {API_BASE_Invoice,API_BASE_Proposal} from "./config/api"





function StatusPill({ status }) {
  const cls =
    status === "Paid"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Pending"
      ? "bg-sky-100 text-sky-700"
      : "bg-red-100 text-red-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

function KpiCard({ title, value, footer, icon }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-4 text-3xl font-bold text-slate-900">{value}</h2>
      {footer ? <div className="mt-3 flex items-center gap-2 text-sm font-medium">{icon ? icon : null}{footer}</div> : null}
    </div>
  );
}

export default function Billing() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    { name: "Overview", id: "Overview" },
    { name: "Invoices", id: "Invoices" },
    { name: "Usage & Limits", id: "Usage" },
  ];

 

const [invoiceList, setInvoiceList] = useState([]);

      useEffect(() => {
        loadInvoices();
      }, []);

      const loadInvoices = async () => {
        try {
          const data = await loadInvoiceList();
          setInvoiceList(data);
        } catch (error) {
          console.error(error);
        }
      };



 

  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [subscriptionSummary, setSubscriptionSummary] = useState(null);
  const [userData, setUserData] = useState(null);



useEffect(() => {
  loadDashboardData();
  loadSubscriptionSummary();
  loadUserProfile();
}, []);

const loadUserProfile = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    const response = await axios.get(`${API_BASE_Invoice}/api/Register/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey,
      },
    });
    setUserData(response.data);
  } catch (error) {
    console.error("Failed to load billing profile:", error);
  }
};

const loadDashboardData = async () => {
  try {
    const response = await fetchDashboardSummary();

    setDashboardSummary(response);
  } catch (error) {
    console.error(error);
  }
};

const loadSubscriptionSummary = async () => {
  try {
    const response = await fetchSubscriptionSummary();

    setSubscriptionSummary(response);
  } catch (error) {
    console.error(error);
  }
};

const topClients =
  dashboardSummary?.topClients || [];

function formatCurrency(n, currency) {
  try {
    return Number(n ?? 0).toLocaleString(undefined, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    });
  } catch {
    return `${Number(n ?? 0).toFixed(0)}`;
  }
}
console.log("dashboardSummary", dashboardSummary);
const currency =
  dashboardSummary?.currency || "GHS";

const revenueValue = formatCurrency(
  dashboardSummary?.revenueGenerated || 0,
  currency
);

// const outstandingValue = formatCurrency(
//   dashboardSummary?.outstandingInvoices || 0,
//   currency
// );

const used =
  subscriptionSummary?.used || 0;

const limit =
  subscriptionSummary?.monthlyProposalLimit || 0;

  const description = subscriptionSummary?.description;

const remaining = subscriptionSummary?.remaining || 0;
const plan = subscriptionSummary?.planName;










  return (
    <div className="flex h-screen bg-[#f6f8fc] overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar
        userData={
          userData || {
            company: "Workspace",
            profileImageUrl: `${API_BASE_Proposal}/default-avatar.png`,
            name: "User",
            email: "",
          }
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Billing</h1>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                Finance Hub
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Manage invoices, payments, and subscription usage.</p>
          </div>

          <TopNav/>
        </header>

        {/* Tabs Navigation */}
        <div className="bg-white border-b border-slate-200 px-8 sticky top-20 z-10">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-sm font-medium border-b-2 transition cursor-pointer ${
                  activeTab === tab.id
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === "Overview" && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <KpiCard
                  title="Revenue This Month"
                  value={revenueValue}
                  icon={<TrendingUp size={16} />}
                  footer={"+15% from last month"}
                />

                <KpiCard
                  title="Outstanding Invoices"
                  value={`${dashboardSummary?.outstandingInvoiceCount ?? 0}  Outstanding`}
                  // footer={`${dashboardSummary?.outstandingInvoiceCount ?? 0} invoices outstanding`}
                />

                <KpiCard title="Paid Invoices" value={`${dashboardSummary?.paidInvoices ?? 0}`} footer={`${dashboardSummary?.totalInvoices ?? 0} total invoices`} />

                <KpiCard
                  title="Proposal Usage"
                  value={`${used}/${limit}`}
                  footer={`${remaining} remaining`}
                />
              </div>

              {/* ===== BELOW CARDS: Breakdown + Activity ===== */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Quick status breakdown */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm lg:col-span-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Status Breakdown</h3>
                      <p className="text-sm text-slate-500 mt-1">At a glance across all invoices</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="text-sm text-slate-700">Overdue</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{dashboardSummary?.overdueCount ?? 0}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                        <span className="text-sm text-slate-700">Pending</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{dashboardSummary?.pendingCount ?? 0}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-sm text-slate-700">Paid</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{dashboardSummary?.paidInvoices ?? 0}</span>
                    </div>
                  </div>

                  {dashboardSummary?.biggestOutstanding ? (
                    <div className="mt-6 rounded-3xl bg-amber-50 border border-amber-100 p-4">
                          <p className="text-sm font-medium text-amber-900">
                            Biggest Outstanding
                          </p>

                          <p className="text-sm text-amber-800 mt-1">
                            {dashboardSummary.biggestOutstanding.invoiceNumber}
                            {" • "}
                            {dashboardSummary.biggestOutstanding.customerName}
                          </p>

                          <p className="text-sm font-semibold text-amber-900 mt-1">
                            {formatCurrency(
                              dashboardSummary.biggestOutstanding.balanceDue,
                              dashboardSummary.biggestOutstanding.currency
                            )}
                          </p>
                        </div>
                  ) : null}
                </div>

                {/* Recent invoice activity */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                      <p className="text-sm text-slate-500 mt-1">Latest changes across your invoices</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {dashboardSummary?.recentActivity?.map((inv) => (
                      <div
                        key={inv.invoiceNumber}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/40 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{inv.invoiceNumber}</p>
                          <p className="text-sm text-slate-600 truncate">{inv.clientName}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">Total Amount:{formatCurrency(inv.amount, inv.currency)}</p>
                            <p className="text-sm font-semibold text-slate-900">Amount Paid:{formatCurrency(inv.amountPaid, inv.currency)}</p>
                            <p className="text-xs text-slate-500">{new Date(inv.date).toLocaleDateString()}</p>
                          </div>
                          <StatusPill status={inv.status} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {topClients?.length ? (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-slate-900">Top Clients</h4>
                      <div className="mt-3 space-y-3">
                        {topClients.map((client) => {
                          const max = topClients[0]?.totalAmount || 1;
                          const width = Math.round((client.totalAmount / max) * 100);
                          return (
                            <div key={client.clientName}>
                              <div className="flex items-center justify-between gap-4">
                                <p className="text-sm text-slate-700">{client.clientName}</p>
                                <p className="text-sm font-semibold text-slate-900">{formatCurrency(
                  client.totalAmount,
                  client.currency
                )}</p>
                              </div>
                              <div className="mt-2 h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${width}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          )}

          {/* ===== INVOICES TAB ===== */}
          {activeTab === "Invoices" && (
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Invoice List</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage and track all client invoices.</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button className="h-11 px-4 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 transition flex items-center gap-2">
                    <Filter size={16} />
                    Filter
                  </button>
                  <button className="h-11 px-5 rounded-2xl bg-slate-900 text-white hover:bg-black transition flex items-center gap-2 shadow-lg shadow-slate-200">
                    <Plus size={16} />
                    Create Invoice
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Invoice ID</th>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Currency</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Amount Paid</th>
                        <th className="px-6 py-4">Balance</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Invoice Issue Date</th>
                        <th className="px-6 py-4">Invoice Due Date</th>
                        <th className="px-6 py-4">Payment Method</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceList.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-medium text-slate-900">{invoice.invoiceNumber}</td>
                          <td className="px-6 py-4">{invoice.clientName}</td>
                          <td className="px-6 py-4">{invoice.currency}</td>
                          <td className="px-6 py-4">{invoice.total.toFixed(2)}</td>
                          <td className="px-6 py-4">{invoice.amountPaid.toFixed(2)}</td>
                          <td className="px-6 py-4">{invoice.balanceDue.toFixed(2)}</td>

                          <td className="px-6 py-4">
                            <StatusPill status={invoice.status} />
                          </td>
                          <td className="px-6 py-4">{invoice.issueDate}</td>
                          <td className="px-6 py-4">{invoice.dueDate}</td>
                          <td className="px-6 py-4">{invoice.paymentMethod}</td>
                          <td className="px-6 py-4">
                            <button className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 transition">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ===== USAGE & LIMITS TAB ===== */}
          {activeTab === "Usage" && (
            <section className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-slate-900">Usage & Limits</h2>
                    <p className="text-sm text-slate-500 mt-2">Track your current plan limits and usage.</p>

                    <div className="mt-8 space-y-6">
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <p className="text-sm font-medium text-slate-900">Current Plan</p>
                          <p className="text-base font-semibold text-slate-900">{plan}</p>
                        </div>
                        <p className="text-sm text-slate-500">{description}</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <p className="text-sm font-medium text-slate-900">Invoice Limit</p>
                          <p className="text-base font-semibold text-slate-900">{limit}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Used: {used}</span>
                            <span className="text-slate-600">Remaining: {remaining}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                              style={{ width: `${Math.round((used / Math.max(1, limit)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl bg-slate-50 p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-900">Next Reset Date</p>
                            <p className="text-base text-slate-700 mt-1">01 Jul 2026</p>
                          </div>
                          <ChevronRight size={20} className="text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 lg:w-80">
                    <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 text-white">
                      <h3 className="text-lg font-semibold mb-6">Ready to scale?</h3>
                      <p className="text-sm text-slate-200 mb-6">
                        Upgrade to Pro or Enterprise for unlimited invoices and advanced features.
                      </p>
                      <button className="cursor-pointer w-full h-12 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition">
                        Upgrade Plan
                      </button>
                      <p className="mt-4 text-xs text-slate-300 text-center">No contract. Cancel anytime.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

