export default function ExecutiveSummary({ executiveSummary, setExecutiveSummary, regenerateSummary }) {
<div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
  <label className="block text-lg font-semibold text-slate-800 mb-3">
    Executive Summary
  </label>

  <textarea
    value={executiveSummary}
    onChange={(e) => setExecutiveSummary(e.target.value)}
    className="w-full min-h-[120px] rounded-lg border border-slate-200 p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Write a compelling summary of your proposal..."
  />

  <div className="flex justify-end mt-3">
    <button
      onClick={regenerateSummary}
      className="text-sm text-blue-600 hover:underline"
    >
      ✨ Regenerate with AI
    </button>
  </div>
</div>
}
