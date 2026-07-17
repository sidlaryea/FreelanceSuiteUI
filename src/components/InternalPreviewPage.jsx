import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosClient";
import { API_BASE_Invoice } from "../config/api";

export default function InternalPreviewPage() {
  const { draftId } = useParams();

  const [draft, setDraft] = useState(null);

  useEffect(() => {
    fetchDraft();
  }, [draftId]);

 const fetchDraft = async () => {
  const token = localStorage.getItem("jwtToken");
  const apiKey = localStorage.getItem("apiKey");

  try {
    const res = await axios.get(
      `${API_BASE_Invoice}/Proposal/api/ProposalDraft/${draftId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      }
    );

    setDraft(res.data);
  } catch (err) {
    console.error("Preview load failed", err);
  }
};

  if (!draft) {
    return <div className="p-10 text-center">Loading preview...</div>;
  }

  const pricing = draft.pricingItems || [];

  const total = pricing.reduce(
    (sum, item) =>
      sum + (item.price || item.price || 0) * (item.qty || item.qty || 0),
    0
  );

  return (
    <div className="bg-white min-h-screen p-10 max-w-5xl mx-auto space-y-10">

      {/* EXEC SUMMARY */}
      {draft.executiveSummary && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
          <div dangerouslySetInnerHTML={{ __html: draft.executiveSummary }} />
        </section>
      )}

      {/* MAIN CONTENT */}
      <section>
        <div dangerouslySetInnerHTML={{ __html: draft.contentHtml }} />
      </section>

      {/* SCOPE */}
      {draft.scopePreview && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Scope</h2>
          <div dangerouslySetInnerHTML={{ __html: draft.scopePreview }} />
        </section>
      )}

      {/* TIMELINE */}
      {draft.timelinePreview && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Timeline</h2>
          <div dangerouslySetInnerHTML={{ __html: draft.timelinePreview }} />
        </section>
      )}

      {/* PRICING */}
      {pricing.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>

          <table className="w-full border">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {pricing.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.qty}</td>
                  <td>${item.price}</td>
                  <td>${item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right font-bold mt-4">
            Total: ${total}
          </div>
        </section>
      )}

      {/* TERMS */}
      {draft.termsSectionHtml && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Terms & Conditions</h2>
          <div className="prose prose-slate" dangerouslySetInnerHTML={{ __html: draft.termsSectionHtml }} />
        </section>
      )}

      {/* SIGNATURE */}
      {draft.signatureSectionHtml && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Signature</h2>
          <div className="prose prose-slate" dangerouslySetInnerHTML={{ __html: draft.signatureSectionHtml }} />
        </section>
      )}

    </div>
  );
}