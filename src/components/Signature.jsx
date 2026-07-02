import SignatureCanvas from "react-signature-canvas";
import { useRef, useState } from "react";

export default function SignatureSection({ onComplete, disabled, secondaryAction }) {
  const sigRef = useRef();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSave = () => {
    if (!name || !email) {
      alert("Name and email required");
      return;
    }

    if (sigRef.current.isEmpty()) {
      alert("Please sign before continuing");
      return;
    }

    const signature = sigRef.current.toDataURL("image/png");

    // Popup confirmation for user action
    alert("Thanks! Your Signature Has Been Submitted.");

    onComplete({
      clientName: name.trim(),
      clientEmail: email.trim(),
      signature,
    });
  };

  return (
    <div className="space-y-6 border-t pt-8">
      <h3 className="text-lg font-bold text-slate-900 flex items-center">
        Sign to Accept
      </h3>

      {/* Name */}
      <div>
        <label className="text-sm font-medium text-slate-700">Name</label>
        <input
          type="text"
          placeholder="e.g. John Doe"
          className="mt-2 w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          placeholder="e.g. client@company.com"
          className="mt-2 w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Signature Pad */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{ className: "w-full h-40" }}
          clearOnResize={false}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => sigRef.current.clear()}
            disabled={disabled}
            className="cursor-pointer h-11 px-5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Clear Signature
          </button>

          <button
            onClick={handleSave}
            disabled={disabled}
            className="cursor-pointer h-11 px-6 rounded-2xl bg-slate-900 text-white hover:bg-black transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Confirm & Accept
          </button>
        </div>

        {secondaryAction}
      </div>
    </div>
  );
}