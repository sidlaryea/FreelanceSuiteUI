import { useEffect, useState } from "react";
import { Bell, ChevronDown } from "lucide-react";

import { getClient } from "../api/clientApi";

export default function ClientTopbar({ proposal }) {
  const [open, setOpen] = useState(false);

  const [client, setClient] = useState(null);

  const clientName = client?.name || "Client";
const company = client?.companyName || "Your Company";
const API_BASE_URL = "http://localhost:5078";
const profileImageUrl = client?.logo
  ? client.logo.startsWith("http")
    ? client.logo
    : `${API_BASE_URL}${client.logo}`
  : "/default-avatar.png";

  useEffect(() => {
    let cancelled = false;

    const loadClient = async () => {
  try {
    const data = await getClient();
    

    if (!cancelled) {
      setClient(data[0] ?? null);
    }
  } catch (err) {
    console.error(err);
  }
};

    loadClient();

    return () => {
      cancelled = true;
    };
  }, []);

  const notifications = [
    {
      id: 1,
      text: "New message from support",
      time: "2 min ago",
    },
    {
      id: 2,
      text: "Invoice #102 is due",
      time: "1 day ago",
    },
  ];

  const unreadCount = notifications.length;

  return (
    <div className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">

      {/* 🔷 LEFT: PAGE CONTEXT */}
      <div>
        <h2 className="text-sm text-slate-500">
          Client Portal
        </h2>
        <p className="font-semibold text-slate-800">
          {proposal?.title || "Project Agreement"}
        </p>
      </div>

      {/* 🔷 RIGHT: ACTIONS */}
      <div className="flex items-center gap-4">

        {/* 🔔 NOTIFICATIONS */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <Bell className="w-5 h-5 text-slate-600" />

            {/* BADGE */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* 🔷 DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">

              <div className="p-4 border-b">
                <h3 className="font-semibold text-sm">Notifications</h3>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-4 hover:bg-slate-50 cursor-pointer border-b"
                    >
                      <p className="text-sm text-slate-800">
                        {n.text}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {n.time}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 text-center text-sm text-emerald-600 cursor-pointer hover:bg-slate-50">
                View all
              </div>
            </div>
          )}
        </div>

        {/* 👤 CLIENT PROFILE */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 px-3 py-2 rounded-lg transition">
          
          {/* AVATAR */}
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-medium">
           <img
  src={profileImageUrl}
  alt={clientName}
  className="w-9 h-9 rounded-full object-cover"
/>
          </div>

          {/* NAME */}
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-slate-800">
              {clientName}
            </p>
            <p className="text-xs text-slate-500">
              {company}
            </p>
          </div>

          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>

      </div>
    </div>
  );
}