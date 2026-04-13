export default function ProposalTotal({ items }) {

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (

    <div className="flex justify-end mb-10">

      <div className="text-right">

        <p className="text-lg text-gray-500">
          Total
        </p>

        <p className="text-3xl font-bold text-gray-900">
          ${total}
        </p>

      </div>

    </div>

  );
}