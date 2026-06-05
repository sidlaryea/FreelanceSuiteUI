import { useEffect, useMemo, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ;

const flag = (code) =>
  code?.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt())
  );

export default function AddClientModal({
  isOpen,
  onClose,
  onClientAdded,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    phone: "",
    address: "",
    countryId: "",
    logo: "",
    status: "Active",
  });
  const [countries, setCountries] = useState([]);
  const [clientLogoFile, setClientLogoFile] = useState(null);
  const [clientLogoPreview, setClientLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.email.trim().length > 0 &&
      form.companyName.trim().length > 0
    );
  }, [form]);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setSubmitting(false);
    setClientLogoFile(null);
    setClientLogoPreview(null);
    setForm({
      name: "",
      email: "",
      companyName: "",
      phone: "",
      address: "",
      countryId: "",
      logo: "",
      status: "Active",
    });
  }, [isOpen]);

  useEffect(() => {
    axios
      .get("http://localhost:5214/api/Country")
      .then((res) => {
        const sortedCountries = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      })
      .catch((err) => console.error("Failed to fetch countries:", err));
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onClientFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (clientLogoPreview) {
      URL.revokeObjectURL(clientLogoPreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setClientLogoFile(file);
    setClientLogoPreview(previewUrl);
    // Don't set logo yet—will upload on form submit
  };

  const uploadClientLogo = async (file, clientId) => {
    if (!file || !clientId) return null;
    
    try {
      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");
      const logoData = new FormData();
      logoData.append("file", file);

      await axios.post(
        `${API_URL}/proposal/api/Client/update-logo/${clientId}`,
        logoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "X-API-KEY": apiKey,
          },
        }
      );

      return true;
    } catch (err) {
      console.error("Failed to upload logo:", err);
      throw new Error("Failed to upload logo. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Please fill name, email and company name.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      const apiKey = localStorage.getItem("apiKey");

      // Create client first (without logo)
      const payload = {
        name: form.name,
        email: form.email,
        companyName: form.companyName,
        phone: form.phone,
        address: form.address,
        country: form.countryId,
        status: form.status,
        createdAt: new Date().toISOString(),
      };

      const res = await axios.post(
        `${API_URL}/Proposal/api/Client`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      const clientId = res.data.id;

      // Upload logo if file exists
      if (clientLogoFile) {
        try {
          await uploadClientLogo(clientLogoFile, clientId);
        } catch (err) {
          setError(err.message);
          setSubmitting(false);
          return;
        }
      }

      onClientAdded?.(res.data);
      onClose?.();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Failed to add client";
      setError(typeof message === "string" ? message : "Failed to add client");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-[92%] max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Add New Client</h2>
              <p className="text-slate-200 mt-1">
                Create a client profile and start managing proposals.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. client@company.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Company Name</label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="mt-2 w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Aurum Logistics Ltd"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. +233 24 000 1111"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="mt-2 w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 12 Main St"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Country</label>
              <select
                name="countryId"
                value={form.countryId}
                onChange={handleChange}
                className="mt-2 w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select country…</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {flag(c.code)} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="mt-2 w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700">
                Client Logo
              </label>
              <label className="mt-2 flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 border border-slate-200">
                  <UploadCloud size={18} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${clientLogoFile ? "text-slate-900 font-medium" : "text-slate-500"}`}>
                    {clientLogoFile ? clientLogoFile.name : "Click to upload client logo (PNG, JPG, SVG)"}
                  </p>
                  {clientLogoPreview && (
                    <img
                      src={clientLogoPreview}
                      alt="Client logo preview"
                      className="mt-3 h-20 w-20 rounded-2xl border border-slate-200 object-cover"
                    />
                  )}
                </div>
                <input type="file" accept="image/*" onChange={onClientFile} className="hidden" />
              </label>
              <p className="text-xs text-slate-500 mt-2">
                Upload a logo image to preview it here.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="h-11 px-6 rounded-2xl bg-slate-900 text-white hover:bg-black transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Adding..." : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

