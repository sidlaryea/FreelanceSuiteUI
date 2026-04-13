const InsightCard = ({ title, description, impact, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
    >
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">
        {description}
      </p>

      {impact && (
        <div className="mt-3 text-xs text-indigo-600 font-medium">
          Potential Impact: {impact}
        </div>
      )}
    </div>
  );
};

export default InsightCard;