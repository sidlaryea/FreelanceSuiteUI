import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPublicProposal,
  acceptPublicProposal,
  rejectPublicProposal,
} from "./api/proposalApi";
import ProposalCoverPage from "./components/CoverPage";
import SignatureSection from "./components/Signature";

export default function PublicProposalPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  useEffect(() => {
    loadProposal();
  }, [token]);


 

  const loadProposal = async () => {
    try {
      setLoading(true);
      const data = await getPublicProposal(token);


      setProposal(data);

      // ✅ sync status from backend
      if (data.status === "Accepted" || data.status === 2 || data.status === "2") {
        setStatus("Accepted");
      } else if (data.status === "Rejected" || data.status === 3 || data.status === "3") {
        setStatus("Rejected");
      } else {
        setStatus(null);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load proposal");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (actionLoading) return;

    setActionLoading(true);
    setError(null);

    try {
      if (action === "accept") {
        await acceptPublicProposal(token);
      } else {
        await rejectPublicProposal(token);
      }

      const newStatus = action === "accept" ? "Accepted" : "Rejected";
      setStatus(newStatus);

      //navigate to client dashboard after short delay
      setTimeout(() => {
        navigate(`./client/proposal/${token}`);
      }, 2000);

      // Refresh proposal state from server
      await loadProposal();
    } catch (err) {
      console.error(err);
      setError("Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const normalizePricing = (items) => {
    if (!Array.isArray(items)) return [];

    return items.map((x) => ({
      name: x.name || x.title || x.Name,
      description: x.description || x.Description,
      qty: Number(x.qty || x.quantity || 1),
      price: Number(x.price || x.unitPrice || x.Price),
    }));
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading proposal...</p>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error || "Proposal not found"}
      </div>
    );
  }

  const safePricing = normalizePricing(proposal.pricingItems);
  const total = safePricing.reduce((sum, i) => sum + i.qty * i.price, 0);

  const effectiveStatus = status || proposal.status;
  const isAccepted = ["Accepted", 2, "2"].includes(effectiveStatus);
  const isRejected = ["Rejected", 3, "3"].includes(effectiveStatus);
  const isFinalized = isAccepted || isRejected;

 const handleSignatureComplete = async (data) => {
  try {
    setActionLoading(true);

    const response = await acceptPublicProposal(token, {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      signature: data.signature,
    });

    setStatus("Accepted");
    setShowSignatureModal(false);

    //If payment link exists -> redirect
    if (response?.AuthorizationUrl) {
      window.location.href = response.AuthorizationUrl;
      return;
    }
    console.log(response);
    navigate(`/client/proposal/${token}`);


  } catch (err) {
    console.error(err);
    setError("Accept failed");
  } finally {
    setActionLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border">

        <div className="p-8 space-y-10">

          {/* COVER */}
          <ProposalCoverPage
            userData={proposal?.organization}
            client={proposal?.client}
          />

          <Section title="Executive Summary">
            <HTML html={proposal.executiveSummary} />
          </Section>

          <Section title="Project Proposal">
            <HTML html={proposal.contentHtml} />
          </Section>

          <Section title="Scope of Work">
            <HTML html={proposal.scopeOfWork} />
          </Section>

          <Section title="Timeline">
            <HTML html={proposal.timeline} />
          </Section>

          {/* PRICING */}
          {safePricing.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Pricing</h2>

              <table className="w-full border rounded-lg overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {safePricing.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-right">{item.qty}</td>
                      <td className="p-3 text-right">{item.price}</td>
                      <td className="p-3 text-right">
                        {proposal.currency}{item.qty * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-right mt-4 text-xl font-bold">
                Total: {proposal.currency}{total.toLocaleString('en-US', {minimumFractionDigits: 2,maximumFractionDigits: 2})}
              </div>
            </div>
          )}

          <Section title="Terms & Conditions">
            <HTML html={proposal.termsSectionHtml} />
          </Section>

          <section title="Acceptance">   
            <HTML html={proposal.signatureSectionHtml} />
          </section>

          {/* ERROR */}
          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* ACTIONS */}
          <div className="border-t pt-8 flex justify-end gap-4">

            {!isFinalized ? (
              <>
                <button
                  disabled={actionLoading}
                  onClick={() => handleAction("reject")}
                  className="px-6 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 cursor-pointer"
                >
                  Reject
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => setShowSignatureModal(true)}
                  className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
                >
                  Accept Proposal
                </button>
              </>
            ) : (
              <div className="text-center w-full">
                {isAccepted && (
                  <a
                    href={`/client/proposal/${token}`}
                    className="text-emerald-600 font-semibold hover:underline cursor-pointer block"
                  >
                     Proposal Accepted - Click here to view your dashboard!
                  </a>
                )}
                {isRejected && (
                  <p className="text-red-600 font-semibold">
                    ❌ Proposal Rejected
                  </p>
                )}
              </div>
            )}

            

            {showSignatureModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6">

      <SignatureSection
        onComplete={handleSignatureComplete}
        disabled={actionLoading}
        secondaryAction={
          <button
            onClick={() => setShowSignatureModal(false)}
            className="text-sm text-slate-500 cursor-pointer disabled:opacity-50 "
          >
            Cancel
          </button>
        }
      />

    </div>
  </div>
)}


          </div>
        </div>
      </div>
    </div>
  );




}

/* helpers */

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function HTML({ html }) {
  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
