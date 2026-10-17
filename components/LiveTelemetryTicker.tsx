"use client";

export default function LiveTelemetryTicker() {
  const events = [
    { type: "MRV VERIFIED", text: "Plot #142/2A • Yavatmal, MH • Happy Seeder Residue Retention • Validated" },
    { type: "CCTS MINT", text: "Serial Range CK-PB-2025-000100 to 000150 • 50 tCO₂e • Punjab Basin" },
    { type: "DBT RELEASE", text: "₹24,500 Direct Milestone Escrow Released • Guntur Cooperative" },
    { type: "AWD CHECK", text: "Field Pani Pipe tube sensor cross-referenced with Sentinel-1 SAR" },
    { type: "DPDP NOTICE", text: "Statutory cooling-off window logged for 14 new smallholder producers" },
    { type: "PROCUREMENT", text: "Tata Steel ESG Desk retired 25 tCO₂e against Scope-3 baseline" },
  ];

  return (
    <div className="w-full bg-stone-100 border-y border-stone-200 py-2.5 overflow-hidden select-none">
      <div className="flex items-center gap-8 whitespace-nowrap animate-[marquee_40s_linear_infinite]">
        {[...events, ...events].map((ev, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 text-[10px] font-bold">
              {ev.type}
            </span>
            <span className="text-stone-600">{ev.text}</span>
            <span className="text-stone-300">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
