import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
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

const mockClients = [
  {
    id: "c1",
    clientName: "Aurum Logistics",
    companyName: "Aurum Logistics Ltd",
    email: "accounts@aurumlogistics.com",
    phone: "+233 24 000 1111",
    relationshipStatus: "Enterprise",
    active: true,
    logoText: "AL",
    lastActivity: "Proposal viewed 2 hours ago",
    nextFollowUp: "Tomorrow • 10:00 AM",
    assignedTo: "Sidney",
    metrics: {
      totalProposals: 18,
      accepted: 7,
      revenue: 42000,
      outstandingAmount: 4000,
    },
    aiInsights: {
      clientHealth: 82,
      recommendation:
        "High engagement detected. Best time to send revised pricing is within 24 hours.",
      tags: ["Returning", "High Value", "Priority"],
    },
    timeline: [
      "Proposal opened • 2h ago",
      "Invoice paid • Yesterday",
      "Consultation completed • 4 days ago",
      "New proposal generated • 1 week ago",
    ],
  },
  {
    id: "c2",
    clientName: "Cedar Fintech",
    companyName: "Cedar Fintech Inc",
    email: "hello@cedarfintech.com",
    phone: "+233 20 900 2222",
    relationshipStatus: "Startup",
    active: true,
    logoText: "CF",
    lastActivity: "Invoice sent 1 day ago",
    nextFollowUp: "Friday • 2:30 PM",
    assignedTo: "Sidney",
    metrics: {
      totalProposals: 9,
      accepted: 2,
      revenue: 12000,
      outstandingAmount: 4000,
    },
    aiInsights: {
      clientHealth: 68,
      recommendation:
        "Client engagement has dropped slightly. Suggested follow-up email recommended.",
      tags: ["Startup", "Automation"],
    },
    timeline: [
      "Invoice sent • 1d ago",
      "Proposal viewed • 3 days ago",
      "Client meeting • 5 days ago",
      "Lead converted • 2 weeks ago",
    ],
  },
];

function formatCurrency(n) {
  try {
    return n.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  } catch {
    return `$${Number(n || 0).toFixed(0)}`;
  }
}

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Clients");
  const [selectedClientId, setSelectedClientId] = useState("c1");

  const selectedClient = useMemo(
    () => mockClients.find((c) => c.id === selectedClientId),
    [selectedClientId]
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return mockClients.filter((c) => {
      const matches =
        c.clientName.toLowerCase().includes(q) ||
        c.companyName.toLowerCase().includes(q);

      if (activeTab === "High Value") {
        return matches && c.metrics.revenue >= 20000;
      }

      return matches;
    });
  }, [query, activeTab]);

  const totalRevenue = mockClients.reduce(
    (acc, c) => acc + c.metrics.revenue,
    0
  );

  return (
    <div
      className="flex h-screen bg-[#f6f8fc] overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* KEEPING YOUR SIDEBAR UNTOUCHED */}
      <Sidebar userData={{ company: "Workspace", profileImageUrl: "" }} />

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
            <button className="h-11 px-4 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition flex items-center gap-2">
              <Upload size={16} />
              Import
            </button>

            <button className="h-11 px-4 rounded-2xl bg-slate-900 text-white hover:bg-black transition flex items-center gap-2 shadow-lg shadow-slate-200">
              <Plus size={16} />
              Add Client
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* KPI SECTION */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
              {[
                {
                  label: "Total Clients",
                  value: "128",
                  growth: "+12%",
                },
                {
                  label: "Proposal Win Rate",
                  value: "63%",
                  growth: "+8%",
                },
                {
                  label: "Revenue Generated",
                  value: formatCurrency(totalRevenue),
                  growth: "+21%",
                },
                {
                  label: "Outstanding Invoices",
                  value: "$14,000",
                  growth: "-2%",
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
                      Aurum Logistics is highly engaged and likely ready for a
                      revised proposal this week.
                    </h2>

                    <p className="text-slate-300 mt-3 max-w-2xl">
                      Based on recent proposal views, payment behavior and
                      engagement activity.
                    </p>
                  </div>

                  <button className="h-12 px-5 rounded-2xl bg-white text-slate-900 font-medium hover:bg-slate-100">
                    Generate Proposal
                  </button>
                </div>
              </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-7">
              {/* CLIENT LIST */}
              <div className="xl:col-span-2 space-y-5">
                {filtered.map((client) => (
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
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold text-lg">
                          {client.logoText}
                        </div>

                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {client.clientName}
                            </h3>

                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                              {client.relationshipStatus}
                            </span>

                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                              {client.aiInsights.clientHealth}% Health
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
                          {client.metrics.totalProposals}
                        </h4>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs text-slate-500 uppercase">
                          Accepted
                        </p>
                        <h4 className="text-xl font-bold mt-2">
                          {client.metrics.accepted}
                        </h4>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs text-slate-500 uppercase">
                          Revenue
                        </p>
                        <h4 className="text-xl font-bold mt-2">
                          {formatCurrency(client.metrics.revenue)}
                        </h4>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4">
                        <p className="text-xs text-slate-500 uppercase">
                          Outstanding
                        </p>
                        <h4 className="text-xl font-bold mt-2">
                          {formatCurrency(
                            client.metrics.outstandingAmount
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
                            {client.lastActivity}
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
                          {selectedClient.logoText}
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {selectedClient.clientName}
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
                              {selectedClient.aiInsights.clientHealth}%
                            </h2>
                          </div>

                          <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                            <ArrowUpRight size={24} />
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm mt-5 leading-relaxed">
                          {selectedClient.aiInsights.recommendation}
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
                        {selectedClient.timeline.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>

                            <div>
                              <p className="text-sm text-slate-800 font-medium">
                                {item}
                              </p>
                            </div>
                          </div>
                        ))}
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