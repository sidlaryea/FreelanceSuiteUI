export default function PricingTable({ items }) {

  return (

    <div className="mb-8">

      <h2 className="text-2xl font-semibold mb-4">
        Pricing
      </h2>

      <table className="w-full">

        <thead className="border-b">
          <tr className="text-left text-gray-500">

            <th className="py-2">Service</th>
            <th className="text-center">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-right">Total</th>

          </tr>
        </thead>

        <tbody>

          {items.map((item, index) => (

            <tr key={index} className="border-b">

              <td className="py-4">
                {item.description}
              </td>

              <td className="text-center">
                {item.quantity}
              </td>

              <td className="text-right">
                ${item.unitPrice}
              </td>

              <td className="text-right font-medium">
                ${item.total}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}