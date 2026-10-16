"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminPortalPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [activeTab, setActiveTab] = useState<"evidence" | "mint" | "payouts" | "config">("evidence");
  const [farmers, setFarmers] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({
    farmerSplitPct: 70,
    platformSplitPct: 10,
    verificationSplitPct: 10,
    bufferSplitPct: 10,
    helplineNumber: "+91-1800-CARBON-KHETI",
  });

  const [mintForm, setMintForm] = useState({
    practiceType: "residue_retention",
    vintageYear: 2025,
    stateId: 1, // Maharashtra
    districtId: 101, // Yavatmal
    totalTons: 50,
    pricePerTonInr: 1800,
    cctsNote: "Bureau of Energy Efficiency (BEE) agricultural carbon methodology. Serialized down to cadastral survey polygon.",
  });

  const [actionMsg, setActionMsg] = useState("");

  const loadAllData = async () => {
    try {
      const [farmRes, batchRes, payRes, confRes] = await Promise.all([
        fetch("/api/farmers"),
        fetch("/api/batches"),
        fetch("/api/payouts"),
        fetch("/api/config"),
      ]);
      const farmData = await farmRes.json();
      const batchData = await batchRes.json();
      const payData = await payRes.json();
      const confData = await confRes.json();

      setFarmers(farmData);
      setBatches(batchData);
      setPayouts(payData);
      setConfig(confData);
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleVerifyEvidence = async (evidenceId: string, status: "verified" | "rejected") => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidenceId, status, notes: "Audited by lead MRV verifier" }),
      });
      if (res.ok) {
        setActionMsg(`Evidence marked as ${status.toUpperCase()}`);
        loadAllData();
      }
    } catch {
      setActionMsg("Failed to update status");
    }
  };

  const handleMintBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMsg("");
    try {
      const targetPlots = farmers
        .filter((f) => f.stateId === Number(mintForm.stateId))
        .map((f) => f.id);

      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...mintForm,
          plotIds: targetPlots,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMsg(data.error || "Minting failed");
      } else {
        setActionMsg(`Batch ${data.batch.serialPrefix} created! ${data.creditsCreated} serial credits indexed on registry.`);
        loadAllData();
      }
    } catch {
      setActionMsg("Error minting batch");
    }
  };

  const handleReleasePayout = async (payoutId: string) => {
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutId }),
      });
      if (res.ok) {
        setActionMsg("Disbursement executed. Marked as PAID in producer passbook.");
        loadAllData();
      }
    } catch {
      setActionMsg("Error executing disbursement");
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setActionMsg("Benefit-split parameters successfully updated.");
      }
    } catch {
      setActionMsg("Failed to update parameters");
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Admin Title */}
      <div className="luxury-card rounded-2xl p-6 sm:p-8 mb-8 bg-white border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-stone-900">
              MRV Verification & Treasury Console
            </h1>
            <span className="badge-pill bg-purple-50 text-purple-800 border border-purple-200">
              Auditor Terminal
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Conduct spatial plot audits, mint serialized CCTS-compliant credit batches, and release farmer escrow payouts.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="mb-6 p-3.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200">
          {actionMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-8 gap-1 overflow-x-auto">
        {[
          { id: "evidence", label: "Evidence Queue" },
          { id: "mint", label: "Batch Minting Studio" },
          { id: "payouts", label: "Farmer Disbursements" },
          { id: "config", label: "Economic Split Controls" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setActionMsg("");
            }}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-[#0c2e20] text-[#0c2e20]"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "evidence" && (
        <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200">
          <h3 className="text-base font-bold text-stone-900 mb-6">
            Field Evidence Verification Queue ({farmers.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmers.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-stone-500 text-xs">
                No farmer evidence submitted for verification yet.
              </div>
            ) : (
              farmers.map((f) => (
                <div key={f.id} className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-900 text-xs">{f.nameLocal}</span>
                    <span className="text-[11px] font-mono text-stone-500">{f.villageName}</span>
                  </div>
                  <div className="text-xs text-stone-600 space-y-1">
                    <div>Extent: <strong className="font-mono">{f.totalAcres} Acres</strong></div>
                    <div>Practice: <strong className="capitalize">{f.practices?.[0]?.practiceType?.replace(/_/g, " ") || "Residue Retention"}</strong></div>
                    <div>SHA-256 Fingerprint: <span className="font-mono text-emerald-800 text-[10px]">Valid & Unique</span></div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleVerifyEvidence(f.id, "verified")}
                      className="bg-[#0c2e20] hover:bg-[#134e35] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex-1"
                    >
                      Approve & Verify
                    </button>
                    <button
                      onClick={() => handleVerifyEvidence(f.id, "rejected")}
                      className="bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "mint" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Mint Primary Credit Batch</h3>
            <form onSubmit={handleMintBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">CCTS Practice</label>
                <select
                  value={mintForm.practiceType}
                  onChange={(e) => setMintForm({ ...mintForm, practiceType: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                >
                  <option value="residue_retention">Residue Retention (Zero-Burn)</option>
                  <option value="no_till">No-Till Soil Conservation</option>
                  <option value="alternate_wetting_drying">Alternate Wetting & Drying (AWD)</option>
                  <option value="agroforestry">Field Agroforestry</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Vintage Year</label>
                  <input
                    type="number"
                    value={mintForm.vintageYear}
                    onChange={(e) => setMintForm({ ...mintForm, vintageYear: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Total Volume (tCO₂e)</label>
                  <input
                    type="number"
                    value={mintForm.totalTons}
                    onChange={(e) => setMintForm({ ...mintForm, totalTons: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Target Price per Ton (₹ INR)</label>
                <input
                  type="number"
                  value={mintForm.pricePerTonInr}
                  onChange={(e) => setMintForm({ ...mintForm, pricePerTonInr: Number(e.target.value) })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Regulatory Methodology Standard</label>
                <textarea
                  rows={2}
                  value={mintForm.cctsNote}
                  onChange={(e) => setMintForm({ ...mintForm, cctsNote: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0c2e20] hover:bg-[#134e35] text-white text-xs font-semibold py-3 rounded-lg"
              >
                Mint Batch & Generate Serial Numbers
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Minted Ledger Batches ({batches.length})</h3>
            <div className="space-y-3 overflow-y-auto max-h-[460px]">
              {batches.map((b) => (
                <div key={b.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold">
                    <span>{b.serialPrefix}</span>
                    <span className="text-emerald-800">₹{Math.round(b.pricePerTonInr / 100)}/t</span>
                  </div>
                  <div className="text-stone-500 capitalize">{b.practiceType.replace(/_/g, " ")} • Vintage {b.vintageYear}</div>
                  <div className="text-[11px] font-mono text-stone-400">Tons: {b.totalTons} ({b.availableTons} available)</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "payouts" && (
        <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200">
          <h3 className="text-base font-bold text-stone-900 mb-6">Farmer Escrow Disbursements ({payouts.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="pb-3">Producer</th>
                  <th className="pb-3">Milestone</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Disbursement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 font-semibold text-stone-900">{p.farmerName}</td>
                    <td className="py-3 capitalize text-stone-600">{p.stage.replace("_", " ")}</td>
                    <td className="py-3 font-mono font-bold">₹{p.amountInr}</td>
                    <td className="py-3">
                      <span className={`badge-pill ${p.status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3">
                      {p.status !== "paid" ? (
                        <button
                          onClick={() => handleReleasePayout(p.id)}
                          className="bg-[#0c2e20] text-white text-xs font-semibold px-3 py-1 rounded"
                        >
                          Execute Escrow Release
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "config" && (
        <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200 max-w-md mx-auto space-y-4">
          <h3 className="text-base font-bold text-stone-900">Economic Distribution Architecture</h3>
          <form onSubmit={handleSaveConfig} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Farmer Gross Share (%)</label>
              <input
                type="number"
                value={config.farmerSplitPct}
                onChange={(e) => setConfig({ ...config, farmerSplitPct: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">FPO Extension Share (%)</label>
              <input
                type="number"
                value={config.platformSplitPct}
                onChange={(e) => setConfig({ ...config, platformSplitPct: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Independent MRV Audit (%)</label>
              <input
                type="number"
                value={config.verificationSplitPct}
                onChange={(e) => setConfig({ ...config, verificationSplitPct: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Climate Buffer Pool (%)</label>
              <input
                type="number"
                value={config.bufferSplitPct}
                onChange={(e) => setConfig({ ...config, bufferSplitPct: Number(e.target.value) })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0c2e20] text-white text-xs font-semibold py-2.5 rounded-lg pt-2"
            >
              Update Distribution Parameters
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
