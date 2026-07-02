import { Trash2 } from "lucide-react";

import { CheckboxIcon } from "./LucideButtons";

export default function NotificationInboxRow({
  notification,
  selected,
  onToggleSelected,
  onMarkAsRead,
  onDelete,
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        !notification.isRead
          ? "border-blue-200 bg-blue-50/40"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            type="button"
            onClick={() => onToggleSelected(notification.id)}
            className="mt-1.5"
            aria-label={selected ? "Deselect notification" : "Select notification"}
          >
            <CheckboxIcon checked={selected} />
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {!notification.isRead && (
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              )}

              <h4 className="font-semibold text-slate-900">
                {notification.title}
              </h4>

              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${""}`}
              >
                {/** badge is rendered by parent to reuse getCategoryBadge */}
              </span>
            </div>

            <p className="text-sm text-slate-600">{notification.message}</p>

            <div className="mt-3 text-xs text-slate-400">
              {/** parent overwrites via CSS? keep simple */}
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-start">
          {!notification.isRead ? (
            <button
              type="button"
              onClick={() => onMarkAsRead(notification.id)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer flex items-center gap-2"
            >
              <span className="hidden sm:inline">Read</span>
              <span className="inline sm:hidden">✓</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => onDelete(notification.id)}
            className="rounded-xl border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* The remaining parts (badge + date) are injected by the parent via plain markup for layout parity */}
      <div className="-mt-2" />
    </div>
  );
}

