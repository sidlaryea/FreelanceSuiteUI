export default function SectionCard({
  title,
  description,
  children,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-[15px] font-semibold text-slate-900">
          {title}
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}