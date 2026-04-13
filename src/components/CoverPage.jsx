
export default function ProposalCoverPage({ userData, client }) {

  console.log("=== ProposalCoverPage Debug ===");
  console.log("userData:", userData);
  console.log("userData.logo:", userData?.logo);
  console.log("client:", client);
  console.log("client.logo:", client?.logo);



  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white rounded-2xl p-10 mb-6 shadow-lg">
      
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
            src={`http://localhost:5078${client?.logo}`}
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