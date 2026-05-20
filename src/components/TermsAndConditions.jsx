export default function TermsAndConditions({ terms, setTerms, resetTerms }) {

<div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
  <label className="block text-lg font-semibold text-slate-800 mb-3">
    Terms & Conditions
  </label>

  <textarea
    value={terms}
    onChange={(e) => setTerms(e.target.value)}
    className="w-full min-h-[160px] rounded-lg border border-slate-200 p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Define your project terms..."
  />

  <div className="flex justify-end mt-3">
    <button
      onClick={resetTerms}
      className="text-sm text-slate-500 hover:underline"
    >
      Reset to Default
    </button>
  </div>
</div>
}