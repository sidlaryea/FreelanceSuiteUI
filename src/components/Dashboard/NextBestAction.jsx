import { Lightbulb, ArrowRight } from "lucide-react";

const NextBestAction = ({ message, impact, onAction }) => {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-2 rounded-xl">
            <Lightbulb size={22} />
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              ⚡ Your Next Best Action
            </h3>

            <p className="text-sm opacity-90 mt-1">
              {message}
            </p>

            {impact && (
              <p className="text-xs mt-2 bg-white/20 inline-block px-3 py-1 rounded-full">
                {impact}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-white text-indigo-600 font-medium px-4 py-2 rounded-xl hover:scale-105 transition"
        >
          Improve Now
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default NextBestAction;