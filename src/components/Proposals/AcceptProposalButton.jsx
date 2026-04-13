import axios from "../../api/axiosClient";

export default function AcceptProposalButton({ token }) {

  const handleAccept = async () => {

    try {

      await axios.post(`/p/${token}/accept`);

      alert("Proposal accepted successfully!");

    } catch (err) {

      console.error(err);

    }

  };

  return (

    <div className="text-center mt-10">

      <button
        onClick={handleAccept}
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg"
      >
        Accept Proposal
      </button>

    </div>

  );
}