import { useMemo } from "react";

export default function TimelineSection({ timelineHtml }) {
  const timelineItems = useMemo(() => {
    if (!timelineHtml) return [];

    const temp = document.createElement('div');
    temp.innerHTML = timelineHtml;
    return Array.from(temp.querySelectorAll('li')).map(li => ({
      title: li.textContent.trim(),
      duration: li.textContent.match(/(- \d+(?:\.\d+)? (?:week|month|day)s?)/)?.[0] || ''
    }));
  }, [timelineHtml]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
        Project Timeline
        {timelineItems.length > 0 && (
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {timelineItems.length} phases
          </span>
        )}
      </h2>

      {timelineHtml ? (
        <>
          {/* Full HTML Preview */}
          <div className="prose prose-sm max-w-none mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div dangerouslySetInnerHTML={{ __html: timelineHtml }} />
          </div>

          {/* Timeline Cards */}
          {timelineItems.length > 0 && (
            <div className="space-y-3">
              {timelineItems.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 hover:shadow-md transition-all">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center text-sm mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 mb-1 leading-tight">{item.title.replace(item.duration, '')}</h4>
                    {item.duration && (
                      <p className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                        {item.duration}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-500 mb-2 font-medium">No timeline defined</p>
          <p className="text-sm text-slate-400">Add project phases and estimated durations</p>
        </div>
      )}
    </div>
  );
}
