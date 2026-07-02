import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClientLayout from "./ClientLayout";
import { getPublicProposal } from "./api/proposalApi";

export default function ClientProjectPage() {
  const { token } = useParams();

  const [activeTab, setActiveTab] = useState("Overview");
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProposal = async () => {
    try {
      const data = await getPublicProposal(token);
      setProposal(data);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////
  // LOAD PROPOSAL Ideal for the side bar and Title Information
  ///////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchProposal = async () => {
      await loadProposal();
    };

    fetchProposal();
  }, [token]);

  const deliverables = [];

  const tabs = [
    "Overview",
    "Deliverables",
    "Files",
    "Approvals",
    "Change Requests",
    "Meetings",
    "Updates",
    "Health",
    "Handover",
  ];

  const invoiceStatus = proposal?.invoiceStatus;

  const statusMap = {
    "Not Started": { tone: "slate", label: "Not Started" },
    "In Progress": { tone: "sky", label: "In Progress" },
    Blocked: { tone: "amber", label: "Blocked" },
    Completed: { tone: "emerald", label: "Completed" },
  };

  const statusBadge = (status) => {
    const item = statusMap[status] || { tone: "slate", label: status };
    const cls =
      {
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
        sky: "bg-sky-50 text-sky-700 border-sky-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
        red: "bg-red-50 text-red-700 border-red-200",
        slate: "bg-slate-50 text-slate-700 border-slate-200",
      }[item.tone];

    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}
      >
        {item.label}
      </span>
    );
  };

  const getNextStep = (status) => {
    if (status === "Completed") {
      return { title: "Review & handover", hint: "Wrap up deliverables and confirm acceptance." };
    }
    if (status === "Blocked") {
      return { title: "Resolve blockers", hint: "Clear issues so delivery can continue." };
    }
    return { title: "Continue delivery", hint: "Maintain momentum and keep approvals moving." };
  };

  const nextStep = getNextStep(invoiceStatus);

  const timeline = {
    projectStart: "12 Jun 2026",
    currentPhase: "Frontend Development",
    target: "30 Jul 2026",
    daysRemaining: 18,
  };

  const progressCards = [
    { title: "Progress", value: "" },
    { title: "Phase", value: timeline.currentPhase },
    { title: "Days Left", value: timeline.daysRemaining },
    { title: "Notifications", value: proposal?.unreadMessages },
  ];

  if (loading || !proposal) {
    return (
      <ClientLayout proposal={proposal}>
        <div className="space-y-6">
          <div className="h-10 bg-white rounded-2xl animate-pulse" />
          <div className="h-40 bg-white rounded-2xl animate-pulse" />
          <div className="h-60 bg-white rounded-2xl animate-pulse" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout proposal={proposal}>
      <div className="space-y-6">
        {/* Workflow / status header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {/* <h1 className="text-2xl font-bold">{proposal?.title || "Project Agreement"}</h1> */}
              <h1 className="text-1xl font-bold">
                ProjectID: {proposal.projectId || "PRJ-2026-0041"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Status + small insight */}
              <div className="hidden md:flex items-center gap-4 rounded-2xl bg-white/10 border border-white/15 px-4 py-3">
                <div className="min-w-[110px] text-right">
                  <p className="text-sm text-white/70">Invoice status</p>
                  <div className="mt-1 inline-flex justify-end">
                    {proposal?.invoiceStatus
                      ? statusBadge(proposal.invoiceStatus)
                      : statusBadge("Not Started")}
                  </div>
                </div>
                <div className="h-10 w-px bg-white/15" />

                {/* Improved Next step card */}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-white/10 border border-white/15">
                      <span className="text-base">{invoiceStatus === "Blocked" ? "⛔" : invoiceStatus === "Completed" ? "✅" : "🚚"}</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Next step</p>
                      <p className="text-sm font-semibold text-white leading-tight">
                        {nextStep.title}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-white/70 max-w-[240px]">
                    {nextStep.hint}
                  </p>
                </div>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {progressCards.map((c, idx) => (
                  <div
                    key={c.title}
                    className="group rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur transition hover:bg-white/15"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-white/70 font-medium">{c.title}</div>
                        <div className="mt-2 text-2xl font-bold text-white leading-tight">
                          {c.value === "" || c.value === null || c.value === undefined
                            ? "—"
                            : c.value}
                        </div>
                      </div>
                      <div className="mt-1 opacity-90">
                        {/* subtle per-card accent dot */}
                        <span
                          className={
                            idx === 0
                              ? "inline-block h-9 w-1 rounded-full bg-emerald-400/90"
                              : idx === 1
                              ? "inline-block h-9 w-1 rounded-full bg-sky-400/90"
                              : idx === 2
                              ? "inline-block h-9 w-1 rounded-full bg-amber-400/90"
                              : "inline-block h-9 w-1 rounded-full bg-fuchsia-400/90"
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* {Tabs} */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div className="space-y-6">
          {activeTab === "Overview" && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8">
              <div className="flex flex-col gap-6">
                {/* PROJECT SNAPSHOT */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">Project Snapshot</h2>
                      <p className="text-slate-500 mt-1">Quick view of what matters most.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                        ✓
                      </span>
                      <div>
                        <div className="text-xs text-slate-500">Overall Progress</div>
                        <div className="text-lg font-semibold text-slate-900">68% Complete</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <MetricCard title="Overall Progress" value="68%" footer="On Track" />
                    <MetricCard title="Current Phase" value="Design" />
                    <MetricCard title="Days Remaining" value="18" />
                    <MetricCard title="Pending Approvals" value="2" />
                  </div>
                </div>

                {/* TWO COLUMN LAYOUT: MAIN + RIGHT SUMMARY */}
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* LEFT COLUMN */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* CURRENT STATUS */}
                    <SectionCard
                      title="Current Project Status"
                      rightHint="Live project tracking"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-slate-500">Current Phase</p>
                          <h3 className="text-lg font-semibold mt-1">
                            Frontend Development
                          </h3>
                          <div className="mt-6 space-y-4">
                            <div>
                              <p className="text-xs text-slate-400">Started</p>
                              <p className="font-medium">12 Jul 2026</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">
                                Target Completion
                              </p>
                              <p className="font-medium">30 Jul 2026</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400">Project Manager</p>
                              <p className="font-medium">SidConsult</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-slate-500">Current Activity</p>
                          <div className="mt-4 rounded-2xl border border-slate-200 p-4 bg-slate-50">
                            Building homepage, dashboard, authentication screens and API integrations.
                          </div>
                          <div className="mt-6">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Phase Completion</span>
                              <span>68%</span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500"
                                style={{ width: "68%" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </SectionCard>

                    {/* RECENT ACTIVITY */}
                    <SectionCard
                      title="Recent Activity"
                      rightHint="Latest project updates"
                    >
                      <div className="space-y-3">
                        {[
                          {
                            title: "✓ Wireframes Uploaded",
                            date: "2 hours ago",
                          },
                          { title: "✓ Gap Analysis Approved", date: "Yesterday" },
                          {
                            title: "✓ Client Meeting Completed",
                            date: "3 days ago",
                          },
                          {
                            title: "✓ Requirements Signed Off",
                            date: "Last Week",
                          },
                        ].map((item) => (
                          <div key={item.title} className="flex gap-3">
                            <div className="mt-1 flex h-6 w-6 items-start justify-center">
                              <span className="h-3 w-3 rounded-full bg-emerald-500" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-900">
                                {item.title}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {item.date}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>

                    {/* PROJECT HEALTH */}
                    <SectionCard
                      title="Project Health"
                      rightHint="Milestone tracking"
                    >
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Requirements</span>
                            <span className="font-semibold text-slate-900">100%</span>
                          </div>
                          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: "100%" }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Gap Analysis</span>
                            <span className="font-semibold text-slate-900">100%</span>
                          </div>
                          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: "100%" }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Wireframes</span>
                            <span className="font-semibold text-slate-900">60%</span>
                          </div>
                          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: "60%" }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">UI Design</span>
                            <span className="font-semibold text-slate-900">45%</span>
                          </div>
                          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: "45%" }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Development</span>
                            <span className="font-semibold text-slate-900">35%</span>
                          </div>
                          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: "35%" }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Testing</span>
                            <span className="font-semibold text-slate-900">0%</span>
                          </div>
                          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: "0%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </SectionCard>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* ACTION REQUIRED */}
                    <SectionCard
                      title="Action Required"
                      rightHint="Items awaiting your input"
                    >
                      <div className="space-y-4">
                        <div className="border border-amber-200 bg-amber-50 rounded-2xl p-4">
                          <h4 className="font-semibold">Approve Wireframes</h4>
                          <p className="text-sm mt-1">
                            Design team is awaiting approval.
                          </p>
                          <button className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-xl">
                            Review
                          </button>
                        </div>

                        <div className="border border-sky-200 bg-sky-50 rounded-2xl p-4">
                          <h4 className="font-semibold">Change Request #12</h4>
                          <p className="text-sm mt-1">Additional Dashboard Module</p>
                          <p className="mt-2 font-medium">+$500 • +5 Days</p>
                          <button className="mt-3 bg-slate-900 text-white px-4 py-2 rounded-xl">
                            View Request
                          </button>
                        </div>
                      </div>
                    </SectionCard>

                    {/* QUICK ACCESS */}
                    <SectionCard title="Quick Access">
                      <div className="space-y-3">
                        <button className="w-full border rounded-2xl py-3 hover:bg-slate-50">
                          View Agreement
                        </button>
                        <button className="w-full border rounded-2xl py-3 hover:bg-slate-50">
                          Project Files
                        </button>
                        <button className="w-full border rounded-2xl py-3 hover:bg-slate-50">
                          Send Message
                        </button>
                        <button className="w-full border rounded-2xl py-3 hover:bg-slate-50">
                          Schedule Meeting
                        </button>
                      </div>
                    </SectionCard>

                    {/* FINANCIAL SUMMARY */}
                    <SectionCard title="Financial Summary">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-500">Total Project Value</p>
                          <p className="text-xl font-bold">$50,000</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Amount Paid</p>
                          <p className="text-xl font-bold text-emerald-600">
                            $25,000
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Remaining Balance</p>
                          <p className="text-xl font-bold text-amber-600">
                            $25,000
                          </p>
                        </div>
                      </div>
                    </SectionCard>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Deliverables" && (
            <SectionCard title="Deliverables" rightHint="Approvals included">
              <div className="space-y-4">
                {invoiceStatus === "Draft" && (
                  <Callout tone="amber" title="Pay deposit to activate the workspace">
                    Your project workspace will be automatically created once invoice
                    status becomes Partially Paid or Deposit Paid.
                  </Callout>
                )}

                {deliverables.map((d) => (
                  <div
                    key={d.name}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-slate-900">{d.name}</h3>
                          {statusBadge(d.status)}
                        </div>
                        <p className="text-sm text-slate-600 mt-2">{d.description}</p>
                        <div className="mt-3 text-sm text-slate-600 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <span className="text-slate-400">Owner:</span> {d.owner}
                          </div>
                          <div>
                            <span className="text-slate-400">Start:</span> {d.startDate}
                          </div>
                          <div>
                            <span className="text-slate-400">Due:</span> {d.dueDate}
                          </div>
                        </div>
                      </div>

                      <div className="sm:w-52">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Completion</span>
                          <span className="font-semibold text-slate-700">{d.completionPct}%</span>
                        </div>
                        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${d.completionPct}%` }}
                          />
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="cursor-pointer flex-1 rounded-xl border border-slate-200 py-2 text-sm hover:bg-slate-50">
                            Request Approval
                          </button>
                          <button className="cursor-pointer flex-1 rounded-xl bg-slate-900 text-white py-2 text-sm hover:bg-black">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {activeTab === "Files" && <SectionCard title="Files">Coming Soon</SectionCard>}
          {activeTab === "Approvals" && (
            <SectionCard title="Approvals">Coming Soon</SectionCard>
          )}
          {activeTab === "Change Requests" && (
            <SectionCard title="Change Requests">Coming Soon</SectionCard>
          )}
          {activeTab === "Meetings" && (
            <SectionCard title="Meetings">Coming Soon</SectionCard>
          )}
          {activeTab === "Updates" && (
            <SectionCard title="Updates">Coming Soon</SectionCard>
          )}
          {activeTab === "Health" && (
            <SectionCard title="Project Health">Coming Soon</SectionCard>
          )}
          {activeTab === "Handover" && (
            <SectionCard title="Handover">Coming Soon</SectionCard>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

function StatusLine({ tone, title }) {
  const cls =
    tone === "amber"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : tone === "sky"
      ? "bg-sky-50 text-sky-800 border-sky-200"
      : "bg-emerald-50 text-emerald-800 border-emerald-200";

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${cls}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {title}
    </div>
  );
}

function SectionCard({ title, children, rightHint }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 flex items-start justify-between gap-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {rightHint ? <p className="text-sm text-slate-500 mt-1">{rightHint}</p> : null}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function FolderRow({ name, files }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-4 last:mb-0">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-slate-900">{name}</h4>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
          {files.length} files
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {files.map((f) => (
          <div
            key={f}
            className="flex items-center justify-between text-sm text-slate-600"
          >
            <div className="truncate max-w-[240px]">{f}</div>
            <div className="text-xs text-slate-400">Uploaded</div>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full cursor-pointer rounded-xl border border-slate-200 py-2 text-sm hover:bg-slate-50">
        View Files
      </button>
    </div>
  );
}

function TimelineBlock({ timeline, progressPct }) {
  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Project Progress</span>
          <span className="font-semibold text-slate-900">{progressPct}%</span>
        </div>
        <div className="mt-3">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MetaLine label="Start" value={timeline.projectStart} />
        <MetaLine label="Current phase" value={timeline.currentPhase} />
        <MetaLine label="Target" value={timeline.target} />
        <MetaLine label="Days remaining" value={`${timeline.daysRemaining} Days`} />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-xs text-slate-500 uppercase tracking-wider">Milestone Tracking</div>
        <div className="mt-3 space-y-2 text-sm">
          <Milestone checked label="Requirements Approved" />
          <Milestone checked={false} label="Wireframes Approved" />
          <Milestone checked={false} label="Design Approved" />
          <Milestone checked={false} label="Development Completed" />
        </div>
      </div>
    </div>
  );
}

//Give me a Function for MetricCard

function MetricCard({ title, value, footer }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-xs text-slate-500 font-medium">{title}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900 leading-tight">
        {value === "" || value === null || value === undefined ? "—" : value}
      </div>
      {footer ? <div className="mt-2 text-xs text-slate-500">{footer}</div> : null}
    </div>
  );
}

function Callout({ tone, title, children }) {
  const cls =
    tone === "amber"
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : tone === "sky"
      ? "bg-sky-50 border-sky-200 text-sky-800"
      : "bg-emerald-50 border-emerald-200 text-emerald-800";

  return (
    <div className={`rounded-2xl border p-4 ${cls}`}>
      <div className="font-semibold">{title}</div>
      <div className="text-sm mt-1 opacity-90">{children}</div>
    </div>
  );
}

function MetaLine({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold text-slate-900 mt-1">{value}</div>
    </div>
  );
}

function Milestone({ checked, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold ${
          checked
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-white border-slate-200 text-slate-500"
        }`}
      >
        {checked ? "✓" : ""}
      </span>
      <span className={checked ? "text-emerald-800" : "text-slate-600"}>{label}</span>
    </div>
  );
}

function RiskItem({ title, probability, impact, mitigation }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-4 last:mb-0">
      <div className="font-semibold text-slate-900">{title}</div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
        <KeyVal label="Probability" value={probability} />
        <KeyVal label="Impact" value={impact} />
        <KeyVal label="Mitigation" value={mitigation} />
      </div>
    </div>
  );
}

function KeyVal({ label, value }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium text-slate-800 mt-1">{value}</div>
    </div>
  );
}

function ChangeRequestRow({ id, desc, impact, timeImpact, approval }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-4 last:mb-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold text-slate-900">Change Request {id}</div>
          <div className="text-sm text-slate-600 mt-1">{desc}</div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
          {approval}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <KeyVal label="Impact" value={impact} />
        <KeyVal label="Time" value={timeImpact} />
      </div>
      <div className="mt-4 flex gap-2">
        <button className="cursor-pointer flex-1 rounded-xl bg-emerald-600 text-white py-2 text-sm font-semibold hover:bg-emerald-700">
          Approve
        </button>
        <button className="cursor-pointer flex-1 rounded-xl border border-slate-200 py-2 text-sm hover:bg-slate-50">
          Reject
        </button>
      </div>
    </div>
  );
}

function MeetingRow({ title, date, attendees, summary, actions }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-4 last:mb-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold text-slate-900">{title}</div>
          <div className="text-xs text-slate-500 mt-1">{date}</div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
          {attendees}
        </span>
      </div>
      <div className="mt-3 text-sm text-slate-600">
        <div className="font-medium text-slate-800">Summary</div>
        <div className="mt-1">{summary}</div>
      </div>
      <div className="mt-3 text-sm text-slate-600">
        <div className="font-medium text-slate-800">Action Items</div>
        <div className="mt-1">{actions}</div>
      </div>
    </div>
  );
}

function MessageBubble({ who, text }) {
  const isClient = who === "Client";
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm mb-3 last:mb-0 ${
        isClient
          ? "bg-sky-50 border-sky-200 text-sky-900 self-start"
          : "bg-emerald-50 border-emerald-200 text-emerald-900 self-end"
      }`}
    >
      <div className="text-xs font-semibold opacity-90">{who}</div>
      <div className="mt-1">{text}</div>
    </div>
  );
}

function HealthRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function HealthBar({ progress, label, tone }) {
  const cls = tone === "emerald" ? "bg-emerald-500" : "bg-slate-500";

  return (
    <div>
      <div className="text-sm font-medium text-slate-800">{label}</div>
      <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`${cls} h-full rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function HandoverChecklist({ items }) {
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div
          key={i.label}
          className="flex items-center gap-2 text-sm rounded-2xl border border-slate-200 bg-white p-3"
        >
          <span
            className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold ${
              i.done
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-slate-200 text-slate-500"
            }`}
          >
            {i.done ? "✓" : ""}
          </span>
          <span
            className={
              i.done ? "text-emerald-800 font-medium" : "text-slate-600"
            }
          >
            {i.label}
          </span>
        </div>
      ))}
      <button className="w-full cursor-pointer mt-3 rounded-2xl bg-slate-900 text-white py-3 text-sm font-semibold hover:bg-black">
        Request Handover
      </button>
    </div>
  );
}

