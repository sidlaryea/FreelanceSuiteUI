import { useEffect, useState } from "react";

export default function PricingTable({ initialItems = [], onChange }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  // 🔢 Calculate total
  const calculateTotal = (items) =>
    (items || []).reduce(
      (sum, item) => sum + (item.qty || 0) * (item.price || 0),
      0
    );

  // ✏️ Update item
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] =
      field === "name" || field === "description"
        ? value
        : Number(value);

    setItems(updated);
    onChange?.(updated);
  };

  // ➕ Add new row
  const addItem = () => {
    const newItem = {
      name: "",
      description: "",
      qty: 1,
      price: 0,
    };
    const updated = [...items, newItem];
    setItems(updated);
    onChange?.(updated);
  };

  // ❌ Remove row
  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    onChange?.(updated);
  };

  const total = calculateTotal(items);

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Pricing Breakdown
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400 border-b">
            <tr>
              <th className="pb-2">Item</th>
              <th className="pb-2">Description</th>
              <th className="pb-2">Qty</th>
              <th className="pb-2">Unit Price</th>
              <th className="pb-2">Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {(items || []).map((item, index) => {
              const rowTotal =
                (item.qty || 0) * (item.price || 0);

              return (
                <tr key={index} className="border-b last:border-none">
                  {/* TITLE */}
                  <td className="py-3 pr-2">
                    <input
                      value={item.name || ""}
                      onChange={(e) =>
                        updateItem(index, "name", e.target.value)
                      }
                      placeholder="Service name"
                      className="w-full bg-transparent border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* DESCRIPTION */}
                  <td className="py-3 pr-2">
                    <input
                      value={item.description || ""}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      placeholder="Brief details (optional)"
                      className="w-full bg-transparent border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>

                  {/* QTY */}
                  <td className="py-3 pr-2 w-20">
                    <input
                      type="number"
                      value={item.qty || 0}
                      onChange={(e) =>
                        updateItem(index, "qty", e.target.value)
                      }
                      className="w-full border border-slate-200 rounded-md px-2 py-1"
                    />
                  </td>

                  {/* UNIT PRICE */}
                  <td className="py-3 pr-2 w-32">
                    <input
                      type="number"
                      value={item.price || 0}
                      onChange={(e) =>
                        updateItem(index, "price", e.target.value)
                      }
                      className="w-full border border-slate-200 rounded-md px-2 py-1"
                    />
                  </td>

                  {/* ROW TOTAL */}
                  <td className="py-3 pr-2 font-medium text-slate-700">
                    ${rowTotal.toFixed(2)}
                  </td>

                  {/* REMOVE */}
                  <td className="py-3 text-right">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={addItem}
          className="text-blue-600 hover:underline text-sm"
        >
          + Add Item
        </button>

        <div className="text-right">
          <p className="text-sm text-slate-400">Total</p>
          <p className="text-xl font-semibold text-slate-900">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}