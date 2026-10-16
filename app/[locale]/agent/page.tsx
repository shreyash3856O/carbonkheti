"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AgentPortalPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [activeTab, setActiveTab] = useState<"onboard" | "list">("onboard");
  const [farmers, setFarmers] = useState<any[]>([]);
  const [references, setReferences] = useState<{
    states: any[];
    districts: any[];
    practices: any[];
    crops: any[];
  }>({ states: [], districts: [], practices: [], crops: [] });

  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState({
    nameLocal: "",
    nameEn: "",
    phone: "",
    stateId: 1, // Maharashtra
    districtId: 101, // Yavatmal
    taluka: "",
    villageName: "",
    upiId: "",
    bankAccountMasked: "",
    ifscCode: "",
    plotName: "Plot Alpha",
    surveyNumber: "",
    areaValue: "3.5",
    areaUnit: "acres",
    centerLat: "20.3888",
    centerLng: "78.1204",
    baselineYear: 2024,
    baselineTillage: "conventional",
    baselineResidue: "burned",
    baselineFertilizer: "chemical_urea",
    baselineIrrigation: "flood",
    targetPracticeType: "residue_retention",
    seasonYear: 2025,
    seasonLabel: "Kharif 2025",
    consentDataUsage: true,
    consentCoolingOff: true,
    consentPhoto: false,
    storyText: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const [refRes, farmRes] = await Promise.all([
          fetch("/api/references"),
          fetch("/api/farmers"),
        ]);
        const refData = await refRes.json();
        const farmData = await farmRes.json();
        setReferences(refData);
        setFarmers(farmData);
      } catch (err) {
        console.error("Error loading agent references:", err);
      }
    }
    init();
  }, []);

  const availableDistricts = references.districts.filter(
    (d) => d.stateId === Number(formData.stateId)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/farmers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          enrolledByAgentId: "agent-field-01",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Enrollment failed");
      } else {
        setSubmitResult(data);
        const farmRes = await fetch("/api/farmers");
        const farmData = await farmRes.json();
        setFarmers(farmData);
      }
    } catch {
      setErrorMsg("Network error during farmer enrollment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Top Header */}
      <div className="luxury-card rounded-2xl p-6 sm:p-8 mb-8 bg-white border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-stone-900">
              FPO Field Extension & Onboarding
            </h1>
            <span className="badge-pill bg-emerald-50 text-emerald-800 border border-emerald-200">
              Agent Terminal
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Conduct 3-year historical baseline audits, verify practice additionality, and log DPDP Act consent.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab("onboard");
              setSubmitResult(null);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "onboard"
                ? "bg-[#0c2e20] text-white"
                : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            New Producer Onboarding
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "list"
                ? "bg-[#0c2e20] text-white"
                : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            Enrolled Directory ({farmers.length})
          </button>
        </div>
      </div>

      {activeTab === "onboard" && (
        <div className="luxury-card rounded-2xl p-8 bg-white border border-stone-200 max-w-2xl mx-auto">
          {submitResult ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-stone-900">
                Farmer Enrolled Successfully
              </h2>
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-stone-500">Name:</span>
                  <span className="font-semibold text-stone-900">{submitResult.farmer.nameLocal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Survey Plot:</span>
                  <span className="font-mono font-semibold text-stone-900">
                    #{submitResult.plot.surveyNumber} ({submitResult.plot.areaAcres} Acres)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Target Practice:</span>
                  <span className="font-semibold capitalize text-emerald-800">
                    {submitResult.practice?.practiceType?.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Additionality Assessment:</span>
                  <span className="font-bold text-emerald-800">
                    {submitResult.additionalityPassed ? "PASSED (New Practice)" : "FLAGGED FOR REVIEW"}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSubmitResult(null);
                    setWizardStep(1);
                  }}
                  className="bg-[#0c2e20] text-white text-xs font-semibold px-4 py-2.5 rounded-lg"
                >
                  Enroll Next Farmer
                </button>
                <Link
                  href={`/${locale}/farmer`}
                  className="bg-stone-100 text-stone-800 text-xs font-semibold px-4 py-2.5 rounded-lg border border-stone-300"
                >
                  View in Passbook
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Stepper */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                {[
                  { num: 1, label: "Identity" },
                  { num: 2, label: "Plot Geometry" },
                  { num: 3, label: "Baseline" },
                  { num: 4, label: "Practice" },
                  { num: 5, label: "DPDP Consent" },
                ].map((s) => (
                  <div
                    key={s.num}
                    onClick={() => setWizardStep(s.num)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        wizardStep === s.num
                          ? "bg-[#0c2e20] text-white"
                          : wizardStep > s.num
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {wizardStep > s.num ? "✓" : s.num}
                    </div>
                    <span className="text-xs font-medium text-stone-600 hidden sm:inline">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-800 text-xs font-semibold rounded-lg">
                  {errorMsg}
                </div>
              )}

              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900">Farmer Identity & Location</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.nameLocal}
                        onChange={(e) => setFormData({ ...formData, nameLocal: e.target.value })}
                        placeholder="e.g. Ramesh Tukaram Patil"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile (+91) *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                        placeholder="9876543210"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">State *</label>
                      <select
                        value={formData.stateId}
                        onChange={(e) => setFormData({ ...formData, stateId: Number(e.target.value) })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        {references.states.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">District *</label>
                      <select
                        value={formData.districtId}
                        onChange={(e) => setFormData({ ...formData, districtId: Number(e.target.value) })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        {availableDistricts.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Taluka</label>
                      <input
                        type="text"
                        value={formData.taluka}
                        onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                        placeholder="e.g. Ralegaon"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Village Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.villageName}
                        onChange={(e) => setFormData({ ...formData, villageName: e.target.value })}
                        placeholder="e.g. Wadgaon"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="bg-[#0c2e20] text-white text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Next: Land Survey →
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900">Plot Geometry & Survey Number</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Survey / Khasra # *</label>
                      <input
                        type="text"
                        required
                        value={formData.surveyNumber}
                        onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                        placeholder="e.g. 142/2A"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Area (Acres) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.areaValue}
                        onChange={(e) => setFormData({ ...formData, areaValue: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Centroid Latitude</label>
                      <input
                        type="text"
                        value={formData.centerLat}
                        onChange={(e) => setFormData({ ...formData, centerLat: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Centroid Longitude</label>
                      <input
                        type="text"
                        value={formData.centerLng}
                        onChange={(e) => setFormData({ ...formData, centerLng: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="bg-stone-100 text-stone-700 text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="bg-[#0c2e20] text-white text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Next: Baseline Audit →
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900">3-Year Historical Baseline (2022–2024)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Tillage History</label>
                      <select
                        value={formData.baselineTillage}
                        onChange={(e) => setFormData({ ...formData, baselineTillage: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="conventional">Conventional (Deep disc ploughing)</option>
                        <option value="reduced">Reduced Tillage</option>
                        <option value="no_till">Zero Tillage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Residue Management</label>
                      <select
                        value={formData.baselineResidue}
                        onChange={(e) => setFormData({ ...formData, baselineResidue: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="burned">Open Field Burning</option>
                        <option value="removed">Removed from Field</option>
                        <option value="incorporated">Rotavator Incorporated</option>
                        <option value="retained">Retained Surface Mulch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Fertilizer Regime</label>
                      <select
                        value={formData.baselineFertilizer}
                        onChange={(e) => setFormData({ ...formData, baselineFertilizer: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="chemical_urea">Chemical Intensive (Urea/DAP)</option>
                        <option value="chemical_mixed">Mixed Chemical & Organic</option>
                        <option value="organic_fym">Farmyard Manure / Organic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Irrigation Method</label>
                      <select
                        value={formData.baselineIrrigation}
                        onChange={(e) => setFormData({ ...formData, baselineIrrigation: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="flood">Continuous Flood Irrigation</option>
                        <option value="rainfed">Purely Rainfed</option>
                        <option value="drip">Drip / Micro-irrigation</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="bg-stone-100 text-stone-700 text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="bg-[#0c2e20] text-white text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Next: Target Practice →
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900">Select Practice & Check Additionality</h3>
                  <div className="space-y-2">
                    {references.practices.map((p) => {
                      const isConflict =
                        (p.code === "no_till" && formData.baselineTillage === "no_till") ||
                        (p.code === "residue_retention" && formData.baselineResidue === "retained");

                      return (
                        <div
                          key={p.code}
                          onClick={() => setFormData({ ...formData, targetPracticeType: p.code })}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            formData.targetPracticeType === p.code
                              ? "border-[#0c2e20] bg-emerald-50/50 ring-1 ring-[#0c2e20]"
                              : "border-stone-200 hover:bg-stone-50"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-xs text-stone-900">{p.name}</span>
                            <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              ~{p.carbonEstTonsPerAcreYear} tCO₂e/ac/yr
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">{p.description}</p>
                          {isConflict && (
                            <span className="text-[10px] text-red-600 font-bold block mt-1">
                              Fails additionality: already present in historical baseline.
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="bg-stone-100 text-stone-700 text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(5)}
                      className="bg-[#0c2e20] text-white text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      Next: Consent Validation →
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-stone-900">DPDP Act (2023) Legal Consents</h3>
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consentDataUsage}
                        onChange={(e) => setFormData({ ...formData, consentDataUsage: e.target.checked })}
                        required
                        className="mt-0.5 rounded text-emerald-800"
                      />
                      <span className="text-stone-700">
                        <strong>Data Processing Mandate:</strong> The farmer was explained how plot coordinates and practice evidence are recorded on the registry under India&apos;s DPDP Act.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consentCoolingOff}
                        onChange={(e) => setFormData({ ...formData, consentCoolingOff: e.target.checked })}
                        required
                        className="mt-0.5 rounded text-emerald-800"
                      />
                      <span className="text-stone-700">
                        <strong>15-Day Cooling-Off Notice:</strong> The farmer was informed of their statutory right to withdraw enrollment within 15 days without penalty.
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="bg-stone-100 text-stone-700 text-xs font-semibold px-4 py-2 rounded-lg"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#0c2e20] hover:bg-[#134e35] text-white text-xs font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
                    >
                      {loading ? "Recording Onboarding..." : "Complete Enrollment"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      )}

      {activeTab === "list" && (
        <div className="luxury-card rounded-2xl p-6 sm:p-8 bg-white border border-stone-200">
          <h3 className="text-lg font-bold text-stone-900 mb-6">
            Enrolled Smallholder Directory ({farmers.length})
          </h3>

          {farmers.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              No farmers currently recorded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold">
                    <th className="pb-3">Producer</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Survey Extent</th>
                    <th className="pb-3">Enrolled Practice</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {farmers.map((f) => (
                    <tr key={f.id}>
                      <td className="py-3 font-semibold text-stone-900">{f.nameLocal}</td>
                      <td className="py-3 text-stone-600">{f.villageName}, State #{f.stateId}</td>
                      <td className="py-3 font-mono">{f.plotCount} plot ({f.totalAcres} ac)</td>
                      <td className="py-3 capitalize text-emerald-800">
                        {f.practices?.[0]?.practiceType?.replace(/_/g, " ") || "Pending"}
                      </td>
                      <td className="py-3">
                        <span className="badge-pill bg-emerald-50 text-emerald-800">Verified</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
