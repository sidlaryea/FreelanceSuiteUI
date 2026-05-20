import { useMemo } from "react";

export default function ProposalScopeSection({ scopeHtml }) {
  const deliverables = useMemo(() => {
    if (!scopeHtml) return [];

    const temp = document.createElement('div');
    temp.innerHTML = scopeHtml;
    return Array.from(temp.querySelectorAll('li')).map(li => li.textContent.trim());
  }, [scopeHtml]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
        Scope of Works
        {scopeHtml ? (
          <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
            {deliverables.length} items
          </span>
        ) : null}
      </h2>

      {scopeHtml ? (
        <>
          {/* Full HTML Preview */}
          <div className="prose prose-sm max-w-none mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div dangerouslySetInnerHTML={{ __html: scopeHtml }} />
          </div>

          {/* Extracted List */}
          {deliverables.length > 0 && (
            <div>
              <p className="text-sm text-slate-500 mb-3 font-medium">Key Deliverables:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {deliverables.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition">
                    <p className="text-sm text-slate-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <p className="text-slate-500 mb-2">No scope of work defined yet</p>
          <p className="text-sm text-slate-400">Add project scope, deliverables, and timeline details here</p>
        </div>
      )}
    </div>
  );
}
