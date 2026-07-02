import Sidebar from "./components/Sidebar";
import axios from "axios";
import { useNotifications } from "./Context/NotificationContext";
import TopNav from "./components/Layout/TopNav";

import { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { Trash2, CheckSquare } from "lucide-react";
import { useToast } from "./components/ToastProvider";

function KpiCard({ title, value, footer }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-4 text-3xl font-bold text-slate-900">{value}</h2>
      {footer ? <div className="mt-3 text-sm font-medium text-slate-700">{footer}</div> : null}
    </div>
  );
}

function SectionCard({ title, children, right }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="px-6 py-5 flex items-start justify-between gap-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        {right}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Badge({ tone, children }) {
  const map = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    sky: "bg-sky-50 text-sky-700 border-sky-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    slate: "bg-slate-50 text-slate-700 border-slate-100",
  };

  return (
    <span className={`inline-flex items-center gap-2 border px-3 py-1 rounded-full text-xs font-semibold ${map[tone] || map.slate}`}>
      {children}
    </span>
  );
}

function NotificationPreferenceRow({ title, description, smsOptional = false, value, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/40 px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          {description ? <p className="text-sm text-slate-600 mt-1">{description}</p> : null}
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <label className="cursor-pointer select-none inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white">
            <input
              type="checkbox"
              checked={!!value.email}
              onChange={(e) => onChange({ ...value, email: e.target.checked })}
            />
            <span className="text-sm font-medium text-slate-700">Email</span>
          </label>

          <label className="cursor-pointer select-none inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white">
            <input
              type="checkbox"
              checked={!!value.inApp}
              onChange={(e) => onChange({ ...value, inApp: e.target.checked })}
            />
            <span className="text-sm font-medium text-slate-700">In-App</span>
          </label>

          {smsOptional ? (
            <label className="cursor-pointer select-none inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white">
              <input
                type="checkbox"
                checked={!!value.sms}
                onChange={(e) => onChange({ ...value, sms: e.target.checked })}
              />
              <span className="text-sm font-medium text-slate-700">SMS</span>
            </label>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("Overview");
  const [ Notifications] = useState([]);
   const [ categoryNotifications,setCategoryNotifications] = useState([]);
 const [ loadingNotifications,setLoadingNotifications] = useState(false);
const [dashboard, setDashboard] = useState(null);
  const [inboxNotifications, setInBoxNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotificationIds, setSelectedNotificationIds] = useState(new Set());
  const [userData, setUserData] = useState(null);
  

  const categoryMap = {
  Inbox: null,
  Proposals: 1,
  Invoices: 2,
  CRM: 3,
  Automations: 4,
};

const [notificationSettings, setNotificationSettings] =
  useState({
    emailEnabled: true,
    inAppEnabled: true,
    smsEnabled: false,
  });



const fetchDashboard = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/Proposal/api/Notifications/Overview-dashboard`,
    {
      headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        },
    }
  );

  setDashboard(response.data);
};


//  const fetchNotifications = async () => {
//   try {
//     setLoadingNotifications(true);

//     const token = localStorage.getItem("token");
// const apiKey = localStorage.getItem("apiKey");
//     const response = await axios.get(
//       `http://localhost:5214/Proposal/api/Notifications/`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-API-KEY": apiKey
//         },
//       }
//     );

//     setNotifications(response.data);
//   } catch (error) {
//     console.error("Failed to load notifications", error);
//   } finally {
//     setLoadingNotifications(false);
//   }
// };

const fetchInBoxNotifications = async () => {
  try {
    setLoading(true);

const token = localStorage.getItem("jwtToken");
const apiKey = localStorage.getItem("apiKey");

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/Proposal/api/Notifications/Inbox-notifications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        },
      }

    );

    setInBoxNotifications(response.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const fetchCategoryNotifications = async (category = null) => {
  try { 
    // skip local state updates; notifications/mark-as-read come from NotificationContext

    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

    let url =
      `${import.meta.env.VITE_API_URL}/Proposal/api/Notifications/Inbox-notifications`;

    if (category !== null) {
      url += `?category=${category}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey,
      },
    });

    setCategoryNotifications(response.data);
  } catch (error) {
    console.error("Failed to load inbox notifications", error);
  } finally {
    setLoadingNotifications(false);
  }
};


const loadSettings = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/Proposal/api/Notifications/settings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey,
      },
    }
  );

  setNotificationSettings(response.data);
};

const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/Register/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": apiKey,
      },
    });
    setUserData(response.data);
  } catch (error) {
    console.error("Failed to load notification profile:", error);
  }
};

const saveSettings = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/Proposal/api/Notifications/settings`,
      notificationSettings,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey,
        },
      }
    );
    showToast({ message: "Notification settings saved successfully.", tone: "success" });
  } catch (error) {
    console.error(error);
    showToast({ message: "Failed to save notification settings.", tone: "error" });
  }
};

useEffect(() => {
  fetchDashboard();
  loadSettings();
  fetchUserProfile();
}, []);


useEffect(() => {
  if (activeTab === "Inbox") {
    fetchInBoxNotifications();
  }
}, [activeTab]);
useEffect(() => {
  if (
    ["Inbox", "Proposals", "Invoices", "CRM", "Automations"]
      .includes(activeTab)
  ) {
    fetchCategoryNotifications(categoryMap[activeTab]);
  }
}, [activeTab]);


const {
  notifications,
  //loadingNotifications,

  markAsRead,
  markAllRead,
  deleteNotification,
} = useNotifications();

// const markAsRead = async (notificationId) => {
//   const token = localStorage.getItem("token");
//     const apiKey = localStorage.getItem("apiKey");
//   try {

    
//     await axios.put(
//       `http://localhost:5214/Proposal/api/Notifications/${notificationId}/read`,
//       {},
//        {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-API-KEY": apiKey
//         },
//       }

//     );

//     setInBoxNotifications((prev) =>
//       prev.map((item) =>
//         item.id === notificationId
//           ? { ...item, isRead: true }
//           : item
//       )
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };



// const markAllRead = async () => {
//   try {

//     const token = localStorage.getItem("token");
// const apiKey = localStorage.getItem("apiKey");
//     await axios.put(
//       "http://localhost:5214/Proposal/api/Notifications/read-all",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-API-KEY": apiKey
//         },
//       }

//     );

//     setInBoxNotifications((prev) =>
//       prev.map((item) => ({
//         ...item,
//         isRead: true,
//       }))
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };



