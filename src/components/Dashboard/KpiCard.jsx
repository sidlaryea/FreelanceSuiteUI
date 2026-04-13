const KpiCard = ({ title, value, icon, trend, progress }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>

          {trend && (
            <p className="text-xs text-green-600 mt-1">{trend}</p>
          )}
        </div>

        <div className="bg-indigo-50 p-3 rounded-xl">
          {icon}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default KpiCard;