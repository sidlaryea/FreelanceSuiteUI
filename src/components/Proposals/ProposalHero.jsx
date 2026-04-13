export default function ProposalHero({ proposal }) {

  return (
    <div className="mb-10 border-b pb-6">

      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        {proposal.title}
      </h1>

      <p className="text-gray-500">
        Prepared by SidConsult
      </p>

    </div>
  );
}