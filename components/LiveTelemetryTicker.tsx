"use client";

export default function LiveTelemetryTicker() {
  const events = [
    { type: "MRV VERIFIED", text: "Plot #142/2A • Yavatmal, MH • Happy Seeder Residue Retention • SHA-256 Validated", tag: "bg-emerald-500/20 text-emerald-400" },
    { type: "CCTS MINT", text: "Serial Range CK-PB-2025-000100 to 000150 • 50 tCO₂e • Punjab Basin", tag: "bg-sky-500/20 text-sky-400" },
    { type: "DBT RELEASE", text: "₹24,500 Direct Milestone Escrow Released • Guntur AWD Cooperative", tag: "bg-amber-500/20 text-amber-400" },
    { type: "AWD CHECK", text: "Field Pani Pipe tube sensor cross-referenced with Sentinel-1 SAR backscatter", tag: "bg-emerald-500/20 text-emerald-400" },
    { type: "DPDP NOTICE", text: "15-day statutory cooling-off window logged for 14 new smallholder producers", tag: "bg-purple-500/20 text-purple-400" },
    { type: "PROCUREMENT", text: "Tata Steel ESG Desk retired 25 tCO₂e against Scope-3 baseline", tag: "bg-sky-500/20 text-sky-400" },
  ];

  return (
    <div className="w-full bg-[#020b06] border-y border-emerald-950/80 py-3 overflow-hidden select-none">
      <div className="flex items-center gap-8 whitespace-nowrap animate-[marquee_35s_linear_infinite]">
        {[...events, ...events].map((ev, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-xs font-mono">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ev.tag}`}>
              {ev.type}
            </span>
            <span className="text-stone-300">{ev.text}</span>
            <span className="text-emerald-900">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
