import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicProposalByPublicId, acceptPublicProposal } from "./api/proposalApi";

export default function ClientSignaturePage() {
  const { publicId } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProposal();
  }, [publicId]);

  const loadProposal = async () => {
    try {
      setLoading(true);
      const data = await getPublicProposalByPublicId(publicId);
      setProposal(data);
    } catch {
      setError("Failed to load proposal. Invalid or expired link.");
    } finally {
      setLoading(false);
    }
  };

  const acceptProposal = async () => {
    
    if (!clientName.trim() || !clientEmail.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    
    try {
      setAccepting(true);
      setError("");
      await acceptPublicProposal(publicId, {
        name: clientName.trim(),
        email: clientEmail.trim(),
      });
      // Refetch to update isAccepted
      await loadProposal();
    } catch {
      setError("Failed to accept proposal. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 font-outfit">
        <div className="text-slate-500">Loading proposal...</div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 font-outfit">
        <div className="bg-white border rounded-xl p-8 shadow-sm max-w-md mx-auto text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Proposal Not Found</h2>
          <p className="text-slate-500 mb-6">{error || "Proposal not available."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 font-outfit">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{proposal.projectRequirement?.projectTitle || "Proposal"}</h1>
        <p className="text-slate-600 mb-12 text-lg">{proposal.organization?.name || "Your Company"}</p>

        
        

        <div className="prose prose-slate max-w-none mb-10" dangerouslySetInnerHTML={{ __html: proposal.contentHtml }} />
        <PricingSummary pricingJson={proposal.pricingTableJson} />
        <h2 className="text-2xl font-semibold mb-2 text-slate-900">Client Approval</h2>

        <p className="text-sm text-slate-500 mb-6">By entering your details below, you agree to proceed with this project under the outlined scope and pricing.</p>
        
        {!proposal.isAccepted ? (
          <div className="mt-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Accept Proposal</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Your Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full mb-4 border border-slate-200 rounded-lg p-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-colors"
              disabled={accepting}
            />

            <input
              type="email"
              placeholder="Your Email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full mb-6 border border-slate-200 rounded-lg p-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-colors"
              disabled={accepting}
            />

            <button
              onClick={acceptProposal}
              disabled={accepting || !clientName.trim() || !clientEmail.trim()}
              className="w-full bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {accepting ? "Accepting..." : "Accept & Proceed"}
            </button>
          </div>
        ) : (
          <div className="mt-10 bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-3">✅ Proposal Accepted</h2>
            <p className="text-emerald-600 text-lg mb-1">Thank you for accepting!</p>
            <p className="text-sm text-emerald-500">
              Accepted on {new Date(proposal.acceptedAt).toLocaleDateString()}
            </p>
          </div>
          
        )}
        <p className="text-xs text-slate-400 mt-4 text-center">🔒 This action is legally binding and confirms your acceptance of this proposal.</p>
      </div>
    </div>
  );
}
