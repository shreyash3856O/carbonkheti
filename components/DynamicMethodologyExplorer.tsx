"use client";

import { useState } from "react";

export default function DynamicMethodologyExplorer() {
  const [selectedPractice, setSelectedPractice] = useState<number>(0);

  const methodologies = [
    {
      title: "Crop Residue Retention (Zero-Burn)",
      category: "Air Quality & Surface SOC",
      abatementFactor: "1.20 tCO₂e / acre / year",
      primaryGas: "CO₂, CH₄, N₂O & Particulate Matter PM2.5",
      mechanism: "Elimination of seasonal open-air straw combustion. High-clearance Happy Seeder cuts standing paddy stubble and deposits it as an unbroken insulating mulch layer, increasing soil moisture retention by 28% and microbial decomposition humification.",
      coBenefits: ["Zero seasonal stubble smoke", "Water conservation", "Suppression of weed emergence"],
      verificationMetric: "Geotagged high-res canopy photo + satellite thermal fire anomaly absence (MODIS/VIIRS)",
    },
    {
      title: "Alternate Wetting & Drying (AWD)",
      category: "Methane Biogeochemical Abatement",
      abatementFactor: "1.50 tCO₂e / acre / year",
      primaryGas: "CH₄ (Methane Abatement)",
      mechanism: "Periodic controlled aeration of paddy soil using field water tubes (pani pipe). Introducing oxygen into previously flooded soil arrests methanogenic archaea without causing moisture stress or yield penalty in rice.",
      coBenefits: ["30-38% irrigation water savings", "Stronger root tillering", "Reduced arsenic uptake in grain"],
      verificationMetric: "Perforated field tube water level logs + optical SAR radar moisture backscatter cross-check",
    },
    {
      title: "Zero-Till Soil Conservation",
      category: "Soil Organic Carbon (SOC) Protection",
      abatementFactor: "0.80 tCO₂e / acre / year",
      primaryGas: "CO₂ (Soil Organic Carbon Oxidation)",
      mechanism: "Direct coulter seeding into untilled ground. Halting mechanical disc and mouldboard ploughing protects mycorrhizal fungal hyphae networks and prevents deep carbon oxidation to the atmosphere.",
      coBenefits: ["60% diesel fuel reduction", "Enhanced earthworm population", "Resistance to soil compaction"],
      verificationMetric: "Pre-sowing furrow inspection + baseline 3-year historical machinery survey",
    },
    {
      title: "Field Boundary Agroforestry",
      category: "Woody Biomass Sequestration",
      abatementFactor: "2.00 tCO₂e / acre / year",
      primaryGas: "Biomass Carbon Stock Accumulation",
      mechanism: "Planting perennial multi-purpose indigenous species (neem, teak, subabul, bamboo) on field bunds and perimeter borders. Deep root systems pump recalcitrant carbon into deep subsoil layers unreachable by surface erosion.",
      coBenefits: ["Windbreak microclimate regulation", "Supplemental non-timber forest revenue", "Pollinator habitat"],
      verificationMetric: "LiDAR/Optical tree crown diameter classification + annual DBH (diameter at breast height) field logs",
    },
  ];

  const current = methodologies[selectedPractice];

  return (
    <div className="luxury-card rounded-3xl bg-white border border-stone-200 p-6 sm:p-10 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="badge-pill bg-stone-100 text-stone-700">
            Scientific Framework
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-2">
            CCTS Methodology & Biogeochemical Explorer
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Explore the peer-reviewed carbon capture mechanisms and verification metrics behind every credit.
          </p>
        </div>

        {/* Practice selector tabs */}
        <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-xl">
          {methodologies.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPractice(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedPractice === idx
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {m.title.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge-pill bg-stone-100 text-stone-800 border border-stone-200">
              {current.category}
            </span>
            <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded border border-stone-200">
              {current.abatementFactor}
            </span>
          </div>

          <h3 className="text-xl font-bold text-stone-900">
            {current.title}
          </h3>

          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Biogeochemical Mechanism
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
              {current.mechanism}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Primary Target Emission
              </div>
              <div className="text-xs font-semibold text-stone-900">
                {current.primaryGas}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                MRV Audit Vector
              </div>
              <div className="text-xs text-stone-700 leading-normal">
                {current.verificationMetric}
              </div>
            </div>
          </div>
        </div>

        {/* Co-benefits column */}
        <div className="lg:col-span-4 bg-stone-900 text-white rounded-2xl p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-300">
            Ecosystem Co-Benefits
          </div>
          <div className="space-y-2.5 text-xs">
            {current.coBenefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400">
            Eligible for premium biodiversity and water conservation pricing under India CCTS framework.
          </div>
        </div>
      </div>
    </div>
  );
}
