import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import ProposalCoverPage from "./CoverPage";
import { 
  PrinterIcon, 
  DocumentArrowDownIcon, 
  ArrowsPointingOutIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function ProposalPreviewModal({
  isOpen,
  onClose,
  executiveSummary,
  htmlContent,
  ScopePreview,
  timelinePreview,
  pricingItems,
  signature,
  terms,
  draftId,
  userData,
  client,
  currency
}) {
  const printRef = useRef(null);
  if (!isOpen) return null;

  const safePricing = pricingItems || [];

  const total = safePricing.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0
  );

  const handlePrint = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Proposal</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            h1, h2, h3 { margin-top: 1.5em; margin-bottom: 0.5em; color: #111; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f5f5f5; font-weight: bold; }
            .text-slate-300 { color: #d1d5db !important; }
            .text-slate-900 { color: #111 !important; }
            .bg-slate-100 { background-color: #f3f4f6 !important; }
            .border-slate-200 { border-color: #e5e7eb !important; }
            .text-slate-600 { color: #4b5563 !important; }
            .text-slate-500 { color: #6b7280 !important; }
            .text-slate-800 { color: #1f2937 !important; }
            .prose * { color: #374151 !important; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPdf = () => {
    const element = printRef.current;
    if (!element) return;

    // Pre-process: override Tailwind colors on element tree to avoid oklch parsing
    const overrideColors = (el) => {
      el.style.setProperty('--color-slate-300', '#d1d5db', 'important');
      el.style.setProperty('--color-slate-900', '#111827', 'important');
      el.style.setProperty('--color-slate-600', '#4b5563', 'important');
      el.style.setProperty('--color-slate-500', '#6b7280', 'important');
      el.style.setProperty('--color-slate-800', '#1f2937', 'important');
      el.style.setProperty('--color-slate-100', '#f3f4f6', 'important');
      el.style.setProperty('--color-slate-200', '#e5e7eb', 'important');
      el.querySelectorAll('*').forEach(overrideColors);
    };
    overrideColors(element);

    const opt = {
      margin: 0.5,
      filename: "proposal.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[90%] max-w-5xl h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            Proposal Preview
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="text-sm text-slate-600 hover:text-black cursor-pointer flex items-center gap-1"
            >
              <PrinterIcon className="w-5 h-5" />
              Print
            </button>
            <button
              onClick={handleDownloadPdf}
              className="text-sm text-emerald-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={() => window.open(`${window.location.origin}/preview/${draftId}`, "_blank")}
              className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              <ArrowsPointingOutIcon className="w-5 h-5" />
              Full Screen
            </button>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-red-500 text-sm cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div ref={printRef} className="flex-1 overflow-y-auto p-8 space-y-8 prose prose-slate max-w-none">
          <ProposalCoverPage userData={userData} client={client} />
          
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Executive Summary</h2>
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: executiveSummary }}
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Main Body</h2>
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Scope of Work</h2>
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: ScopePreview }}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Project Timeline</h2>
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: timelinePreview }}
            />
          </div>

          {safePricing.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Pricing</h2>
              <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-sm text-slate-600">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Qty</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {safePricing.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{item.name || item.title}</td>
                      <td className="p-3 text-sm text-slate-500">{item.description}</td>
                      <td className="p-3">{item.qty || item.quantity}</td>
                      <td className="p-3">{item.price || item.unitPrice}</td>
                      <td className="p-3">
                        {currency}{(item.price || item.unitPrice) * (item.qty || item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right mt-4 font-semibold text-lg">
                Total: {currency} {total.toLocaleString('en-US', {minimumFractionDigits: 2,maximumFractionDigits: 2})}
              </div>
            </div>
          )}

          {terms && (
            <div className="py-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Terms & Conditions</h2>
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: terms }}
              />
            </div>
          )}

          {signature && (
            <div className="py-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Signature</h2>
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: signature }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
