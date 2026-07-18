import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../Context/NotificationContext";
import { loadSubscriptionSummary } from "../services/clientService";
import { API_BASE_Invoice,API_BASE_Proposal } from "../config/api";




// ─── ICONS (inline SVG — no emoji) ──────────────────────────────────────────
const Icon = {
  dashboard: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  previews: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 12h6M9 16h4M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  ),
  proposals: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 12h6M9 16h4M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  ),
  clients: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="7" r="3" />
      <path d="M17 20H7a4 4 0 01-4-4 6 6 0 016-6h6a6 6 0 016 6 4 4 0 01-4 4z" />
    </svg>
  ),
  intelligence: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  billing: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  bell: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
};

export default function Sidebar({ activeNav, setActiveNav, userData }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [subscription, setSubscription] = useState(null);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const { unreadNotifications } = useNotifications();
  const unpaidInvoices = userData?.unpaidInvoices ?? 0;

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await loadSubscriptionSummary();
        setSubscription(response);
      } catch (error) {
        setSubscriptionError("Unable to load subscription details.");
        console.error("Sidebar subscription fetch error:", error);
      }
    };

    fetchSubscription();
  }, []);

  const navSections = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: Icon.dashboard, path: "/dashboard" },
        { label: "AI Previews", icon: Icon.previews, path: "/ProjectOverviewPage" },
      ],
    },
    {
      title: "Work",
      items: [
        { label: "Proposals", icon: Icon.proposals, path: "/ProposalDraftPage" },
        { label: "Clients", icon: Icon.clients, path: "/ClientsPage" },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          label: "Billing",
          icon: Icon.billing,
          path: "/billing",
          badge: unpaidInvoices > 0 ? unpaidInvoices : null,
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          label: "Notifications",
          icon: Icon.bell,
          path: "/Notifications",
          badge: unreadNotifications > 0 ? unreadNotifications : null,
        },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Settings", icon: Icon.settings, path: "/ProposalSettings" },
      ],
    },
  ];

  

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("apiKey");
    navigate("/login");
  };

  const isActive = (path, label) => {
    if (location.pathname === path) return true;
    return activeNav === label;
  };

  return (
    <aside className="sticky top-0 h-screen overflow-hidden bg-slate-950 text-white flex flex-col border-r border-white/10">
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-lg font-semibold tracking-tight">FreeLancePro</h1>
        <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
          Powered by SidConsult
          <img
            src={`${API_BASE_Proposal}/logo.png`}
            alt="SidConsult Logo"
            className="inline-block h-5 ml-1 -mt-0.5"
          />
        </p>
      </div>

      <div className="px-6 py-5 border-b border-white/10">
        
        {subscription ? (
          <div className="mt-3 space-y-2 text-xs text-white/70">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-white">{subscription.planName} Plan</span>
              
            </div>
            <p>{subscription.description}</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-emerald-400 font-medium">Active</span>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-emerald-400 font-medium">Active</span>
          </div>
        )}
        {subscriptionError && (
          <p className="mt-3 text-xs text-rose-300">{subscriptionError}</p>
        )}
      </div>

      <nav className="  flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-2 text-xs text-white/40 uppercase tracking-wider mb-2">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path, item.label);
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveNav?.(item.label);
                      if (item.path) navigate(item.path);
                    }}
                    className={`cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                      active
                        ? "bg-white text-slate-900 font-medium"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={active ? "text-slate-900" : "text-white/40"}>{item.icon}</span>
                      {item.label}
                    </div>
                    {item.badge > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          active ? "bg-slate-200 text-slate-900" : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="sticky bottom-0 z-10 px-5 py-4 border-t border-white/10 bg-slate-950">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-sm font-medium">Need help?</p>
          <p className="text-xs text-white/50 mt-1">We're here to support you through your project.</p>
          <button className="mt-3 w-full bg-white text-slate-900 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer">
            Contact Support
          </button>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-white/10 bg-slate-950">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-semibold overflow-hidden">
              <img
                src={userData?.profileImageUrl || `${API_BASE_Proposal}/default-avatar.png`}
                alt={userData?.name || userData?.email || "User avatar"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{userData?.name || userData?.email || "User"}</p>
              <p className="text-xs text-white/50">
                {subscription?.planName ? `${subscription.planName} Plan` : "Loading plan..."}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition text-[11px] cursor-pointer font-medium"
          >
            Sign out
          </button>
        </div>
      </div>

      
    </aside>
  );
}

