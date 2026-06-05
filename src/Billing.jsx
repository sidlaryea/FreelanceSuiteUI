import Sidebar from "./components/Sidebar";
import { useMemo, useState } from "react";
import { Download, Plus, Filter, ChevronRight, TrendingUp } from "lucide-react";

const invoices = [
  { id: "INV-1001", client: "Cedar Fintech", amount: 4200, status: "Paid", date: "2026-05-14", method: "Visa" },
  { id: "INV-1002", client: "Atlas Advisors", amount: 980, status: "Overdue", date: "2026-05-29", method: "Paystack" },
  { id: "INV-1003", client: "Nova Retail", amount: 2350, status: "Pending", date: "2026-06-04", method: "Mastercard" },
  { id: "INV-1004", client: "Cedar Fintech", amount: 4000, status: "Overdue", date: "2026-05-22", method: "Paystack" },
];

function formatMoney(amount) {
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

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

  const derived = useMemo(() => {
    // This UI is currently using the hardcoded sample invoices.
    // We compute “this month” based on the latest invoice month.
    const sortedByDate = [...invoices].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sortedByDate[0];
    const latestMonthKey = latest ? `${latest.date.slice(0, 7)}` : null; // YYYY-MM

    const monthInvoices = latestMonthKey
      ? invoices.filter((inv) => inv.date.startsWith(latestMonthKey))
      : invoices;

    const revenueThisMonth = monthInvoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0);

    const outstandingAmount = invoices
      .filter((i) => i.status === "Overdue")
      .reduce((sum, i) => sum + i.amount, 0);

    const paidInvoicesCount = invoices.filter((i) => i.status === "Paid").length;

    const overdueCount = invoices.filter((i) => i.status === "Overdue").length;
    const pendingCount = invoices.filter((i) => i.status === "Pending").length;

    const invoiceUsageLimit = 20;
    const usedInvoices = invoices.length;

    const recentActivity = [...invoices]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Top clients by spend
    const byClient = new Map();
    invoices.forEach((inv) => {
      const current = byClient.get(inv.client) ?? 0;
      byClient.set(inv.client, current + inv.amount);
    });
    const topClients = [...byClient.entries()]
      .map(([client, total]) => ({ client, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    const biggestOverdue = [...invoices]
      .filter((i) => i.status === "Overdue")
      .sort((a, b) => b.amount - a.amount)[0];

    return {
      latestMonthKey,
      monthInvoices,
      revenueThisMonth,
      outstandingAmount,
      paidInvoicesCount,
      overdueCount,
      pendingCount,
      usedInvoices,
      invoiceUsageLimit,
      recentActivity,
      topClients,
      biggestOverdue,
    };
  }, []);

  const revenueValue = formatMoney(derived.revenueThisMonth || 0);
  const outstandingValue = formatMoney(derived.outstandingAmount || 0);

  const used = derived.usedInvoices;
  const limit = derived.invoiceUsageLimit;
  const remaining = Math.max(0, limit - used);

  return (
    <div className="flex h-screen bg-[#f6f8fc] overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar userData={{ company: "Workspace", profileImageUrl: "" }} />

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

          <button className="h-11 px-5 rounded-2xl border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </header>

        {/* Tabs Navigation */}
        <div className="bg-white border-b border-slate-200 px-8 sticky top-20 z-10">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-sm font-medium border-b-2 transition ${
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
                  title="Outstanding Amount"
                  value={outstandingValue}
                  footer={derived.overdueCount ? `${derived.overdueCount} invoices overdue` : "No overdue invoices"}
                />

                <KpiCard title="Paid Invoices" value={String(derived.paidInvoicesCount)} footer={"Total invoices"} />

                <KpiCard
                  title="Invoice Usage"
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
                      <span className="text-sm font-semibold text-slate-900">{derived.overdueCount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                        <span className="text-sm text-slate-700">Pending</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{derived.pendingCount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-sm text-slate-700">Paid</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{derived.paidInvoicesCount}</span>
                    </div>
                  </div>

                  {derived.biggestOverdue ? (
                    <div className="mt-6 rounded-3xl bg-amber-50 border border-amber-100 p-4">
                      <p className="text-sm font-medium text-amber-900">Biggest overdue</p>
                      <p className="text-sm text-amber-800 mt-1">
                        {derived.biggestOverdue.id} • {derived.biggestOverdue.client}
                      </p>
                      <p className="text-sm font-semibold text-amber-900 mt-1">
                        {formatMoney(derived.biggestOverdue.amount)}
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
                    {derived.recentActivity.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/40 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{inv.id}</p>
                          <p className="text-sm text-slate-600 truncate">{inv.client}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900">${inv.amount.toFixed(0)}</p>
                            <p className="text-xs text-slate-500">{inv.date}</p>
                          </div>
                          <StatusPill status={inv.status} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {derived.topClients?.length ? (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-slate-900">Top Clients</h4>
                      <div className="mt-3 space-y-3">
                        {derived.topClients.map((c) => {
                          const max = derived.topClients[0]?.total || 1;
                          const width = Math.round((c.total / max) * 100);
                          return (
                            <div key={c.client}>
                              <div className="flex items-center justify-between gap-4">
                                <p className="text-sm text-slate-700">{c.client}</p>
                                <p className="text-sm font-semibold text-slate-900">{formatMoney(c.total)}</p>
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
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Payment Method</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-medium text-slate-900">{invoice.id}</td>
                          <td className="px-6 py-4">{invoice.client}</td>
                          <td className="px-6 py-4">${invoice.amount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <StatusPill status={invoice.status} />
                          </td>
                          <td className="px-6 py-4">{invoice.date}</td>
                          <td className="px-6 py-4">{invoice.method}</td>
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
                          <p className="text-base font-semibold text-slate-900">Starter</p>
                        </div>
                        <p className="text-sm text-slate-500">Basic plan for growing teams</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <p className="text-sm font-medium text-slate-900">Invoice Limit</p>
                          <p className="text-base font-semibold text-slate-900">{derived.invoiceUsageLimit}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Used: {derived.usedInvoices}</span>
                            <span className="text-slate-600">Remaining: {Math.max(0, derived.invoiceUsageLimit - derived.usedInvoices)}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                              style={{ width: `${Math.round((derived.usedInvoices / Math.max(1, derived.invoiceUsageLimit)) * 100)}%` }}
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
                      <button className="w-full h-12 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition">
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

