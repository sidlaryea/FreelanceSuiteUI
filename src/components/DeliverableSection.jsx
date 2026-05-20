import { useMemo } from "react";

export default function DeliverableSection({ deliverablesHtml }) {
  const deliverables = useMemo(() => {
    if (!deliverablesHtml) return [];

    const temp = document.createElement('div');
    temp.innerHTML = deliverablesHtml;
    return Array.from(temp.querySelectorAll('li')).map(li => li.textContent.trim());
  }, [deliverablesHtml]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
        Key Deliverables
        {deliverables.length > 0 && (
          <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
            {deliverables.length} deliverables
          </span>
        )}
      </h2>

      {deliverablesHtml ? (
        <>
          {/* Full HTML Preview */}
          <div className="prose prose-sm max-w-none mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div dangerouslySetInnerHTML={{ __html: deliverablesHtml }} />
          </div>

          {/* Deliverable Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliverables.map((deliverable, index) => (
              <div 
                key={index} 
                className="group p-5 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-emerald-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-base leading-tight group-hover:text-emerald-700">
                      {deliverable}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-slate-500 mb-2 font-medium">No deliverables listed</p>
          <p className="text-sm text-slate-400">Add specific outcomes and features the client will receive</p>
        </div>
      )}
    </div>
  );
}
