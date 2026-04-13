export default function ProposalOverview({ proposal }) {

  return (

    <div className="mb-10">

      <h2 className="text-2xl font-semibold mb-3">
        Project Overview
      </h2>

      <p className="text-gray-600 leading-relaxed">
        {proposal.description || "This proposal outlines the scope, pricing, and timeline for the project."}
      </p>

    </div>

  );
}