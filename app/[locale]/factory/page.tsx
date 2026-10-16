"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function FactoryMarketplacePage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  const [tonsRequested, setTonsRequested] = useState<number>(25);
  const [companyName, setCompanyName] = useState<string>("Tata Steel Limited");
  const [purchasing, setPurchasing] = useState(false);
  const [orderResult, setOrderResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    try {
      const res = await fetch("/api/batches");
      const data = await res.json();
      setBatches(data);
      if (data.length > 0) {
        setSelectedBatch(data[0]);
      }
    } catch (err) {
      console.error("Error loading batches:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setErrorMsg("");
    setPurchasing(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          batchId: selectedBatch.id,
          tonsRequested: Number(tonsRequested),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Order failed");
      } else {
        setOrderResult(data.order);
        await loadData();
      }
    } catch {
      setErrorMsg("Network error during procurement");
    } finally {
      setPurchasing(false);
    }
  };

  const pricePerTonInr = selectedBatch ? Math.round(selectedBatch.pricePerTonInr / 100) : 1800;
  const subtotalInr = tonsRequested * pricePerTonInr;
  const gstInr = Math.round(subtotalInr * 0.18);
  const totalInr = subtotalInr + gstInr;
  const farmerPoolInr = Math.round(subtotalInr * 0.7);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Editorial Header */}
      <div className="luxury-card rounded-2xl p-8 mb-10 bg-white border border-stone-200">
        <div className="max-w-3xl space-y-2">
          <span className="badge-pill bg-emerald-50 text-emerald-800 border border-emerald-200">
            Institutional Carbon Procurement
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Traceable Agricultural Carbon Credits for Enterprise ESG
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
            Procure serialized, audited carbon offsets originating directly from verified Indian farmer
            collectives. 70% of gross invoice value routes directly to smallholder producers.
          </p>
        </div>
      </div>

      {orderResult ? (
        <div className="luxury-card rounded-2xl p-8 sm:p-10 border border-emerald-300 max-w-2xl mx-auto bg-white space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <span className="badge-pill bg-emerald-100 text-emerald-800">
              Procurement Order Confirmed
            </span>
            <h2 className="text-2xl font-bold text-stone-900">
              Pro-Forma Invoice #{orderResult.invoiceNumber}
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-stone-500">Procuring Entity:</span>
              <span className="font-semibold text-stone-900">{orderResult.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Volume Acquired:</span>
              <span className="font-mono font-bold text-stone-900">{orderResult.tonsRequested} tCO₂e</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Price per Ton:</span>
              <span className="font-mono text-stone-900">₹{Math.round(orderResult.pricePerTonInrPaise / 100)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Subtotal:</span>
              <span className="font-mono font-bold text-stone-900">
                ₹{Math.round(orderResult.totalAmountInrPaise / 100).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 text-emerald-800 font-bold">
              <span>Guaranteed Direct Farmer Allocation (70%):</span>
              <span className="font-mono">
                ₹{Math.round((orderResult.totalAmountInrPaise * 0.7) / 100).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setOrderResult(null)}
              className="bg-[#0c2e20] text-white text-xs font-semibold px-4 py-2.5 rounded-lg"
            >
              Procure Additional Batches
            </button>
            <Link
              href={`/${locale}/registry`}
              className="bg-stone-100 text-stone-800 text-xs font-semibold px-4 py-2.5 rounded-lg border border-stone-300"
            >
              Verify in Public Ledger
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Batches List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-bold text-stone-900">
              Verified Primary Batches ({batches.length})
            </h2>

            {batches.length === 0 ? (
              <div className="luxury-card rounded-2xl p-12 text-center text-stone-500 text-xs bg-white">
                No credit batches minted in database yet. Batches appear here after auditor MRV verification.
              </div>
            ) : (
              <div className="space-y-3">
                {batches.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBatch(b)}
                    className={`luxury-card rounded-xl p-5 cursor-pointer transition-all border ${
                      selectedBatch?.id === b.id
                        ? "border-[#0c2e20] ring-1 ring-[#0c2e20] bg-emerald-50/20"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-800">{b.serialPrefix}</span>
                        <span className="badge-pill bg-stone-100 text-stone-700">Vintage {b.vintageYear}</span>
                      </div>
                      <div className="font-mono font-bold text-sm text-[#0c2e20]">
                        ₹{Math.round(b.pricePerTonInr / 100)} / tCO₂e
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 capitalize mb-1">
                      {b.practiceType.replace(/_/g, " ")}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2">{b.cctsNote}</p>

                    <div className="flex justify-between items-center pt-3 border-t border-stone-100 text-xs text-stone-500 mt-2">
                      <span>Available: <strong>{b.availableTons} tons</strong></span>
                      <span className="text-emerald-800 font-semibold">
                        {selectedBatch?.id === b.id ? "Selected" : "Select Batch →"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Acquisition Desk (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200 sticky top-24 space-y-4">
              <h3 className="text-base font-bold text-stone-900">Procurement Terminal</h3>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-800 text-xs font-semibold rounded-lg">
                  {errorMsg}
                </div>
              )}

              {selectedBatch ? (
                <form onSubmit={handleBuy} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Entity Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Volume (tCO₂e)</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedBatch.availableTons || 1000}
                      value={tonsRequested}
                      onChange={(e) => setTonsRequested(Number(e.target.value))}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                    <div className="flex justify-between text-stone-600">
                      <span>Base Carbon Price:</span>
                      <span className="font-mono">₹{subtotalInr.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>GST (18% Statutory Rate):</span>
                      <span className="font-mono">₹{gstInr.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200">
                      <span>Total Invoice:</span>
                      <span className="font-mono text-sm">₹{totalInr.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold pt-1">
                      <span>Direct Farmer Escrow (70%):</span>
                      <span className="font-mono">₹{farmerPoolInr.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={purchasing || selectedBatch.availableTons <= 0}
                    className="w-full bg-[#0c2e20] hover:bg-[#134e35] text-white text-xs font-semibold py-3 rounded-lg disabled:opacity-50 transition-all"
                  >
                    {purchasing ? "Minting Order..." : `Execute Procurement (₹${totalInr.toLocaleString("en-IN")})`}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 text-xs text-stone-400">
                  Select a verified batch from the primary market.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
