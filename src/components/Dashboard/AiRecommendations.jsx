import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function AiRecommendations({ insights }) {
  if (!insights) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={18} className="text-indigo-600" />
        <h2 className="text-sm font-semibold text-slate-800">
          AI Recommendations
        </h2>
      </div>

      <div className="space-y-4">

        <div className="flex gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-100">
          <TrendingUp
            size={18}
            className="text-emerald-600 mt-0.5"
          />

          <div>
            <p className="text-xs text-emerald-700 font-medium uppercase">
              Strongest Area
            </p>

            <p className="text-sm font-semibold text-slate-800 mt-1">
              {insights.strongestFactor}
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100">
          <AlertTriangle
            size={18}
            className="text-amber-600 mt-0.5"
          />

          <div>
            <p className="text-xs text-amber-700 font-medium uppercase">
              Improve Next
            </p>

            <p className="text-sm font-semibold text-slate-800 mt-1">
              {insights.weakestFactor}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
            Recommended Actions
          </p>

          <div className="space-y-3">
            {insights.recommendations?.map((rec, index) => (
              <div
                key={index}
                className="
                  flex
                  items-start
                  gap-3
                  p-3
                  rounded-lg
                  border
                  border-slate-100
                  hover:border-indigo-200
                  transition
                "
              >
                <ArrowRight
                  size={15}
                  className="text-indigo-500 mt-1"
                />

                <p className="text-sm text-slate-700">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}