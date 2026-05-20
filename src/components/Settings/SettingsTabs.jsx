import { settingsTabs } from "./../../constants/settingsTabs";

export default function SettingsTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur mb-8 border-b border-slate-200 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max pb-4">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} />
                {tab.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}