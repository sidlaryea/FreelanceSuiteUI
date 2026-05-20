export default function SignatureSection({ signature, setSignature, resetSignature }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
  <label className="block text-lg font-semibold text-slate-800 mb-3">
    Signature Section
  </label>

  <textarea
    value={signature}
    onChange={(e) => setSignature(e.target.value)}
    className="w-full min-h-[140px] rounded-lg border border-slate-200 p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <div className="flex justify-end mt-3">
    <button
      onClick={resetSignature}
      className="text-sm text-slate-500 hover:underline"
    >
      Reset to Default
    </button>
  </div>
</div>
  );
}