// const deleteNotification = async (
//   notificationId
// ) => {
//   try {
//     const token = localStorage.getItem("token");
// const apiKey = localStorage.getItem("apiKey");
//     await axios.delete(
//       `http://localhost:5214/Proposal/api/Notifications/${notificationId}`,
//       {},
// {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-API-KEY": apiKey
//         },
//       }

//     );

//     setInBoxNotifications((prev) =>
//       prev.filter(
//         (item) => item.id !== notificationId
//       )
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };



const getCategoryBadge = (category) => {
  switch (category) {
    case 1:
      return "bg-emerald-100 text-emerald-700";

    case 2:
      return "bg-sky-100 text-sky-700";

    case 3:
      return "bg-amber-100 text-amber-700";

    case 4:
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};






const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};




  const [preferences, setSettings] = useState({
    proposalAccepted: { email: true, inApp: true, sms: false },
    invoicePaid: { email: true, inApp: true, sms: false },
    invoiceOverdue: { email: true, inApp: true, sms: true },
  });

  const preferenceRows = [
    {
      key: "proposalAccepted",
      title: "Proposal Accepted",
      description: "Triggered when a client accepts a proposal.",
      smsOptional: false,
    },
    {
      key: "invoicePaid",
      title: "Invoice Paid",
      description: "Triggered when payment is confirmed.",
      smsOptional: false,
    },
    {
      key: "invoiceOverdue",
      title: "Invoice Overdue",
      description: "Triggered when an invoice becomes overdue.",
      smsOptional: true,
    },
  ];

  const headerSubtitle = useMemo(() => {
    switch (activeTab) {
      case "Overview":
        return "Monitor proposal activity, invoice updates, CRM alerts and automations.";
      case "Inbox":
        return "Events across proposals, invoices, CRM, and system.";
      case "Proposals":
        return "Proposal events and updates.";
      case "Invoices":
        return "Invoice lifecycle events.";
      case "CRM":
        return "CRM-driven changes and lead updates.";
      case "Automations":
        return "Automation events generated automatically.";
      case "Settings":
        return "Choose how and where notifications are delivered.";
      default:
        return "";
    }
  }, [activeTab]);

  

 

  const tabs = [
    "Overview",
    "Inbox",
    "Proposals",
    "Invoices",
    "CRM",
    "Automations",
    "Settings",
  ];



