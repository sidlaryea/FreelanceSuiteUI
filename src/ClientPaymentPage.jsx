import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClientLayout from "./ClientLayout";
import { getPublicProposal } from "./api/proposalApi";

export default function ClientPaymentPage() {
  const { token } = useParams();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("paystack");

  useEffect(() => {
    loadProposal();
  }, [token]);

  const loadProposal = async () => {
    try {
      const data = await getPublicProposal(token);
      setProposal(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!proposal) return <div className="p-10">Not found</div>;

  const total = proposal.pricingItems?.reduce(
    (sum, i) => sum + (i.qty || i.quantity) * (i.price || i.unitPrice),
    0
  );

  return (
    <ClientLayout proposal={proposal}>
      <div className="space-y-8">

        {/* 🔷 HEADER */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Complete Payment</h1>
          <p className="text-slate-500 mt-1">
            Secure your project and get started immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 🔷 LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* PAYMENT SUMMARY */}
            <Card title="Payment Summary">
              <div className="space-y-3">
                {proposal.pricingItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm"
                  >
                    <span>{item.name || item.title}</span>
                    <span>
                      $
                      {(
                        (item.qty || item.quantity) *
                        (item.price || item.unitPrice)
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </Card>

            {/* PAYMENT METHOD */}
            <Card title="Payment Method">
              <div className="space-y-3">

                <PaymentOption
                  label="Paystack (Card / Mobile Money)"
                  selected={method === "paystack"}
                  onClick={() => setMethod("paystack")}
                />

                <PaymentOption
                  label="Bank Transfer"
                  selected={method === "bank"}
                  onClick={() => setMethod("bank")}
                />

              </div>
            </Card>

            {/* PAY BUTTON */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-lg font-medium transition">
                Pay ${total.toLocaleString()}
              </button>

              <p className="text-xs text-slate-500 text-center mt-3">
                Secure payment powered by Paystack
              </p>
            </div>

          </div>

          {/* 🔷 RIGHT PANEL */}
          <div className="space-y-4">

            <div className="sticky top-6 space-y-4">

              {/* PROJECT CARD */}
              <div className="bg-white border rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold">Project</h3>

                <p className="mt-2 text-sm text-slate-700">
                  {proposal.title || "Project Agreement"}
                </p>

                <div className="mt-3 text-sm text-slate-500">
                  Status: Ready to Start
                </div>
              </div>

              {/* TRUST CARD */}
              <div className="bg-slate-900 text-white rounded-2xl p-5">
                <h3 className="font-semibold">Secure Payment</h3>

                <p className="text-sm text-white/70 mt-2">
                  Your payment is encrypted and processed securely.
                </p>

                <ul className="mt-3 text-xs space-y-1 text-white/60">
                  <li>✔ SSL Encrypted</li>
                  <li>✔ Trusted Payment Provider</li>
                  <li>✔ Instant Confirmation</li>
                </ul>
              </div>

              {/* SUPPORT */}
              <div className="bg-white border rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold">Need help?</h3>

                <p className="text-sm text-slate-500 mt-2">
                  Contact us if you have any issues with payment.
                </p>

                <button className="mt-3 w-full bg-slate-900 text-white py-2 rounded-lg">
                  Contact Support
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

/* ---------- COMPONENTS ---------- */

function Card({ title, children }) {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">{title}</h2>
      {children}
    </div>
  );
}

function PaymentOption({ label, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-xl cursor-pointer transition flex justify-between items-center
        ${
          selected
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-200 hover:bg-slate-50"
        }`}
    >
      <span className="text-sm">{label}</span>

      <div
        className={`w-4 h-4 rounded-full border-2
          ${selected ? "border-emerald-600 bg-emerald-600" : "border-slate-400"}
        `}
      />
    </div>
  );
}