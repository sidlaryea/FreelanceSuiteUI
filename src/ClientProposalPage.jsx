import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClientLayout from "./ClientLayout";
import { getPublicProposal } from "./api/proposalApi";
import DOMPurify from "dompurify";
import ProposalCoverPage from "./components/CoverPage";



export default function ClientProposalPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const normalizePricing = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map((x) => ({
      name: x.name || x.title,
      description:x.description,
      qty: x.qty || x.quantity,
      price: x.price || x.unitPrice,
    }));
  };

  if (loading) {
    return <Skeleton />;
  }

  if (!proposal) {
    return <div className="p-10 text-red-500">Proposal not found</div>;
  }

  const pricing = normalizePricing(proposal.pricingItems);

  const total = pricing.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  return (
    <ClientLayout proposal={proposal}>
      <div className="space-y-8">

        {/* 🔷 DEAL SUMMARY HEADER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-2xl font-bold">Project Agreement</h1>
              <p className="text-sm text-slate-500 mt-1">
                Signed on {new Date(proposal.signedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">Total Value</p>
                <p className="text-xl font-semibold">${total.toLocaleString()}</p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                Accepted
              </span>
            </div>
          </div>
        </div>

        {/* 🔷 MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 🔷 LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            <ProposalCoverPage
              userData={proposal?.organization}
              client={proposal?.client}
            />

            <SectionCard title="Executive Summary" highlight>
              <HTML html={proposal.executiveSummary} />
            </SectionCard>

            <SectionCard title="Introduction" highlight>
              <HTML html={proposal.contentHtml} />
            </SectionCard>

            

            <SectionCard title="Scope of Work">
              <HTML html={proposal.scopeOfWork} />
            </SectionCard>

            <SectionCard title="Timeline">
              <HTML html={proposal.timeline} />
            </SectionCard>

            {/* 🔷 PRICING */}
            <SectionCard title="Pricing">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.map((item, i) => (
                    <tr
                      key={i}
                      className="border-t hover:bg-slate-50 transition"
                    >
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-right">{item.qty}</td>
                      <td className="p-3 text-right">
                        ${item.price.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-medium">
                        ${(item.qty * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-4">
                <div className="bg-slate-100 px-5 py-3 rounded-lg text-right">
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-xl font-bold">
                    ${total.toLocaleString()}
                  </p>
                </div>
              </div>
            </SectionCard>


                  <SectionCard title="Terms And Condition" highlight>
              <HTML html={proposal.termsSectionHtml} />
            </SectionCard>

            <SectionCard title="Acceptance" highlight>
              <HTML html={proposal.signatureSectionHtml} />
            </SectionCard>


          </div>

          {/* 🔷 RIGHT PANEL (STICKY ACTION PANEL) */}
          <div className="space-y-4">

            <div className="sticky top-6 space-y-4">

              {/* STATUS CARD */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-slate-800">
                  Project Status
                </h3>

<p className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-2">
                  <img
                    src={`${import.meta.env.BASE_URL}logos/accepted.png`}
                    alt="Accepted"
                    className="h-5 w-5"
                  />
                  Proposal Accepted
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  You're ready to begin. Complete payment to start the project.
                </p>

                <button
                  onClick={() => navigate(`/client/payment/${token}`)}
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 transition text-white py-2.5 rounded-lg font-medium cursor-pointer "
                >
                  Proceed to Payment
                </button>
              </div>

              {/* SUPPORT CARD */}
              <div className="bg-slate-900 text-white rounded-2xl p-5">
                <h3 className="font-semibold">Need help?</h3>
                <p className="text-sm text-white/70 mt-2">
                  Contact us if you have any questions about this proposal.
                </p>

                <button className="mt-4 w-full bg-white text-slate-900 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-slate-100 transition">
                  Message Support
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

function SectionCard({ title, children, highlight }) {
  return (
    <div
      className={`rounded-2xl p-6 border shadow-sm ${
        highlight
          ? "bg-gradient-to-br from-slate-50 to-white border-slate-200"
          : "bg-white border-slate-200"
      }`}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function HTML({ html }) {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html),
      }}
    />
  );
}

function Skeleton() {
  return (
    <div className="p-10 animate-pulse space-y-4">
      <div className="h-6 bg-slate-300 rounded w-1/3"></div>
      <div className="h-40 bg-slate-300 rounded"></div>
      <div className="h-40 bg-slate-300 rounded"></div>
    </div>
  );
}