import { useMemo } from "react";
import { X } from "lucide-react";

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  onChange,
  clients,
  industries,
  currencies,
  budgetCurrency,
  budgetAmount,
  onBudgetCurrencyChange,
  onBudgetAmountChange,
  error,
}) {
  const canSubmit = useMemo(() => {
    return (
      form.projectTitle?.trim().length > 0 &&
      form.projectType?.trim().length > 0 &&
      form.clientId?.trim().length > 0 &&
      form.projectDescription?.trim().length > 0 &&
      form.industryId?.trim().length > 0 &&
      form.budgetRange?.trim().length > 0 &&
      form.timeline?.trim().length > 0 &&
      form.businessGoal?.trim().length > 0 &&
      form.coreProblem?.trim().length > 0 &&
      form.targetAudience?.trim().length > 0 &&
      form.keyFeaturesSummary?.trim().length > 0
    );
  }, [form]);

  if (!isOpen) return null;

  return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    aria-modal="true"
    role="dialog"
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
      onClick={onClose}
    />

    {/* Modal */}
    <div className="relative w-[96%] max-w-7xl h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            

            <h2 className="mt-3 text-3xl font-bold">
              Create New Project
            </h2>

            <p className="mt-2 text-slate-300">
              Build a new project overview and keep your proposals organized.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className=" cursor-pointer h-11 w-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Form Body */}
      <form
        onSubmit={onSubmit}
        className="flex-1 overflow-y-auto"
      >
        <div className="p-8 space-y-8">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {/* Project Basics */}
          <section className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Project Basics
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Project Title
                </label>

                <input
                  type="text"
                  name="projectTitle"
                  value={form.projectTitle || ""}
                  onChange={onChange}
                  placeholder="Enter project title"
                  className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Project Type
                </label>

                <select
                  name="projectType"
                  value={form.projectType || ""}
                  onChange={onChange}
                  className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select Project Type</option>
                  <option value="web_app">Web Application</option>
                  <option value="mobile_app">Mobile App</option>
                  <option value="website">Website</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="saas">SaaS Platform</option>
                  <option value="api">API/Backend</option>
                  <option value="automation">Automation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Client
                </label>

                <select
                  name="clientId"
                  value={form.clientId || ""}
                  onChange={onChange}
                  className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select Client</option>

                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name || client.clientName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Industry
                </label>

                <select
                  name="industryId"
                  value={form.industryId || ""}
                  onChange={onChange}
                  className="mt-2 w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select Industry</option>

                  {industries.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Project Details */}
          <section className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Project Details
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Project Description
                </label>

                <textarea
                  name="projectDescription"
                  rows={5}
                  value={form.projectDescription || ""}
                  onChange={onChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Core Problem
                </label>

                <textarea
                  name="coreProblem"
                  rows={4}
                  value={form.coreProblem || ""}
                  onChange={onChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Business Information */}
          <section className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Business Information
            </h3>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Target Audience
                </label>

                <textarea
                  name="targetAudience"
                  rows={5}
                  value={form.targetAudience || ""}
                  onChange={onChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Business Goal
                </label>

                <textarea
                  name="businessGoal"
                  rows={5}
                  value={form.businessGoal || ""}
                  onChange={onChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Key Features
            </h3>

            <textarea
              name="keyFeaturesSummary"
              rows={5}
              value={form.keyFeaturesSummary || ""}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </section>

          {/* Budget + Timeline */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Budget
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <select
                    value={budgetCurrency}
                    onChange={onBudgetCurrencyChange}
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4"
                  >
                    <option value="">Currency</option>

                    {currencies.map((currency) => (
                      <option
                        key={currency.id}
                        value={currency.symbol}
                      >
                        {currency.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <input
                    type="text"
                    value={budgetAmount}
                    onChange={onBudgetAmountChange}
                    placeholder="50,000 - 100,000"
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Timeline
              </h3>

              <select
                name="timeline"
                value={form.timeline || ""}
                onChange={onChange}
                className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4"
              >
                <option value="">Select Timeline</option>
                <option value="mvp_2_4_weeks">
                  MVP (2-4 Weeks)
                </option>
                <option value="standard_1_2_months">
                  Standard (1-2 Months)
                </option>
                <option value="complex_3_6_months">
                  Complex (3-6 Months)
                </option>
                <option value="ongoing">
                  Ongoing
                </option>
              </select>
            </div>
          </section>
        </div>
      </form>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white px-8 py-5">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className=" cursor-pointer h-12 px-6 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="cursor-pointer  h-12 px-8 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
