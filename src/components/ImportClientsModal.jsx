import { useMemo, useState } from "react";
import { Download, UploadCloud, X } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5078";

export default function ImportClientsModal({
  isOpen,
  onClose,
  onImported,
}) {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return !!file && !submitting;
  }, [file, submitting]);

  if (!isOpen) return null;

  const handlePickFile = (e) => {
    setError("");
    setSummary(null);
    setFile(e.target.files?.[0] || null);
  };

  const handleDownloadTemplate = () => {
    // Minimal in-app template to avoid adding extra files.
    const csv = ["Name,Email,Company,Phone"]
      .concat([
        "John Doe,john@company.com,Company A,+233200000000",
        "Jane Smith,jane@company.com,Company B,+233240000000",
      ])
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "clients-import-template.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSummary(null);

    if (!file) {
      setError("Please select a CSV or .xlsx file.");
      return;
    }

    const ext = (file.name.split(".").pop() || "").toLowerCase();
    const isAllowed = ext === "csv" || ext === "xlsx";
    if (!isAllowed) {
      setError("Only CSV and Excel (.xlsx) files are allowed.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("jwtToken");

      const formData = new FormData();
      // backend might expect a particular name; common conventions: file
      formData.append("file", file);

      const res = await axios.post(
        `${API_URL}/Proposal/api/internal/clients/import`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSummary(res.data);
      onImported?.(res.data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Import failed";
      setError(typeof message === "string" ? message : "Import failed");
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
              <h2 className="text-2xl font-bold">Import Clients</h2>
              <p className="text-slate-200 mt-1">
                Upload a CSV or Excel file. Duplicates will be skipped.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className=" cursor-pointer w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
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
            <div className="md:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Example format
                </p>
                <pre className="mt-2 text-xs text-slate-600 whitespace-pre-wrap">
Name,Email,Company,Phone
John Doe,john@company.com,Company A,+233200000000
Jane Smith,jane@company.com,Company B,+233240000000
                </pre>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Upload CSV or .xlsx
              </label>
              <div className="mt-2">
                <label className="block cursor-pointer">
                  <div className="h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition flex items-center justify-center gap-2">
                    <UploadCloud size={18} className="text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">
                      {file ? file.name : "Upload file"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handlePickFile}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-500 mt-2">
                  Supported: CSV and Excel (.xlsx)
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-slate-700">Template</label>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="cursor-pointer mt-2 h-12 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <Download size={18} />
                <span className="text-sm font-medium text-slate-700">
                  Download Template
                </span>
              </button>

              <div className="mt-4 rounded-3xl bg-white border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Import Clients
                </p>
                <div className="mt-2 text-xs text-slate-600 leading-relaxed">
                  ✓ Validates rows
                  <br />✓ Skips duplicates
                  <br />✓ Creates new clients
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <div>
              {summary ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-slate-900">
                      ✓ {summary.imported} imported
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-sm font-semibold text-slate-900">
                      ⚠ {summary.skipped} duplicates skipped
                    </span>
                  </div>
                  {typeof summary.errors === "number" && summary.errors > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="text-sm font-semibold text-slate-900">
                        ✕ {summary.errors} errors
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className=" cursor-pointer h-11 px-5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className=" cursor-pointer h-11 px-6 rounded-2xl bg-slate-900 text-white hover:bg-black transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Importing..." : "Import Clients"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

