import { ArrowRight, FileText, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NextActionCard({ action }) {
  const navigate = useNavigate();

  const icon =
    action.type === "Proposal" ? (
      <FileText size={18} className="text-blue-600" />
    ) : (
      <Clock3 size={18} className="text-amber-600" />
    );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        // Some backends may send absolute paths or routes missing the leading slash.
        const target = action?.route?.startsWith("/")
          ? action.route
          : `/${action?.route ?? ""}`;

        if (!target || target === "/") return;
        navigate(target);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const target = action?.route?.startsWith("/")
            ? action.route
            : `/${action?.route ?? ""}`;
          if (!target || target === "/") return;
          navigate(target);
        }
      }}
      className="
        cursor-pointer
        bg-white
        border
        border-slate-200
        rounded-xl
        p-4
        hover:shadow-md
        transition-all
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          {icon}

          <div>
            <p className="text-sm font-medium text-slate-800">
              {action.message}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              {action.type}
            </p>
          </div>
        </div>

        <ArrowRight size={16} className="text-slate-400" />
      </div>
    </div>
  );
}