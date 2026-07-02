import { X, Lock, Check, Shield } from "lucide-react";

export default function UpgradeLimitModal({
  open,
  onClose,
  usage = {
    planName: "Free",
    used: 3,
    limit: 3,
  },
}) {
  if (!open) return null;

  const percentage =
    usage.limit > 0
      ? Math.min((usage.used / usage.limit) * 100, 100)
      : 100;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
  <div className="relative w-full max-w-6xl h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-slate-100">
            <button
              onClick={onClose}
              className="cursor-pointer absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <Lock className="w-7 h-7 text-red-500" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  You've Reached Your Monthly Proposal Limit
                </h2>

                <p className="mt-3 text-base sm:text-lg text-slate-600">
                  You've used all{" "}
                  <span className="font-semibold">{usage.limit} proposals</span>{" "}
                  available on the Free plan.
                </p>

                <p className="text-base sm:text-lg text-slate-500 mt-1">
                  Upgrade to continue creating AI-powered proposals and unlock
                  advanced features.
                </p>
              </div>
            </div>
          </div>

          {/* Usage Card */}
          <div className="px-6 py-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <p className="text-slate-500 text-sm">Current Plan</p>
                  <h3 className="text-xl font-bold">
                    {usage.planName} Plan
                  </h3>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Used</p>
                  <h3 className="text-xl font-bold">
                    <span className="text-red-500">
                      {usage.used} / {usage.limit}
                    </span>{" "}
                    Proposals
                  </h3>
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Status</p>

                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 text-red-600 font-semibold text-sm">
                    Limit Reached
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="text-right mt-2 font-semibold">
                {Math.round(percentage)}%
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between mb-5 gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Choose Your Plan
              </h3>

              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Shield size={16} />
                Secure checkout • Cancel anytime
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Free */}
              <PlanCard
                title="Starter"
                price="$0"
                features={[
                  "3 Proposals / month",
                  "AI Proposal Generator",
                  "Proposal Scoring",
                  "Basic Invoicing",
                ]}
                buttonText="Current Plan"
                disabled
              />

              {/* Pro */}
              <PlanCard
                featured
                title="Pro"
                price="$29"
                features={[
                  "Unlimited Proposals",
                  "Proposal Scoring",
                  "Client Portal",
                  "Proposal Analytics",
                  "Advanced Invoicing",
                ]}
                buttonText="Upgrade to Pro"
              />

              {/* Business */}
              <PlanCard
                title="Business"
                price="$79"
                features={[
                  "Everything in Pro",
                  "Team Members",
                  "Custom Branding",
                  "White Label Proposals",
                  "Advanced Reporting",
                ]}
                buttonText="Upgrade to Business"
              />
            </div>

            <div className="mt-6 flex justify-center text-slate-500 text-sm">
              <Shield size={16} className="mr-2" />
              30-day money-back guarantee
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PlanCard({
  title,
  price,
  features,
  buttonText,
  featured = false,
  disabled = false,
}) {
  return (
    <div
      className={`rounded-2xl border bg-white overflow-hidden ${
        featured ? "border-blue-500 shadow-xl scale-[1.02]" : "border-slate-200"
      }`}
    >
      {featured && (
        <div className="bg-blue-600 text-white text-center py-2 font-medium text-sm">
          Most Popular
        </div>
      )}

      <div className="p-5">
        <h3 className="text-xl sm:text-2xl font-bold text-center">{title}</h3>

        <div className="text-center mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-slate-500 text-base">/month</span>
        </div>

        <ul className="mt-5 space-y-3">
          {features.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <Check size={16} className="text-green-600" />
              <span className="text-slate-700 text-sm">{item}</span>
            </li>
          ))}
        </ul>

        <button
          disabled={disabled}
          className={`mt-6 w-full cursor-pointer  rounded-xl py-3 font-semibold text-sm sm:text-base ${
            featured
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : disabled
                ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                : "border border-slate-200 hover:bg-slate-50"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

