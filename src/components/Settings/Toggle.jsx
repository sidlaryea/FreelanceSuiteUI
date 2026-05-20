export default function Toggle({
  value,
  onChange,
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
        value ? "bg-slate-900" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
          value ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}