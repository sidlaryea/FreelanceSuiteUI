import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { API_BASE_Proposal,API_BASE_Invoice } from "../config/api";

import {
  FileText,
  CreditCard,
  LayoutDashboard,
  MessageCircle,
  User,
  Receipt,
  
} from "lucide-react";

export default function ClientSidebar({ proposal }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [lockedModalOpen, setLockedModalOpen] = useState(false);

  const token = proposal?.publicToken;

  const isActive = (path) => location.pathname === path;

  // 🔷 Dynamic counts (replace later with API data)
  const unreadMessages = proposal?.unreadMessages || 2;
  const unpaidInvoices = proposal?.unpaidInvoices || 1;

  const navSections = [
    {
      title: "Overview",
      items: [
        {
          label: "Proposal",
          icon: FileText,
          
          path: `/client/proposal/${token}`,
        },
        {
          label: "Project Tracker",
          icon: LayoutDashboard,
          
          path: `/client/project/${token}`,
          //locked: true,
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          label: "Payment",
          icon: CreditCard,
          path: `/client/payment/${token}`,
          
        },
        {
          label: "Invoices",
          icon: Receipt,
          path: `/client/invoices`,
          badge: unpaidInvoices > 0 ? unpaidInvoices : null,
          locked: true,
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          label: "Messages",
          icon: MessageCircle,
          path: `/client/messages`,
          badge: unreadMessages > 0 ? unreadMessages : null,
          locked: true,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "Profile",
          icon: User,
          path: `/client/profile`,
          locked: true,
        },
      ],
    },
  ];

  return (
    <aside className="sticky top-0 h-screen w-85 overflow-hidden bg-slate-950 text-white flex flex-col border-r border-white/10">

      {/* 🔷 HEADER / BRAND */}
      <div className="px-6 py-5 border-b border-white/10 ">
        <h1 className="text-lg font-semibold tracking-tight">
          Client Portal
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Powered by SidConsult
          <img src={`${API_BASE_Proposal}/logo.png`} alt="SidConsult Logo" className="inline-block h-5 ml-1 -mt-0.5" />
        </p>
      </div>

      {/* 🔷 PROJECT CONTEXT */}
      <div className="px-6 py-5 border-b border-white/10 ">
        <p className="text-xs text-white/50 uppercase tracking-wide">
          Project
        </p>

        <h2 className="mt-1 text-sm font-small leading-snug break-words">
          {proposal?.title || "Project Agreement"}
        </h2>

        <div className="mt-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs text-emerald-400 font-medium">
            Accepted
          </span>
        </div>
      </div>

      {/* 🔷 MODAL (LOCKED ITEM) */}
      {lockedModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Access Locked</h3>
            <p className="text-sm text-slate-600 mt-2">
              This section is locked. Please contact support.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                className="flex-1 rounded-xl border border-slate-200 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                onClick={() => setLockedModalOpen(false)}
              >
                Close
              </button>
              <button
                className="flex-1 rounded-xl bg-slate-900 text-white py-2 text-sm hover:bg-black cursor-pointer"
                onClick={() => {
                  setLockedModalOpen(false);
                  navigate("/client/support");
                }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 🔷 NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto ">

        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-2 text-xs text-white/40 uppercase tracking-wider mb-2 ">
              {section.title}
            </p>

            <div className="space-y-1 ">
              {section.items.map((item) => {
                const active = isActive(item.path);

               return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.locked) {
                        setLockedModalOpen(true);
                        return;
                      }
                      navigate(item.path);
                    }}
                    className={` cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition
                      ${
                        active
                          ? "bg-white text-slate-900 font-medium"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>

                    {/* 🔷 BADGE */}
                    {item.badge > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium
                          ${
                            active
                              ? "bg-slate-200 text-slate-900"
                              : "bg-emerald-500/20 text-emerald-400"
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

      {/* 🔷 FOOTER / SUPPORT */}
      <div className="sticky bottom-0 z-10 px-5 py-4 border-t border-white/10 bg-slate-950">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-sm font-medium">Need help?</p>
          <p className="text-xs text-white/50 mt-1">
            We're here to support you through your project.
          </p>

          <button className="mt-3 w-full bg-white text-slate-900 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition cursor-pointer">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}