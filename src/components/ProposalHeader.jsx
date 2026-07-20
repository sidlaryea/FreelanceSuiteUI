import { buildImageUrl } from "../Utils/SettingsHelpers";

const ProposalHeader = ({ proposal }) => {
  // Resolve logo URL: handle relative paths from the API
  const logoUrl = buildImageUrl(proposal?.organization?.logoUrl || proposal?.organization?.logo);

  return (
    <div className="w-full border-b bg-white px-6 py-4 flex items-center justify-between">
      
      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        <img
          src={logoUrl}
          alt="Company Logo"
          className="h-10 w-10 object-contain"
        />
        <span className="font-semibold text-gray-800 text-lg">
          {proposal?.organization?.name || proposal.companyName || "Your Company"}
        </span>
      </div>

      {/* Center - Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">
          {proposal.title || "Project Proposal"}
        </h1>
      </div>

      {/* Right - Client + Date + Status */}
      <div className="text-right">
        <p className="text-sm text-gray-600">
          Prepared for:{" "}
          <span className="font-medium text-gray-800">
            {proposal.clientName}
          </span>
        </p>
        <p className="text-sm text-gray-500">
          {new Date(proposal.date).toLocaleDateString()}
        </p>

        {/* Status Badge */}
        <span
          className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
            proposal.status === "Approved"
              ? "bg-green-100 text-green-700"
              : proposal.status === "Viewed"
              ? "bg-blue-100 text-blue-700"
              : proposal.status === "Sent"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {proposal.status || "Draft"}
        </span>
      </div>
    </div>
  );
};

export default ProposalHeader;