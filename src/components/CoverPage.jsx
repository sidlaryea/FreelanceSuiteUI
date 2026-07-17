
export default function ProposalCoverPage({ userData, client }) {

  console.log("=== ProposalCoverPage Debug ===");
  console.log("userData:", userData);
  console.log("userData.logo:", userData?.logo);
  console.log("client:", client);
  console.log("client.logo:", client?.logo);



  return (
    <div
      className="text-white p-10 rounded-2xl mb-6 shadow-lg"
      style={{
        background: "linear-gradient(to bottom right, #0f172a, #334155)", // slate-900 → slate-700
        WebkitPrintColorAdjust: "exact",   // tells browsers to print backgrounds
        printColorAdjust: "exact",
      }}
    >
      
      <div className="flex justify-between items-start">
        
        {/* Freelancer */}
        <div>
          <h2 className="text-lg font-semibold">
            {userData?.name || "Your Company"}
          </h2>
          <p className="text-sm text-slate-300">{userData?.email}</p>
        </div>

        {/* Logo Placeholder */}
        <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
          <img
            src={`${API_BASE_Proposal}${userData?.logoUrl || userData?.logo}  `}
            alt="Company Logo"
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      <div className="mt-16">
        <h1 className="text-4xl font-bold leading-tight">
          Project Proposal
        </h1>

        <p className="mt-4 text-slate-300">
          Prepared for {client?.name || "Client Name"}
        </p>
      </div>

      <div className="mt-16 text-sm text-slate-300">
        <p>{new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );



  
 
};