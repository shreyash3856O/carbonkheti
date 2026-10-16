"use client";

import { useState } from "react";
import Link from "next/link";

interface DynamicEcosystemProps {
  locale: string;
}

export default function DynamicEcosystemConsole({ locale }: DynamicEcosystemProps) {
  const [activeRole, setActiveRole] = useState<"farmer" | "fpo" | "factory">("farmer");
  const [acres, setAcres] = useState<number>(4);
  const [practice, setPractice] = useState<"residue" | "awd" | "notill" | "agro">("residue");
  const [factoryTons, setFactoryTons] = useState<number>(150);

  // Carbon coefficient per acre
  const practiceCoefficients: Record<string, { name: string; rate: number; desc: string }> = {
    residue: {
      name: "Residue Retention (Zero-Burn)",
      rate: 1.2,
      desc: "Surface mulching with Happy Seeder replacing open stubble fire.",
    },
    awd: {
      name: "Alternate Wetting & Drying (AWD)",
      rate: 1.5,
      desc: "Controlled intermittent drainage in paddy suppressing methanogenesis.",
    },
    notill: {
      name: "Zero-Till Soil Conservation",
      rate: 0.8,
      desc: "Direct seeding preserving soil organic carbon and mycorrhizal fungi.",
    },
    agro: {
      name: "Boundary Agroforestry",
      rate: 2.0,
      desc: "Fast-growing indigenous trees sequestering deep biomass carbon.",
    },
  };

  // Farmer calculations
  const selectedPractice = practiceCoefficients[practice];
  const estTons = Math.round(acres * selectedPractice.rate * 10) / 10;
  const pricePerTon = 1800;
  const grossFarmerRevenue = Math.round(estTons * pricePerTon * 0.7);
  const phase1 = Math.round(grossFarmerRevenue * 0.2);
  const phase2 = Math.round(grossFarmerRevenue * 0.4);
  const phase3 = grossFarmerRevenue - phase1 - phase2;

  // Factory calculations
  const factorySubtotal = factoryTons * pricePerTon;
  const factoryGst = Math.round(factorySubtotal * 0.18);
  const factoryTotal = factorySubtotal + factoryGst;
  const factoryFarmerDirect = Math.round(factorySubtotal * 0.7);

  return (
    <div className="w-full luxury-card rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-sm">
      {/* Dynamic Segmented Navigation Header */}
      <div className="bg-stone-50 border-b border-stone-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Interactive Ecosystem Terminal
          </span>
        </div>

        {/* 3 Role Switchers */}
        <div className="flex bg-stone-200/70 p-1 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveRole("farmer")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeRole === "farmer"
                ? "bg-[#0c2e20] text-white shadow-sm"
                : "text-stone-700 hover:text-stone-950"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
            </svg>
            <span>Smallholder Farmer</span>
          </button>

          <button
            onClick={() => setActiveRole("fpo")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeRole === "fpo"
                ? "bg-[#0c2e20] text-white shadow-sm"
                : "text-stone-700 hover:text-stone-950"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>FPO & Cooperative</span>
          </button>

          <button
            onClick={() => setActiveRole("factory")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeRole === "factory"
                ? "bg-[#0c2e20] text-white shadow-sm"
                : "text-stone-700 hover:text-stone-950"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Industrial Buyer</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content Panel */}
      <div className="p-6 sm:p-10">
        {/* ROLE 1: FARMER DYNAMIC CONSOLE */}
        {activeRole === "farmer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Interactive Inputs */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="badge-pill bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Live Producer Simulator
                </span>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">
                  Calculate Your Soil Carbon Revenue
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Adjust land extent and choose your adopted practice to see guaranteed direct DBT earnings.
                </p>
              </div>

              {/* Land Extent Slider */}
              <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-700">Land Extent</span>
                  <span className="font-mono font-bold text-base text-[#0c2e20]">
                    {acres} Acres ({Math.round(acres * 0.404686 * 10) / 10} Hectares)
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={0.5}
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#0c2e20]"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>1 Acre</span>
                  <span>10 Acres</span>
                  <span>25 Acres</span>
                </div>
              </div>

              {/* Practice selector buttons */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700 block">
                  Regenerative Practice:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(practiceCoefficients) as (keyof typeof practiceCoefficients)[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setPractice(key as any)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        practice === key
                          ? "border-[#0c2e20] bg-emerald-50 text-[#0c2e20] font-bold ring-1 ring-[#0c2e20]"
                          : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 font-medium"
                      }`}
                    >
                      <div className="truncate">{practiceCoefficients[key].name}</div>
                      <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                        +{practiceCoefficients[key].rate} tCO₂e/ac/yr
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${locale}/farmer`}
                  className="inline-flex items-center gap-2 bg-[#0c2e20] hover:bg-[#134e35] text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-sm transition-all"
                >
                  <span>Open Full Digital Passbook</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Dynamic Results Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-emerald-950 to-[#071a12] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex justify-between items-center pb-4 border-b border-emerald-900/60">
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  ESTIMATED ANNUAL RETURN
                </span>
                <span className="badge-pill bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  70% Direct Payout
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-stone-300">Annual Net Earnings</div>
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-white mt-1">
                    ₹{grossFarmerRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1">Direct to Bank via UPI</div>
                </div>

                <div>
                  <div className="text-xs text-stone-300">Carbon Credited</div>
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-emerald-400 mt-1">
                    {estTons} <span className="text-sm font-sans font-normal text-stone-300">tCO₂e</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Verified serial units</div>
                </div>
              </div>

              {/* 3 Milestone Payout preview */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  3-Stage Milestone Disbursement Schedule
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="text-[10px] text-stone-400">Phase 1: KYC (20%)</div>
                    <div className="font-mono font-bold text-emerald-300 mt-1">₹{phase1.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="text-[10px] text-stone-400">Phase 2: Photo (40%)</div>
                    <div className="font-mono font-bold text-emerald-300 mt-1">₹{phase2.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="text-[10px] text-stone-400">Phase 3: Audit (40%)</div>
                    <div className="font-mono font-bold text-emerald-300 mt-1">₹{phase3.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROLE 2: FPO & COOPERATIVE CONSOLE */}
        {activeRole === "fpo" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div>
                <span className="badge-pill bg-amber-50 text-amber-900 border border-amber-200">
                  Cadastral Aggregation & Extension
                </span>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">
                  Decentralized MRV for Field Extension Teams
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-1">
                  Empower rural extension workers with cadastral boundary walking, offline photo proof with
                  cryptographic SHA-256 tamper guards, and automated baseline additionality validation.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">1</span>
                  <div>
                    <strong className="text-stone-900">3-Year Baseline Additionality Guard:</strong>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      Automatically detects historical tillage and stubble burning to ensure pure additionality before enrollment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">2</span>
                  <div>
                    <strong className="text-stone-900">Cryptographic Geotagging & Dedup:</strong>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      Every camera photo is hashed locally. Duplicate uploads or out-of-polygon coordinates trigger instant auditor alerts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">3</span>
                  <div>
                    <strong className="text-stone-900">DPDP Act (2023) Legal Notice:</strong>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      Statutory 15-day cooling-off windows and farmer anonymity protection hardcoded into onboarding forms.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${locale}/agent`}
                  className="inline-flex items-center gap-2 bg-[#0c2e20] hover:bg-[#134e35] text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-sm transition-all"
                >
                  <span>Launch FPO Field Terminal</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Field Terminal Mockup */}
            <div className="lg:col-span-6 bg-[#0c2e20] text-white rounded-3xl p-6 sm:p-8 space-y-4 font-mono text-xs shadow-md border border-emerald-900">
              <div className="flex justify-between items-center pb-3 border-b border-emerald-900">
                <span className="text-emerald-400 font-bold">CADASTRE SPATIAL AUDIT</span>
                <span className="text-[10px] text-stone-400">GPS ACCURACY: ±1.8m</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-900/60 space-y-2 font-mono text-[11px]">
                <div className="text-stone-400">// Cadastral Survey Polygon</div>
                <div>SURVEY_NUM: &quot;142/2A&quot;</div>
                <div>CENTROID: [20.3888° N, 78.1204° E]</div>
                <div>EXTENT_CALC: 4.00 ACRES</div>
                <div className="text-emerald-400">ADDITIONALITY: PASSED (ZERO-BURN MANDATE)</div>
                <div className="text-stone-400 truncate">SHA256: e3b0c44298fc1c149afbf4c8996fb92427...</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                  <div className="text-stone-400 text-[10px]">10% Extension Pool</div>
                  <div className="text-emerald-300 font-bold text-sm mt-1">₹180 / tCO₂e</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                  <div className="text-stone-400 text-[10px]">Sync Status</div>
                  <div className="text-emerald-300 font-bold text-sm mt-1">Offline-Ready PWA</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROLE 3: INDUSTRIAL FACTORY BUYER CONSOLE */}
        {activeRole === "factory" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="badge-pill bg-sky-50 text-sky-800 border border-sky-200">
                  ESG & Scope-3 Compliance Desk
                </span>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">
                  Institutional Carbon Procurement Terminal
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Procure verified, serialized primary batches directly retiring Scope-3 and BRSR targets.
                </p>
              </div>

              {/* Offset Volume Slider */}
              <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-700">Procurement Volume</span>
                  <span className="font-mono font-bold text-base text-[#0c2e20]">
                    {factoryTons} Tonnes CO₂e
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={factoryTons}
                  onChange={(e) => setFactoryTons(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#0c2e20]"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>10 Tonnes</span>
                  <span>500 Tonnes</span>
                  <span>1,000 Tonnes</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${locale}/factory`}
                  className="inline-flex items-center gap-2 bg-[#0c2e20] hover:bg-[#134e35] text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-sm transition-all"
                >
                  <span>Enter Live Procurement Marketplace</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Dynamic Pro-Forma Invoice Mockup */}
            <div className="lg:col-span-6 bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-md border border-stone-800">
              <div className="flex justify-between items-center pb-3 border-b border-stone-800 text-xs">
                <span className="font-mono text-stone-300 font-bold">PRO-FORMA INVOICE SIMULATOR</span>
                <span className="badge-pill bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  STATUTORY GST
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between text-stone-400">
                  <span>Carbon Offset Volume:</span>
                  <span className="text-white font-bold">{factoryTons} tCO₂e</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Base Price @ ₹1,800/t:</span>
                  <span className="text-white font-bold">₹{factorySubtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>GST @ 18% (Placeholder):</span>
                  <span className="text-stone-300">₹{factoryGst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-400 pt-2 border-t border-stone-800">
                  <span>Total Corporate Invoice:</span>
                  <span>₹{factoryTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs flex justify-between items-center">
                <span className="text-emerald-300 font-medium">Guaranteed Direct Farmer Flow (70%):</span>
                <span className="font-mono font-bold text-white text-sm">
                  ₹{factoryFarmerDirect.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
