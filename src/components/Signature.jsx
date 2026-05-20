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

    onComplete({
      clientName: name.trim(),
      clientEmail: email.trim(),
      signature,
    });
  };

  return (
    <div className="space-y-6 border-t pt-8">

      <h3 className="text-lg font-semibold">Sign to Accept</h3>

      {/* Name */}
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border p-3 rounded-lg"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
      />

      {/* Email */}
      <input
        type="email"
        placeholder="Email Address"
        className="w-full border p-3 rounded-lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={disabled}
      />

      {/* Signature Pad */}
      <div className="border rounded-lg bg-white">
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
            className="text-sm text-slate-500 disabled:opacity-50 cursor-pointer"
          >
            Clear Signature
          </button>

          <button
            onClick={handleSave}
            disabled={disabled}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50 cursor-pointer"
          >
            Confirm & Accept
          </button>
        </div>

        {secondaryAction}
      </div>
    </div>
  );
}