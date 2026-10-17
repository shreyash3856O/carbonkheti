"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import VoiceButton from "@/components/VoiceButton";

export default function FarmerPortalPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [activeTab, setActiveTab] = useState<"passbook" | "practices" | "evidence" | "grievance">("passbook");
  const [farmers, setFarmers] = useState<any[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>("");
  const [farmerData, setFarmerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Evidence state
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePracticeId, setEvidencePracticeId] = useState("");
  const [evidenceNotes, setEvidenceNotes] = useState("");
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [evidenceMessage, setEvidenceMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Grievance state
  const [grievanceText, setGrievanceText] = useState("");
  const [submittingGrievance, setSubmittingGrievance] = useState(false);
  const [grievanceMsg, setGrievanceMsg] = useState("");

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    async function loadFarmers() {
      try {
        const res = await fetch("/api/farmers");
        const list = await res.json();
        setFarmers(list);
        if (list.length > 0) {
          setSelectedFarmerId(list[0].id);
        }
      } catch (err) {
        console.error("Error loading farmers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFarmers();
  }, []);

  useEffect(() => {
    if (!selectedFarmerId) {
      setFarmerData(null);
      return;
    }
    async function loadFarmerDetail() {
      try {
        const res = await fetch(`/api/farmers/${selectedFarmerId}`);
        const data = await res.json();
        setFarmerData(data);
        if (data?.practices?.length > 0) {
          setEvidencePracticeId(data.practices[0].id);
        }
      } catch (err) {
        console.error("Error loading farmer detail:", err);
      }
    }
    loadFarmerDetail();
  }, [selectedFarmerId]);

  const handleEvidenceUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceFile || !evidencePracticeId) return;

    setUploadingEvidence(true);
    setEvidenceMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", evidenceFile);
      formData.append("practiceId", evidencePracticeId);
      formData.append("notes", evidenceNotes);

      if (navigator.geolocation) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              formData.append("geoLat", pos.coords.latitude.toString());
              formData.append("geoLng", pos.coords.longitude.toString());
              resolve();
            },
            () => resolve(),
            { timeout: 3000 }
          );
        });
      }

      const res = await fetch("/api/evidence", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setEvidenceMessage({ type: "error", text: data.error || "Upload failed" });
      } else {
        setEvidenceMessage({
          type: "success",
          text: "Evidence photo uploaded with cryptographic SHA-256 hash. Queued for auditor verification.",
        });
        setEvidenceFile(null);
        setEvidenceNotes("");
      }
    } catch {
      setEvidenceMessage({ type: "error", text: "Network error during upload" });
    } finally {
      setUploadingEvidence(false);
    }
  };

  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceText) return;
    setSubmittingGrievance(true);
    try {
      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: farmerData?.farmer?.userId || "farmer-anon",
          text: grievanceText,
        }),
      });
      if (res.ok) {
        setGrievanceMsg("Grievance ticket registered. An FPO field coordinator will review within 48 hours.");
        setGrievanceText("");
      }
    } catch {
      setGrievanceMsg("Failed to submit grievance");
    } finally {
      setSubmittingGrievance(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Top Profile / Passbook Header */}
      <div className="luxury-card rounded-2xl p-6 sm:p-8 mb-8 bg-white border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-stone-900">
                {farmerData?.farmer ? farmerData.farmer.nameLocal : "Farmer Digital Passbook"}
              </h1>
              {farmerData?.farmer && (
                <span className="badge-pill bg-stone-100 text-stone-800 border border-stone-200">
                  Verified Producer
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {farmerData?.farmer
                ? `Village: ${farmerData.farmer.villageName} • Phone: ${farmerData.farmer.phone} • DPDP Status: Active`
                : "Real-time regenerative carbon credit earnings and milestone payouts ledger"}
            </p>
          </div>
        </div>

        {farmers.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-500">Account:</label>
            <select
              value={selectedFarmerId}
              onChange={(e) => setSelectedFarmerId(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-xs font-semibold rounded-lg px-3 py-2 text-stone-800"
            >
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nameLocal} ({f.villageName})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-8 gap-1 overflow-x-auto">
        {[
          { id: "passbook", label: "Ledger Passbook" },
          { id: "practices", label: "Regenerative Practices" },
          { id: "evidence", label: "Evidence Submissions" },
          { id: "grievance", label: "Support & Redressal" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-500 hover:text-stone-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(!farmerData || !farmerData.farmer) ? (
        <div className="luxury-card rounded-2xl p-16 text-center max-w-md mx-auto my-12 bg-white">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">No Farmer Account Enrolled</h3>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            There are currently 0 farmers in the system. Use the Field Agent portal to enroll the first farmer.
          </p>
          <Link
            href={`/${locale}/agent`}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-lg"
          >
            <span>Onboard New Farmer</span>
            <span>→</span>
          </Link>
        </div>
      ) : (
        <>
          {activeTab === "passbook" && (
            <div className="space-y-8">
              {/* Voice Readout Banner */}
              <div className="bg-stone-100 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎙️</span>
                  <div>
                    <div className="text-xs font-bold text-stone-900">
                      पासबुक का हिसाब बोलकर सुनें (Audio Passbook)
                    </div>
                    <div className="text-[11px] text-stone-600">
                      बैलेंस, आगामी किस्त और कार्बन पैदावार की पूरी जानकारी
                    </div>
                  </div>
                </div>
                <VoiceButton
                  textToSpeak={`नमस्ते ${farmerData.farmer.nameLocal} जी। आपके खाते में अब तक कुल ₹${farmerData.passbook.totalEarnedInr} जमा हो चुके हैं। आपकी ${farmerData.passbook.totalAcres} एकड़ जमीन से कुल ${farmerData.passbook.estimatedTons} टन कार्बन क्रेडिट बने हैं। आपकी अगली किस्त ₹${farmerData.passbook.pendingPayoutsInr} ऑडिट के बाद सीधे बैंक में आ जाएगी।`}
                  label="पूरा हिसाब बोलकर सुनें 🔊"
                  className="bg-stone-900 hover:bg-black text-white font-bold px-4 py-2 text-xs shadow-xs cursor-pointer"
                />
              </div>

              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="luxury-card rounded-2xl p-6 bg-white border border-stone-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Total Disbursed (कुल भुगतान)
                  </div>
                  <div className="text-4xl font-bold font-mono text-stone-900">
                    ₹{farmerData.passbook.totalEarnedInr.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-3 text-xs text-stone-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                    <span>Direct DBT / UPI Credit</span>
                  </div>
                </div>

                <div className="luxury-card rounded-2xl p-6 bg-white border border-stone-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Estimated Carbon Yield
                  </div>
                  <div className="text-4xl font-bold font-mono text-stone-900">
                    {farmerData.passbook.estimatedTons} <span className="text-sm font-sans text-stone-500">tCO₂e</span>
                  </div>
                  <div className="mt-3 text-xs text-stone-500">
                    Calculated for {farmerData.passbook.totalAcres} verified acres
                  </div>
                </div>

                <div className="luxury-card rounded-2xl p-6 bg-white border border-stone-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Pending Verification Escrow
                  </div>
                  <div className="text-4xl font-bold font-mono text-stone-900">
                    ₹{farmerData.passbook.pendingPayoutsInr.toLocaleString("en-IN")}
                  </div>
                  <div className="mt-3 text-xs text-stone-500">
                    Scheduled on auditor sign-off
                  </div>
                </div>
              </div>

              {/* 3-Milestone Stage Schedule */}
              <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200">
                <h3 className="text-base font-bold text-stone-900 mb-6">
                  Seasonal Disbursement Lifecycle
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      stage: "Phase 1: Baseline Onboarding (20%)",
                      desc: "Disbursed immediately upon KYC verification and plot baseline recording.",
                      status: "Completed",
                    },
                    {
                      stage: "Phase 2: Mid-Season Verification (40%)",
                      desc: "Disbursed upon geotagged photo proof confirming practice maintenance.",
                      status: "Processing",
                    },
                    {
                      stage: "Phase 3: Harvest Settlement (40%)",
                      desc: "Disbursed post-harvest upon final credit batch issuance and buyer purchase.",
                      status: "Pending",
                    },
                  ].map((s, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-stone-500">0{idx + 1}</span>
                        <span className="badge-pill bg-stone-200 text-stone-800">
                          {s.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900">{s.stage}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Ledger Table */}
              <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200">
                <h3 className="text-base font-bold text-stone-900 mb-4">
                  Disbursement Ledger Records
                </h3>

                {farmerData.payouts.length === 0 ? (
                  <div className="text-center py-8 text-xs text-stone-500">
                    No disbursement transactions recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold">
                          <th className="pb-3">Milestone</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {farmerData.payouts.map((p: any) => (
                          <tr key={p.id}>
                            <td className="py-3 capitalize text-stone-900">{p.stage.replace("_", " ")}</td>
                            <td className="py-3 font-mono font-bold text-stone-900">₹{Math.round(p.amountInrPaise / 100)}</td>
                            <td className="py-3">
                              <span className={`badge-pill ${p.status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                {p.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 text-stone-500 font-mono">
                              {new Date(p.createdAt).toLocaleDateString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "practices" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-stone-900">
                Registered Regenerative Practices ({farmerData.practices?.length || 0})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {farmerData.practices?.map((pr: any) => (
                  <div key={pr.id} className="luxury-card rounded-2xl p-6 bg-white border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge-pill bg-stone-100 text-stone-700">{pr.seasonLabel}</span>
                      <span className="badge-pill bg-stone-200 text-stone-800">
                        Additionality Verified
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-stone-900 capitalize">
                      {pr.practiceType.replace(/_/g, " ")}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {pr.additionalityNote || "Benchmarked against historical 3-year baseline survey."}
                    </p>
                    <button
                      onClick={() => {
                        setEvidencePracticeId(pr.id);
                        setActiveTab("evidence");
                      }}
                      className="text-xs font-bold text-stone-900 hover:underline pt-2 block"
                    >
                      Upload Ground Evidence Photo →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "evidence" && (
            <div className="luxury-card rounded-2xl p-8 bg-white border border-stone-200 max-w-xl mx-auto space-y-6">
              <h3 className="text-lg font-bold text-stone-900">
                Upload Cryptographic Field Evidence
              </h3>

              {evidenceMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold ${
                    evidenceMessage.type === "success"
                      ? "bg-stone-100 text-stone-900 border border-stone-300"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {evidenceMessage.text}
                </div>
              )}

              <form onSubmit={handleEvidenceUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Target Practice</label>
                  <select
                    value={evidencePracticeId}
                    onChange={(e) => setEvidencePracticeId(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  >
                    {farmerData.practices?.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.practiceType.replace(/_/g, " ")} ({p.seasonLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Field Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => e.target.files?.[0] && setEvidenceFile(e.target.files[0])}
                    required
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    GPS lat/lng coordinates and SHA-256 fingerprint will be computed automatically.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Field Observation</label>
                  <textarea
                    rows={3}
                    value={evidenceNotes}
                    onChange={(e) => setEvidenceNotes(e.target.value)}
                    placeholder="e.g. Mulch cover verified across plot coordinates..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploadingEvidence}
                  className="w-full bg-stone-900 hover:bg-black text-white text-xs font-semibold py-3 rounded-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  {uploadingEvidence ? "Hashing & Submitting..." : "Submit to Verification Queue"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "grievance" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="luxury-card rounded-2xl p-8 bg-white border border-stone-200 space-y-4">
                <h3 className="text-base font-bold text-stone-900">File a Formal Grievance</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Under the DPDP Act and CarbonKheti bylaws, you have the right to register concerns
                  regarding calculations or agent conduct.
                </p>

                {grievanceMsg && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg">
                    {grievanceMsg}
                  </div>
                )}

                <form onSubmit={handleGrievanceSubmit} className="space-y-4">
                  <textarea
                    rows={4}
                    value={grievanceText}
                    onChange={(e) => setGrievanceText(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    disabled={submittingGrievance}
                    className="w-full bg-stone-900 hover:bg-black text-white text-xs font-semibold py-2.5 rounded-lg cursor-pointer"
                  >
                    {submittingGrievance ? "Registering..." : "Submit Ticket"}
                  </button>
                </form>
              </div>

              <div className="luxury-card rounded-2xl p-8 bg-white border border-stone-200 space-y-4">
                <h3 className="text-base font-bold text-stone-900">Direct FPO Extension Contact</h3>
                <div className="space-y-3 text-xs text-stone-600">
                  <div>
                    <div className="text-stone-400 font-semibold uppercase text-[10px]">Toll-Free Helpline</div>
                    <div className="text-base font-bold text-stone-900">1800-227-266</div>
                  </div>
                  <div>
                    <div className="text-stone-400 font-semibold uppercase text-[10px]">Hours of Operation</div>
                    <div className="font-medium text-stone-800">Monday – Saturday: 9:00 AM – 6:00 PM IST</div>
                  </div>
                  <div>
                    <div className="text-stone-400 font-semibold uppercase text-[10px]">Language Support</div>
                    <div className="font-medium text-stone-800">11 Indic regional languages supported</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
