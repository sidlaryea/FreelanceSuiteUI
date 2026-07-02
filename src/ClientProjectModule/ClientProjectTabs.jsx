import { useState } from "react";

const tabs = [
  "Dashboard",
  "Deliverables",
  "Files",
  "Timeline",
  "Risks",
  "Change Requests",
  "Meetings",
  "Messages",
  "Handover",
];

export default function ClientProjectTabs({ initialTab = "Dashboard", children }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="space-y-6">
      <div className="bg-white border-b border-slate-200 px-4 rounded-3xl overflow-hidden">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`cursor-pointer px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === t
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* children is expected to render by reading activeTab via props or by using this component.
          For now the parent renders a single-page layout; tab system can be expanded later. */}
      <div>{children}</div>
    </div>
  );
}

