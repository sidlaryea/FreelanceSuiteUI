import { useEffect, useState } from "react";

export default function Toast({ toast, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // kick off enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  if (!toast) return null;

  const { message, tone = "success", id } = toast;

  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
      : tone === "error"
      ? "bg-red-50 border-red-200 text-red-900"
      : "bg-slate-50 border-slate-200 text-slate-900";

  return (
    <div
      role="status"
      aria-live="polite"
      key={id}
      className={
        "fixed top-6 right-6 z-50 max-w-[360px] transition-all duration-200 " +
        (visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2")
      }
    >
      <div
        className={
          "rounded-2xl border px-4 py-3 shadow-sm backdrop-blur bg-white " +
          toneClasses
        }
      >
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm font-semibold leading-5">{message}</div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold border border-transparent hover:border-slate-200 hover:bg-white/70"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

