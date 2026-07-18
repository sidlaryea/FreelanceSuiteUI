import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "./api/axiosClient";
const axios = axiosClient;
import Sidebar from "./components/Sidebar";
import ProposalCoverPage from "./components/CoverPage";
import ProposalPreviewModal from "./components/ProposalPreviewModal";
import ProposalMetaSection from "./components/ProposalMetaSection";
import  Icon  from "./ProposalDraftEditorPage"; // Reuse icons
import { API_BASE_Invoice,API_BASE_Proposal } from "./config/api";


export default function FinalProposalPage() {
  const { id } = useParams(); // finalProposalId
  const navigate = useNavigate();

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeNav, setActiveNav] = useState("Proposals");

  useEffect(() => {
    fetchProposal();
    fetchUserData();
  }, [id]);

  

  const fetchProposal = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

    try {
      const response = await axios.get(
        `${API_BASE_Proposal}/api/proposal/${id}`, // Adjust endpoint as needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );
      console.log('Fetched proposal data:', response.data);
      console.log('pricingBreakdown:', response.data?.pricingBreakdown, 'Type:', typeof response.data?.pricingBreakdown, Array.isArray(response.data?.pricingBreakdown));
      setProposal(response.data);
    } catch (error) {
      console.error("Failed to fetch final proposal", error);
    } finally {
      setLoading(false);
    }
  };



  const fetchUserData = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

    try {
      const response = await axios.get(`${API_BASE_Invoice}/api/Register/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": apiKey
        }
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  const copyLink = async (event) => {
    if (!proposal?.publicToken) {
      console.error('No public token available to copy');
      return;
    }

    const baseUrl = "https://freelancepro-gmdgggdtdhcqa7bd.southafricanorth-01.azurewebsites.net";
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const url = `${normalizedBase}/${proposal.publicToken}`;
    const button = event?.currentTarget;
    const original = button?.textContent;

    try {
      await navigator.clipboard.writeText(url);
      if (button) {
        button.textContent = 'Copied!';
        button.classList.add('bg-green-600');
        setTimeout(() => {
          button.textContent = original;
          button.classList.remove('bg-green-600');
        }, 2000);
      }
    } catch (clipboardError) {
      console.error('Failed to copy link', clipboardError);
      alert('Unable to copy the proposal link. Please try again.');
    }
  };

  const sendToClient = async () => {
    const token = localStorage.getItem("jwtToken");
    const apiKey = localStorage.getItem("apiKey");

    try {
      await axios.post(
        `${API_BASE_Proposal}/api/Proposal/${id}/send`,
        
        {},
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey
          }
        }
      );
      alert("Proposal sent to client successfully!");
       window.location.reload();
    } catch (error) {
      console.error("Failed to send proposal", error);
      alert("Failed to send proposal");
    }
  };

   

  if (loading) {
    return (
      <div className="flex h-screen bg-white overflow-hidden font-outfit">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-500">Loading final proposal...</div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="flex h-screen bg-white overflow-hidden font-outfit">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-500">Proposal not found</div>
        </div>
      </div>
    );
  }

  
 let safePricing = [];

try {
  const parsed = JSON.parse(proposal.pricingBreakdown || "[]");

  const items = Array.isArray(parsed)
    ? parsed
    : parsed.items || [];

  // ✅ NORMALIZE FIELD NAMES HERE
  safePricing = items.map(item => ({
    name: item.Name || item.name,
    description: item.Description || item.description,
    qty: item.Qty || item.qty,
    price: item.Price ||item.price
  }));

} catch (e) {
  console.error("Invalid pricing JSON", e);
}

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Never';
  };

  const mapProposalStatus = (status) => {
    const statusNum = typeof status === 'string' ? parseInt(status) : status;
    const statusMap = {
      0: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
      1: { label: 'Submitted', color: 'bg-amber-100 text-amber-700' },
      2: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700' },
      3: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
      4: { label: 'Invoiced', color: 'bg-purple-100 text-purple-700' },
      5: { label: 'Expired', color: 'bg-gray-100 text-gray-700' },
      6: { label: 'Paid', color: 'bg-green-100 text-green-700' },
      7: { label: 'Viewed', color: 'bg-blue-100 text-blue-700' },
    };
    return statusMap[statusNum] || { label: 'Unknown', color: 'bg-gray-200 text-gray-800' };
  };

  const renderActions = () => {
    const status = proposal.status;
    switch (status) {
      case 0:
      case "Draft":
      case "0":
        return (
          <>
            <button
              onClick={sendToClient}
              className="px-6 py-2.5 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Send to Client
            </button>
            <button
              onClick={() => navigate(`/ProposalDraftEditorPage/${proposal.proposalDraftId}`)}
              className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Edit
            </button>
          </>
        );

      case 1:
      case "Submitted":
      case "1":
        return (
          <>
            <button
              onClick={copyLink}
              data-copy
              className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Copy Link
            </button>
            <button
              className="px-6 py-2.5 text-sm bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
              onClick={sendToClient} // Reuse send as resend
            >
              Resend
            </button>
          </>
        );

      case 2:
      case "Accepted":
      case "2":
        return (
          <>
            <button
              onClick={copyLink}
              data-copy
              className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Copy Link
            </button>
            
            <button
              className="px-6 py-2.5 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
              onClick={() => alert('Start project functionality - implement navigation')}
            >
              Start Project
            </button>
            <button
              className="px-6 py-2.5 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
              onClick={() => alert('Create invoice functionality - implement navigation')}
            >
              Create Invoice
            </button>

          </>
        );

      case 3:
      case "Rejected":
      case "3":
        return (
          <>
            <button
              onClick={copyLink}
              data-copy
              className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Copy Link
            </button>
            <button
              onClick={sendToClient}
              className="px-6 py-2.5 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Resend
            </button>
          </>
        );

      case 4:
      case "Invoiced":
      case "4":
        return (
          <>
            <button
              className="px-6 py-2.5 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              View Invoice
            </button>
          </>
        );

      case 5:
      case "Expired":
      case "5":
        return (
          <>
            <button
              onClick={sendToClient}
              className="px-6 py-2.5 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Resend
            </button>
          </>
        );

      case 6:
      case "Paid":
      case "6":
        return (
          <>
            <button
              className="px-6 py-2.5 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              View Project
            </button>
          </>
        );

      case 7:
      case "Viewed":
      case "7":
        return (
          <>
            <button
              onClick={copyLink}
              data-copy
              className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Copy Link
            </button>
          </>
        );

      default:
        return (
          <>
            <button
              onClick={() => setShowPreview(true)}
              className="px-6 py-2.5 text-sm bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Preview
            </button>
            <button
              onClick={copyLink}
              data-copy
              className="px-6 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Copy Link
            </button>
            <button
              onClick={sendToClient}
              className="px-6 py-2.5 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all cursor-pointer font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              Send to Client
            </button>
          </>
        );
    }
  };

  const total = safePricing.reduce((sum, item) => sum + (parseFloat(item?.price || 0) * parseFloat(item?.qty || 1)), 0);



  return (
    <div className="flex h-screen bg-white overflow-hidden font-outfit">
      {/* SIDEBAR */}
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} userData={userData} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
       

        {/* TOPNAV */}
        <header className="h-14 bg-white border-b border-slate-100 px-7 flex items-center justify-between flex-shrink-0">
  
  {/* LEFT: Breadcrumb */}
  <div className="flex items-center gap-1 text-xs text-slate-400">
    <button onClick={() => navigate(-1)} className="hover:text-slate-600 transition-colors flex items-center gap-1">
      <span>{Icon.arrowLeft}</span>
      <span>Proposals</span>
    </button>
    <span className="text-slate-300">{Icon.chevron}</span>
    <span className="text-slate-700 font-medium">
      {proposal.projectRequirement?.projectTitle || "Final Proposal"}
    </span>
  </div>

  {/* MIDDLE: Status + Views */}
  <div className="flex items-center gap-4 text-sm">
    <span className={`px-3 py-1 rounded-full text-xs ${mapProposalStatus(proposal.status).color}`}>
      {mapProposalStatus(proposal.status).label}
    </span>
    <span className="text-slate-500 flex items-center gap-1">
      View Count 👁 {proposal.viewCount}
    </span>
    <span>📅 First Viewed: {formatDate(proposal.firstViewedAt)}</span>
    <span>📅 Last Viewed: {formatDate(proposal.lastViewedAt)}</span>
  </div>

  {/* RIGHT: Search + Notifications */}
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 w-52 focus-within:border-slate-400 transition-colors">
      <span className="text-slate-400">{Icon.search}</span>
      <input
        className="bg-transparent outline-none text-sm text-slate-700 flex-1 placeholder:text-slate-400" placeholder="Search…"
      />
    </div>

     <button className="relative w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>

              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"/>
            </button>
  </div>

</header>

        <main className="flex-1 overflow-y-auto bg-slate-100 px-6 py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* PROPOSAL DISPLAY (same as ProposalDraftEditorPage preview) */}
            <ProposalCoverPage userData={proposal?.organization} client={proposal?.client} />
            
            <ProposalMetaSection 
              userData={proposal.organization} 
              client={proposal.client} 
              overview={proposal.overview}
            />

            {/* ACTION BAR WITH REQUESTED BUTTONS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 flex justify-end gap-3">
              {renderActions()}
            </div>

            <ProposalPreviewModal 
              isOpen={showPreview} 
              onClose={() => setShowPreview(false)}
              executiveSummary={proposal.executiveSummary} 
              htmlContent={proposal.contentHtml} 
              ScopePreview={proposal.scopePreview}
              timelinePreview={proposal.timelinePreview}
              pricingItems={safePricing}
              terms={proposal.termsSectionHtml}
              signature={proposal.signatureSectionHtml}
              draftId={id}
              userData={proposal.organization}
              client={proposal.client}

            />

            {/* Show preview inline if not in modal */}
            {!showPreview && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-10 space-y-10">
                  {/* Reuse same structure as editor preview sections */}
                  {proposal.executiveSummary && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Executive Summary</h2>
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: proposal.executiveSummary }} />
                    </div>
                  )}
                  
                  {/* Main content */}
                  {proposal.contentHtml && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Project Proposal</h2>
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: proposal.contentHtml }} />
                    </div>
                  )}

                  

                  {/* Scope */}
                  {proposal.scopeOfWork && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Scope of Work</h2>
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: proposal.scopeOfWork }} />
                    </div>
                  )}

                  {/*Key Deliverables*/}
                   {proposal.deliverables && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Key Deliverables</h2>
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: proposal.deliverables }} />
                    </div>
                  )}

                  {/* Timeline */}
                  {proposal.timeline && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Project Timeline</h2>
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: proposal.timeline }} />
                    </div>
                  )}

                  {/* Pricing */}
                  {safePricing.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Pricing</h2>
                      <table className="w-full border border-slate-200 rounded-lg overflow-hidden mb-6">
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
                              <td className="p-4 font-medium">{item.name || item.Name} </td>
                              <td className="p-4 text-slate-600">{item.description || item.Description}</td>
                              <td className="p-4 text-right">{item.qty || item.quantity}</td>
                              <td className="p-4 text-right">{Number(item.price || item.unitPrice).toLocaleString()}</td>
                              <td className="p-4 text-right font-semibold">{proposal.currency}{Number((item.price || item.unitPrice) * (item.qty || item.quantity)).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900">
                          Total:  {proposal.currency} {Number(total).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms */}
                  {proposal.termsSectionHtml && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Terms & Conditions</h2>
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: proposal.termsSectionHtml }} />
                    </div>
                  )}

                  {/* Signature */}
                  {proposal.signatureSectionHtml && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-3">Acceptance</h2>
                      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: proposal.signatureSectionHtml }} />
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