const ToggleRow = ({
  label,
  description,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <h4 className="font-medium text-slate-900">
          {label}
        </h4>

        {description && (
          <p className="text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      <button
  onClick={() => onChange(!value)}
  className={`cursor-pointer relative inline-flex h-7 w-12 items-center rounded-full border transition-all duration-300 ${
    value
      ? "bg-emerald-500 border-emerald-500"
      : "bg-slate-200 border-slate-300"
  }`}
>
  <span
    className={`cursor-pointer   h-5 w-5 rounded-full bg-white shadow-lg transition-all duration-300 ${
      value ? "translate-x-6" : "translate-x-1"
    }`}
  />
</button>
    </div>
  );
};


const renderNotificationList = () => {
  if (loadingNotifications) {
    return (
      <div className="text-center py-10">
        Loading notifications...
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
        <h4 className="font-medium text-slate-700">
          No notifications found
        </h4>

        <p className="text-sm text-slate-500 mt-2">
          Activity will appear here when available.
        </p>
      </div>
    );
  }

  return categoryNotifications.map((notification) => (
    <div
      key={notification.id}
      className={`rounded-2xl border p-5 transition-all ${
        !notification.isRead
          ? "border-blue-200 bg-blue-50/40"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">
            {notification.title}
          </h4>

          <p className="text-sm text-slate-600 mt-1">
            {notification.message}
          </p>

          <div className="text-xs text-slate-400 mt-2">
            {formatDate(notification.createdAt)}
          </div>
        </div>

        <div className="flex gap-2">
          {!notification.isRead && (
            <button
              onClick={() => markAsRead(notification.id)}
              className=" cursor-pointer rounded-xl border px-3 py-2 text-xs"
            >
              Read
            </button>
          )}

          <button
            onClick={() => deleteNotification(notification.id)}
            className="rounded-xl border border-red-200 px-3 py-2 text-xs text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ));
};





  return (
    <div className="flex h-screen bg-[#f6f8fc] overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Sidebar userData={userData || { company: "Workspace", profileImageUrl: "" }} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
              <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
                Communication
              </span>
                  
            </div>
            <p className="text-sm text-slate-500 mt-1">{headerSubtitle}</p>
          </div>
          
        <TopNav />
        </header>



      

      {/* Tabs */}
        <div className="bg-white border-b border-slate-200 px-8 sticky top-20 z-10 ">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer px-5 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/*Overview Tab*/}
        <main className="flex-1 overflow-y-auto p-8 ">
          {activeTab === "Overview" && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <KpiCard title="Unread Notifications" value={dashboard?.unreadNotifications ?? 0} footer={`${dashboard?.unreadNotifications ?? 0} pending`} />
                <KpiCard title="Proposal Events" value={dashboard?.proposalEventsToday ?? 0} footer="Events today" />
                <KpiCard title="Invoice Events" value={dashboard?.invoiceEventsToday ?? 0} footer="Events today" />
                <KpiCard title="Automations Run" value={dashboard?.automationsRunToday ?? 0} footer="Today" />
              </div>
              

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SectionCard title="Recent Notifications">
                        {loadingNotifications ? (
                          <div className="text-sm text-slate-500">
                            Loading notifications...
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="text-sm text-slate-500">
                            No notifications available.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {notifications.slice(0, 5).map((item) => (
                              <div
                                key={item.id}
                                className="border-b border-slate-100 pb-3"
                              >
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-slate-900">
                                    {item.title}
                                  </h4>

                                  {!item.isRead && (
                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                  )}
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                  {item.message}
                                </p>

                                <div className="mt-2 text-xs text-slate-400">
                                  {formatDate(item.createdAt)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </SectionCard>

                <SectionCard title="Notification Activity Chart" >
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dashboard?.activityChart ?? []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="count"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                  </div>
                </SectionCard>
              </div>
            </section>
          )}

          {activeTab === "Inbox" && (
            <section className="space-y-6">
              <SectionCard title="Inbox">
                <div className="space-y-5">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold">
        Notifications
      </h3>

      <p className="text-sm text-slate-500">
        All activity across proposals,
        invoices, CRM and automations.
      </p>
    </div>

    <button
      onClick={markAllRead}
      className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 cursor-pointer"
    >
      Mark All Read
    </button>
  </div>

  {loading ? (
    <div className="text-center py-10">Loading notifications...</div>
  ) : notifications.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
      <h4 className="font-medium text-slate-700">No notifications</h4>
      <p className="text-sm text-slate-500 mt-2">New activity will appear here.</p>
    </div>
  ) : (
    inboxNotifications.map((notification) => (
      <div
        key={notification.id}
        className={`cursor-pointer rounded-2xl border p-5 transition-all ${
          !notification.isRead
            ? "border-blue-200 bg-blue-50/40"
            : "border-slate-200 bg-white"
        }`}
        onClick={() => markAsRead(notification.id)}
      >
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedNotificationIds.has(notification.id)}
                  onChange={() =>
                    setSelectedNotificationIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(notification.id)) next.delete(notification.id);
                      else next.add(notification.id);
                      return next;
                    })
                  }
                />
                <span className="sr-only">Select notification</span>
              </label>

              {!notification.isRead && (
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              )}

              <h4 className="font-semibold text-slate-900">{notification.title}</h4>

              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryBadge(
                  notification.category
                )}`}
              >
                {notification.categoryName}
              </span>
            </div>

            <p className="text-sm text-slate-600">{notification.message}</p>

            <div className="mt-3 text-xs text-slate-400">
              {formatDate(notification.createdAt)}
            </div>
          </div>

          <div className="flex gap-2">
            {!notification.isRead ? (
              <button
                type="button"
                onClick={() => markAsRead(notification.id)}
                className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
                aria-label="Mark as read"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => deleteNotification(notification.id)}
              className="rounded-xl border border-red-200 p-2 text-red-600 hover:bg-red-50 cursor-pointer"
              aria-label="Delete notification"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    ))
  )}
</div>
              </SectionCard>
            </section>
          )}

          {activeTab === "Proposals" && (
            <section className="space-y-6">
              <SectionCard title="Proposal Activity">
                {renderNotificationList()}
              </SectionCard>
            </section>
          )}

          {activeTab === "Invoices" && (
            <section className="space-y-6">
              <SectionCard title="Invoice Activity">
                {renderNotificationList()}
              </SectionCard>
            </section>
          )}

          {activeTab === "CRM" && (
            <section className="space-y-6">
              <SectionCard title="CRM Activity">
                {renderNotificationList()}
              </SectionCard>
            </section>
          )}

          {activeTab === "Automations" && (
            <section className="space-y-6">
              <SectionCard title="Automation Activity">
                {renderNotificationList()}
              </SectionCard>

              <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-semibold">Automation confidence</h3>
                <p className="text-sm text-slate-200 mt-2">
                  This tab shows events generated automatically by your CRM automation workflows.
                </p>
              </div>
            </section>
          )}

          {activeTab === "Settings" && (
            <section className="space-y-6">
              <SectionCard
                title="Notification Settings"
                right={<Badge tone="emerald">Email · In-App · SMS</Badge>}
              >
                <div className="space-y-4">
                  {preferenceRows.map((row) => (
                    <NotificationPreferenceRow
                      key={row.key}
                      title={row.title}
                      description={row.description}
                      smsOptional={row.smsOptional}
                      value={preferences[row.key]}
                      onChange={(next) => setSettings((p) => ({ ...p, [row.key]: next }))}
                    />
                  ))}

                  <div className="flex items-center justify-between gap-4 pt-3">
                    <p className="text-sm text-slate-600">
                      Settings are shown for the most important events. Store these settings in the database (replace demo state).
                    </p>
                    <button
                      className="cursor-pointer h-11 px-6 rounded-2xl bg-slate-900 text-white hover:bg-black transition font-semibold"
                      onClick={saveSettings}
                                            //onClick={() => {console.log(notificationSettings);alert("Settings Saved");}}
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </SectionCard>

             <SectionCard title="Notification Channels">
  <div className="space-y-4">

    <ToggleRow
      label="Email Notifications"
      value={notificationSettings.emailEnabled}
      onChange={(value) =>
        setNotificationSettings((prev) => ({
          ...prev,
          emailEnabled: value,
        }))
      }
    />

    <ToggleRow
      label="In-App Notifications"
      value={notificationSettings.inAppEnabled}
      onChange={(value) =>
        setNotificationSettings((prev) => ({
          ...prev,
          inAppEnabled: value,
        }))
      }
    />

    <ToggleRow
      label="SMS Notifications"
      value={notificationSettings.smsEnabled}
      onChange={(value) =>
        setNotificationSettings((prev) => ({
          ...prev,
          smsEnabled: value,
        }))
      }
    />
  </div>
</SectionCard>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

