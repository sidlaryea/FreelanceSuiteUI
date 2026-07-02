import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "../../Context/NotificationContext";

export default function TopNav() {
  const {
    notifications,
    unreadNotifications,
    markAllRead,
    markAsRead,
  } = useNotifications();

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-slate-100 px-7 flex items-center justify-between flex-shrink-0 gap-5">
      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 w-72">
        <Search size={16} className="text-slate-400" />

        <input
          placeholder="Search..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 cursor-pointer"
          >
            <Bell size={18} />

            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center px-1">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
          S
        </div>

        {/* Show Notifications */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-[420px] bg-white border border-slate-200 rounded-3xl shadow-2xl z-50" style={{ top: "100%" }}>

            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>

              <button
                type="button"
                onClick={markAllRead}
                className="text-sm text-blue-600 cursor-pointer"
              >
                Mark All Read
              </button>
            </div>

            <div className="max-h-[450px] overflow-y-auto">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`cursor-pointer p-4 border-b border-slate-100 flex items-start gap-3 transition ${
                            !item.isRead
                              ? "bg-blue-50/40 hover:bg-blue-50"
                              : "bg-white hover:bg-slate-50"
                          }`}
                >
                  <div className="mt-1">
                          {!item.isRead ? (
                            <span className="block w-2 h-2 rounded-full bg-blue-600" />
                          ) : (
                            <span className="block w-2 h-2 rounded-full bg-slate-300" />
                          )}
                        </div>
                  <div>
                    <div
                        className={`${
                          !item.isRead
                            ? "font-semibold text-slate-900"
                            : "font-medium text-slate-700"
                        }`}
                      >
                        {item.title}
                      </div>
                    <div className="text-sm text-slate-500">{item.message}</div>
                    <div className="text-xs text-slate-400 mt-1">
  {new Date(item.createdAt).toLocaleString()}
</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <Link
                to="/Notifications"
                className="block text-center text-blue-600 font-medium"
              >
                View All Notifications →
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

