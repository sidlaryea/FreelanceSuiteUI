export default function PricingSummary({ pricingJson }) {
  if (!pricingJson) return null;

  let items = [];

  try {
    items = JSON.parse(pricingJson);
  } catch {
    return null;
  }

  const total = items.reduce((sum, item) => sum + (item.Price || 0) * (item.Qty || 0), 0);

  return (
    <div className="mt-10 border border-slate-200 rounded-xl p-6 bg-slate-50">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Pricing Summary
      </h2>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm text-slate-700">
            <span>{item.Name}</span>
            <span>${item.Price * item.Qty}</span>
          </div>
        ))}
      </div>

      <div className="border-t mt-4 pt-4 flex justify-between font-semibold text-slate-900">
        <span>Total</span>
        <span>${total}</span>
      </div>
    </div>
  );
}