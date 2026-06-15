"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  ShieldAlert, QrCode, Download, RefreshCw, CheckCircle2,
  Clock, Ban, Search, ChevronDown, ChevronUp, Loader2, Copy, Check,
} from "lucide-react";
import QRCode from "qrcode.react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface GeneratedCode {
  activation_code: string;
  qr_code: string;
  scan_url: string;
}

interface Sticker {
  id: string;
  activation_code: string;
  qr_code: string;
  status: "unactivated" | "activated" | "suspended";
  created_at: string;
  activated_at?: string;
  owner_first_name?: string;
  plate_number?: string;
  scan_count: number;
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Sticker["status"] }) {
  if (status === "activated") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
        <CheckCircle2 size={11} /> Activated
      </span>
    );
  }
  if (status === "suspended") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-danger-50 px-2.5 py-0.5 text-xs font-semibold text-danger-600">
        <Ban size={11} /> Suspended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
      <Clock size={11} /> Unactivated
    </span>
  );
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      onClick={copy}
      className="ml-1 rounded p-0.5 text-ink-400 hover:text-ink-700 transition-colors"
      title="Copy"
    >
      {copied ? <Check size={12} className="text-brand-600" /> : <Copy size={12} />}
    </button>
  );
}

// ── QR preview modal ──────────────────────────────────────────────────────────
function QrModal({
  code,
  onClose,
}: {
  code: GeneratedCode | null;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  if (!code) return null;

  function downloadSingle() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr_${code?.activation_code}.png`;
    link.href = (canvas as HTMLCanvasElement).toDataURL("image/png");
    link.click();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-8 shadow-2xl text-center max-w-xs w-full animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-ink-100 hover:bg-ink-200 transition-colors text-ink-500"
        >
          ✕
        </button>
        <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-4">QR code</p>
        <div ref={canvasRef} className="flex justify-center mb-4">
          <QRCode
            value={code.scan_url}
            size={200}
            level="H"
            includeMargin
            renderAs="canvas"
          />
        </div>
        <p className="font-display text-xl font-black tracking-[0.18em] text-ink-950 mb-1">
          {code.activation_code}
        </p>
        <p className="text-xs text-ink-400 font-mono break-all mb-6">{code.scan_url}</p>
        <button
          onClick={downloadSingle}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-ink-950 px-5 py-3 text-sm font-bold text-white hover:bg-danger-600 transition-colors"
        >
          <Download size={15} /> Download PNG
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminQrGeneratorPage() {
  const [count, setCount] = useState(10);
  const [baseUrl, setBaseUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [lastBatch, setLastBatch] = useState<GeneratedCode[]>([]);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loadingStickers, setLoadingStickers] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "unactivated" | "activated" | "suspended">("all");
  const [previewCode, setPreviewCode] = useState<GeneratedCode | null>(null);
  const [expandBatch, setExpandBatch] = useState(true);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Detect base URL from browser on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const showToast = useCallback((msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  async function fetchStickers() {
    setLoadingStickers(true);
    try {
      const { data } = await axios.get("/api/admin/generate-qrs");
      setStickers(data.stickers || []);
    } catch {
      showToast("Failed to load stickers.", "error");
    } finally {
      setLoadingStickers(false);
    }
  }

  useEffect(() => { fetchStickers(); }, []);

  async function handleGenerate() {
    if (!baseUrl.trim()) { showToast("Enter your site URL first.", "error"); return; }
    setGenerating(true);
    try {
      const { data } = await axios.post("/api/admin/generate-qrs", {
        count,
        base_url: baseUrl.trim(),
      });
      setLastBatch(data.codes || []);
      setExpandBatch(true);
      showToast(`${data.generated} QR codes generated and saved!`, "success");
      fetchStickers();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : "Generation failed.";
      showToast(msg || "Something went wrong.", "error");
    } finally {
      setGenerating(false);
    }
  }

  async function downloadZip() {
    if (lastBatch.length === 0) return;
    setDownloadingZip(true);

    try {
      // Dynamically import jszip (already in package.json via html5-qrcode deps)
      // We'll use a simple canvas approach without jszip:
      // Generate each QR as canvas and trigger downloads one by one for small batches.
      // For larger batches, we use JSZip if available.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let JSZip: any = null;
      try {
    // Previously expected error solved after installing jszip
        JSZip = (await import("jszip")).default;
      } catch {
        // fallback: download individually (cap at 5)
        const toDownload = lastBatch.slice(0, 5);
        for (const code of toDownload) {
          const canvas = document.createElement("canvas");
          // @ts-expect-error - QRCode global
          if (window.QRCode) {
            await new Promise<void>((res) => {
              // @ts-expect-error - global
              new window.QRCode(canvas, { text: code.scan_url, width: 300, height: 300 });
              setTimeout(res, 200);
            });
          }
          const link = document.createElement("a");
          link.download = `qr_${code.activation_code}.png`;
          link.href = canvas.toDataURL();
          link.click();
          await new Promise((r) => setTimeout(r, 150));
        }
        showToast("Downloaded first 5 QR codes.", "success");
        setDownloadingZip(false);
        return;
      }

      // With JSZip: render each QR to canvas, zip the PNGs
      const zip = new JSZip();
      const folder = zip.folder("qr-codes");

      for (const code of lastBatch) {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;

        // Use the QRCode global rendered by qrcode.react
        await new Promise<void>((resolve) => {
          const tempDiv = document.createElement("div");
          document.body.appendChild(tempDiv);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { createRoot } = require("react-dom/client");
          const { createElement } = require("react");
          const { QRCodeCanvas } = require("qrcode.react");

          const root = createRoot(tempDiv);
          root.render(
            createElement(QRCodeCanvas, {
              value: code.scan_url,
              size: 300,
              level: "H",
              includeMargin: true,
              id: `qr-${code.qr_code}`,
            })
          );

          setTimeout(() => {
            const c = tempDiv.querySelector("canvas") as HTMLCanvasElement;
            if (c) {
              const blob64 = c.toDataURL("image/png").split(",")[1];
              folder?.file(`qr_${code.activation_code}.png`, blob64, { base64: true });
            }
            root.unmount();
            document.body.removeChild(tempDiv);
            resolve();
          }, 80);
        });
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `qr-batch-${Date.now()}.zip`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`Downloaded ${lastBatch.length} QR codes as ZIP.`, "success");
    } catch (e) {
      console.error(e);
      showToast("Download failed. Try previewing individually.", "error");
    } finally {
      setDownloadingZip(false);
    }
  }

  // Filtered stickers
  const filtered = stickers.filter((s) => {
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.activation_code.toLowerCase().includes(q) ||
      s.qr_code.toLowerCase().includes(q) ||
      (s.owner_first_name || "").toLowerCase().includes(q) ||
      (s.plate_number || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: stickers.length,
    activated: stickers.filter((s) => s.status === "activated").length,
    unactivated: stickers.filter((s) => s.status === "unactivated").length,
    suspended: stickers.filter((s) => s.status === "suspended").length,
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg animate-fade-up ${
            toast.type === "success" ? "bg-brand-600" : "bg-danger-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* QR Preview Modal */}
      <QrModal code={previewCode} onClose={() => setPreviewCode(null)} />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger-600 text-white">
              <ShieldAlert size={18} />
            </div>
            <div>
              <span className="font-display text-lg font-black text-ink-950">
                QR<span className="text-danger-600">Alert</span>
              </span>
              <span className="ml-2 rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink-500">
                Admin
              </span>
            </div>
          </div>
          <button
            onClick={fetchStickers}
            className="flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-semibold text-ink-600 hover:bg-ink-50 transition-colors"
          >
            <RefreshCw size={13} className={loadingStickers ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 space-y-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total codes", value: stats.total, color: "bg-ink-950 text-white" },
            { label: "Activated", value: stats.activated, color: "bg-brand-600 text-white" },
            { label: "Unactivated", value: stats.unactivated, color: "bg-amber-500 text-white" },
            { label: "Suspended", value: stats.suspended, color: "bg-danger-600 text-white" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
              <p className="text-3xl font-display font-black">{s.value}</p>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-75 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Generator card */}
        <div className="rounded-3xl bg-white border border-ink-100 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950">
              <QrCode size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black text-ink-950">Generate new batch</h2>
              <p className="text-sm text-ink-400">Creates codes, saves to database, ready to print</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            {/* Batch size */}
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">
                Batch size <span className="text-danger-600">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="flex-1 accent-danger-600"
                />
                <span className="font-display text-2xl font-black text-ink-950 w-14 text-right">
                  {count}
                </span>
              </div>
              <div className="flex justify-between text-xs text-ink-400 mt-1">
                <span>1</span>
                <span>200 max</span>
              </div>
            </div>

            {/* Base URL */}
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-1.5">
                Site URL <span className="text-danger-600">*</span>
              </label>
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://yourdomain.com"
                className="w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 focus:outline-none focus:border-ink-800 font-mono"
              />
              <p className="text-xs text-ink-400 mt-1">
                QR will encode: <span className="font-mono">{baseUrl || "https://yourdomain.com"}/q/XXXX</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-2xl bg-danger-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-danger-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-danger-600/20"
          >
            {generating ? (
              <><Loader2 size={16} className="animate-spin" /> Generating…</>
            ) : (
              <><QrCode size={16} /> Generate {count} QR code{count !== 1 ? "s" : ""}</>
            )}
          </button>
        </div>

        {/* Last batch result */}
        {lastBatch.length > 0 && (
          <div className="rounded-3xl bg-white border border-ink-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandBatch((v) => !v)}
              className="w-full flex items-center justify-between px-6 sm:px-8 py-5 hover:bg-ink-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
                  <CheckCircle2 size={16} className="text-brand-600" />
                </div>
                <div className="text-left">
                  <p className="font-display font-black text-ink-950">
                    Last batch — {lastBatch.length} code{lastBatch.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-ink-400">Click a code to preview its QR image</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); downloadZip(); }}
                  disabled={downloadingZip}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-ink-950 px-4 py-2 text-xs font-bold text-white hover:bg-danger-600 transition-colors disabled:opacity-60"
                >
                  {downloadingZip ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                  Download ZIP
                </button>
                {expandBatch ? <ChevronUp size={18} className="text-ink-400" /> : <ChevronDown size={18} className="text-ink-400" />}
              </div>
            </button>

            {expandBatch && (
              <div className="border-t border-ink-100">
                {/* Mobile download btn */}
                <div className="sm:hidden px-6 py-3 border-b border-ink-100">
                  <button
                    onClick={downloadZip}
                    disabled={downloadingZip}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-xs font-bold text-white"
                  >
                    {downloadingZip ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                    Download all as ZIP
                  </button>
                </div>
                <div className="divide-y divide-ink-100 max-h-96 overflow-y-auto">
                  {lastBatch.map((code) => (
                    <button
                      key={code.activation_code}
                      onClick={() => setPreviewCode(code)}
                      className="w-full flex items-center gap-4 px-6 sm:px-8 py-3.5 hover:bg-ink-50 transition-colors text-left group"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink-100 bg-white group-hover:border-danger-200 transition-colors">
                        <QrCode size={18} className="text-ink-400 group-hover:text-danger-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-black tracking-[0.12em] text-ink-950 text-sm">
                          {code.activation_code}
                        </p>
                        <p className="text-xs text-ink-400 font-mono truncate">{code.scan_url}</p>
                      </div>
                      <span className="text-xs text-danger-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        Preview →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* All stickers table */}
        <div className="rounded-3xl bg-white border border-ink-100 shadow-sm overflow-hidden">
          <div className="px-6 sm:px-8 py-5 border-b border-ink-100">
            <h2 className="font-display text-xl font-black text-ink-950 mb-4">All QR codes</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search code, slug, owner, plate…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border-2 border-ink-200 bg-white pl-9 pr-4 py-2.5 text-sm text-ink-900 focus:outline-none focus:border-ink-800"
                />
              </div>
              {/* Status filter */}
              <div className="flex gap-2">
                {(["all", "activated", "unactivated", "suspended"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold capitalize transition-colors ${
                      filterStatus === f
                        ? "bg-ink-950 text-white"
                        : "border border-ink-200 text-ink-500 hover:bg-ink-50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loadingStickers ? (
            <div className="flex items-center justify-center py-20 gap-3 text-ink-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-medium">Loading codes…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <QrCode size={40} className="mx-auto text-ink-200 mb-3" />
              <p className="text-ink-400 text-sm font-medium">
                {search || filterStatus !== "all" ? "No codes match your search." : "No codes yet — generate your first batch above."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 border-b border-ink-100">
                  <tr>
                    {["Activation code", "URL slug", "Status", "Scan URL", "Owner", "Plate", "Scans", "Created"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-ink-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {filtered.map((s) => {
                    const scanUrl = `${baseUrl}/q/${s.qr_code}`;
                    return (
                      <tr key={s.id} className="hover:bg-ink-50 transition-colors">
                        <td className="px-5 py-3.5 font-display font-black tracking-[0.12em] text-ink-950 whitespace-nowrap">
                          {s.activation_code}
                          <CopyBtn text={s.activation_code} />
                        </td>
                        <td className="px-5 py-3.5 font-mono text-ink-500 whitespace-nowrap">
                          {s.qr_code}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="px-5 py-3.5 max-w-[200px]">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs text-ink-400 truncate">{scanUrl}</span>
                            <CopyBtn text={scanUrl} />
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-ink-700 whitespace-nowrap">
                          {s.owner_first_name || <span className="text-ink-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-ink-700 whitespace-nowrap">
                          {s.plate_number || <span className="text-ink-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-center font-bold text-ink-700">
                          {s.scan_count}
                        </td>
                        <td className="px-5 py-3.5 text-ink-400 text-xs whitespace-nowrap">
                          {new Date(s.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-ink-100 text-xs text-ink-400">
                Showing {filtered.length} of {stickers.length} codes
              </div>
            </div>
          )}
        </div>

        {/* How the QR link works */}
        <div className="rounded-3xl bg-ink-950 text-white p-6 sm:p-8">
          <h3 className="font-display text-lg font-black mb-4 text-white">How the scan URL works</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-4 items-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-danger-600 text-xs font-bold">1</span>
              <div>
                <p className="font-semibold text-white">QR encodes the scan URL</p>
                <p className="text-ink-400 font-mono text-xs mt-0.5">{baseUrl || "https://yourdomain.com"}/q/<span className="text-danger-400">XXXX</span></p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-danger-600 text-xs font-bold">2</span>
              <div>
                <p className="font-semibold text-white">Scanner lands on the page, which checks the DB</p>
                <p className="text-ink-400 text-xs mt-0.5">If unactivated → shows activation form. If activated → shows owner name + plate + 4 action buttons.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-danger-600 text-xs font-bold">3</span>
              <div>
                <p className="font-semibold text-white">The activation code (e.g. QRA-4X7K) is printed on the sticker</p>
                <p className="text-ink-400 text-xs mt-0.5">Owner uses it in the 3-step activation form to claim the QR. It never appears in the QR image itself.</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
