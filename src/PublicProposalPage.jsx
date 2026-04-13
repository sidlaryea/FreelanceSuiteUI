import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPublicProposal } from "./api/proposalApi";

import ProposalHero from "./components/Proposals/ProposalHero";
import ProposalOverview from "./components/Proposals/ProposalOverview";
import PricingTable from "./components/Proposals/PricingTable";
import ProposalTotal from "./components/Proposals/ProposalTotal";
import AcceptProposalButton from "./components/Proposals/AcceptProposalButton";

export default function PublicProposalPage() {

  const { token } = useParams();
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    loadProposal();
  }, []);

  const loadProposal = async () => {
    const data = await getPublicProposal(token);
    setProposal(data);
  };

  if (!proposal) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Proposal...
      </div>
    );
  }

  return (

    <div className="bg-gray-50 min-h-screen py-10">

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-10">

        <ProposalHero proposal={proposal} />

        <ProposalOverview proposal={proposal} />

        <PricingTable items={proposal.pricingItems} />

        <ProposalTotal items={proposal.pricingItems} />

        <AcceptProposalButton />

      </div>

    </div>
  );
}