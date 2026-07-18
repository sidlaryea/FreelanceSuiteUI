import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosClient";
import Sidebar from "./Sidebar";
import { API_BASE_Invoice } from "../config/api";

export default function ProposalDraftPreview() {
  const { draftId } = useParams();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDraft();
  }, [draftId]);

  const fetchDraft = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

    try {
      const res = await axios.get(
        `${API_BASE_Proposal}/api/ProposalDraft/${draftId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );
      setDraft(res.data);
    } catch (err) {
      console.error("Draft preview load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading proposal preview...</div>;
  }

  if (!draft) {
    return <div className="flex h-screen items-center justify-center">Proposal not found</div>;
  }

  const safePricing = draft.pricingItems || [];
  const total = safePricing.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto p-8 space-y-10 bg-white shadow-2xl rounded-2xl mx-4 my-8">
        {/* HEADER */}
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{draft.projectRequirement?.projectTitle || 'Proposal'}</h1>
          <p className="text-slate-600">{draft.projectOverview?.projectDescription}</p>
        </div>

        {/* EXECUTIVE SUMMARY */}
        {draft.executiveSummary && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Executive Summary</h2>
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: draft.executiveSummary }} />
          </div>
        )}

        {/* MAIN CONTENT */}
        {draft.contentHtml && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Project Overview</h2>
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: draft.contentHtml }} />
          </div>
        )}

        {/* SCOPE OF WORK */}
        {draft.scopePreview && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Scope of Work</h2>
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: draft.scopePreview }} />
          </div>
        )}

        {/* TIMELINE */}
        {draft.timelinePreview && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Project Timeline</h2>
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: draft.timelinePreview }} />
          </div>
        )}

        {/* PRICING */}
        {safePricing.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Pricing</h2>
            <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left font-semibold text-slate-700">Item</th>
                  <th className="p-4 text-left font-semibold text-slate-700">Description</th>
                  <th className="p-4 text-right font-semibold text-slate-700">Qty</th>
                  <th className="p-4 text-right font-semibold text-slate-700">Price</th>
                  <th className="p-4 text-right font-semibold text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {safePricing.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-medium">{item.name || item.title}</td>
                    <td className="p-4 text-slate-600">{item.description}</td>
                    <td className="p-4 text-right">{item.qty || item.quantity}</td>
                    <td className="p-4 text-right">${(item.price || item.unitPrice)?.toLocaleString()}</td>
                    <td className="p-4 text-right font-semibold">${((item.price || item.unitPrice) * (item.qty || item.quantity))?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-6">
              <div className="text-2xl font-bold text-slate-900">
                Total: ${total.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* TERMS */}
        {draft.termsSectionHtml && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Terms & Conditions</h2>
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: draft.termsSectionHtml }} />
          </div>
        )}

        {/* SIGNATURE */}
        {draft.signnatureSectionHtml && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Signature</h2>
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: draft.signnatureSectionHtml }} />
          </div>
        )}
      </div>
    </div>
  );
}

