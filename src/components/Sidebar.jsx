



//import ""; // Optional: if separate styles needed

// ─── ICONS (inline SVG — no emoji) ──────────────────────────────────────────

const Icon = {
  dashboard: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  proposals: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 12h6M9 16h4M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>,
  clients:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="7" r="3"/><path d="M17 20H7a4 4 0 01-4-4 6 6 0 016-6h6a6 6 0 016 6 4 4 0 01-4 4z"/></svg>,
  insights:  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  billing:   <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  settings:  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  bell:      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
};

const navGroups = [
  { label: null, items: [
    { icon: Icon.dashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Icon.bell, label: "AI Previews", path: "/ProjectOverviewPage" }, 
{ icon: Icon.proposals, label: "Proposals", path: "/ProposalDraftPage" },
    { icon: Icon.clients, label: "Clients", path: "/clients" }
  ] },
  { label: "Intelligence", items: [{ icon: Icon.insights, label: "Insights", path: "/insights" }] },
  { label: "Account", items: [{ icon: Icon.billing, label: "Billing", path: "/billing" }, { icon: Icon.settings, label: "Settings", path: "/settings" }] },
];

import { useNavigate } from "react-router-dom";

export default function Sidebar({ activeNav, setActiveNav, userData }) {
  const navigate = useNavigate();


  const getUserInitials = () => {
    if (userData?.name) {
      const names = userData.name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (userData?.email) {
      return userData.email[0].toUpperCase();
    }
    return "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("apiKey");
    navigate("/login");
  };

  return (
    <aside className="w-[216px] bg-slate-950 flex flex-col flex-shrink-0">
      <div className="h-14 px-5 flex items-center border-b border-white/[0.06]">
        <span className="text-white font-semibold text-[15px] tracking-tight">
          Propel<span className="text-emerald-400">AI</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-5" : ""}>
            {group.label && (
              <p className="px-2 mb-1.5 text-[10px] uppercase tracking-widest text-white/25 font-semibold">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveNav(item.label);
                    if (item.path) navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-left transition-colors cursor-pointer
                    ${isActive ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"}`}
                >
                  <span className={`cursor-pointer ${isActive ? "text-white" : "text-white/30"}`}>{item.icon}</span>
                  <span className={isActive ? "font-medium" : "font-normal"}>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-4 py-3.5 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 text-[11px] font-semibold flex-shrink-0">
            {getUserInitials()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white/70 text-xs font-medium truncate">{userData?.name || userData?.email || "User"}</p>
            <p className="text-white/25 text-[10px]">Pro Plan</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
          title="Logout"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

