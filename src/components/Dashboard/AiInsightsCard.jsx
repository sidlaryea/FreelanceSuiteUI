import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function AiInsightsCard({ insights }) {
  if (!insights) return null;

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Brain size={18} className="text-indigo-600" />
        <h2 className="text-sm font-semibold text-slate-800">
          AI Performance Summary
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-5">
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs text-slate-500 mb-1">
            Average Score
          </p>

          <p className="text-2xl font-bold text-slate-900">
            {insights.averageScore}
          </p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">
              Strongest Area
            </span>
          </div>

          <p className="font-semibold text-slate-800">
            {insights.strongestFactor}
          </p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <span className="text-xs font-medium text-amber-700">
              Needs Attention
            </span>
          </div>

          <p className="font-semibold text-slate-800">
            {insights.weakestFactor}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-700">
            Recommendations
          </h3>
        </div>

        <div className="space-y-3">
          {insights.recommendations?.map((item, index) => (
            <div
              key={index}
              className="border border-slate-100 rounded-lg p-3"
            >
              <p className="text-sm text-slate-700">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}