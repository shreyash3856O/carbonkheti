import Link from "next/link";
import { dataStore } from "@/lib/data/store";
import { getTranslations } from "next-intl/server";
import DynamicEcosystemConsole from "@/components/DynamicEcosystemConsole";
import DynamicMethodologyExplorer from "@/components/DynamicMethodologyExplorer";
import CarbonGlobe3D from "@/components/CarbonGlobe3D";
import LiveTelemetryTicker from "@/components/LiveTelemetryTicker";

export const dynamic = "force-dynamic";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const stats = dataStore.getStats();
  const config = dataStore.getConfig();

  return (
    <div className="flex-1 flex flex-col bg-[#05150e] text-white">
      {/* 3D Cinematic Interactive Hero */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-emerald-950/80">
        {/* Ambient Emerald Auroras */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 6 Cols: High Impact Messaging */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>INDIA CCTS-ALIGNED AGRICULTURAL CARBON EXCHANGE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Factories pay to cut carbon.
                <span className="block text-emerald-400 mt-2">
                  Farmers get paid to grow it back.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-xl">
                India&apos;s decentralized soil carbon infrastructure linking verified smallholder
                producers with industrial buyers. Every credit is cryptographically mapped to rural cadastral
                boundaries with guaranteed 70% direct UPI/bank disbursements.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/${locale}/factory`}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-sm font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
                >
                  <span>Procure Verified Credits</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/farmer`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-all"
                >
                  <span>Farmer Passbook (किसान पासबुक)</span>
                </Link>
                <Link
                  href={`/${locale}/agent`}
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-sm font-semibold px-5 py-3.5 rounded-xl transition-all"
                >
                  <span>FPO Extension Terminal</span>
                </Link>
              </div>

              {/* Live Ledger Ribbon */}
              <div className="pt-6 border-t border-emerald-950/80 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[11px] text-stone-400 font-mono">VERIFIED CREDITS</div>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    {stats.tonsCredited.toLocaleString("en-IN")} <span className="text-xs text-emerald-400">tCO₂e</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 font-mono">FARMER DBT DISBURSED</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                    ₹{stats.payoutsReleasedInr.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-stone-400 font-mono">PRODUCERS ENROLLED</div>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    {stats.farmersEnrolled.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Interactive 3D Carbon Globe */}
            <div className="lg:col-span-6">
              <CarbonGlobe3D />
            </div>
          </div>
        </div>
      </section>

      {/* Live Cryptographic Telemetry Stream */}
      <LiveTelemetryTicker />

      {/* Dynamic Interactive Ecosystem Console (Light Section for High Contrast) */}
      <section className="py-24 bg-[#F8FAF8] text-[#091910] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="badge-pill bg-emerald-100 text-emerald-900 border border-emerald-200">
              Live Ecosystem Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mt-3">
              Experience the Platform as a Farmer, FPO, or Factory
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Toggle roles below to simulate live land extent calculations, spatial field audits, or corporate procurement.
            </p>
          </div>

          <DynamicEcosystemConsole locale={locale} />
        </div>
      </section>

      {/* Transparent Economic Model */}
      <section className="py-24 bg-[#071a12] text-white border-b border-emerald-950/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="badge-pill bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Guaranteed Economics
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                70% Direct Payout to Smallholder Farmers
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Conventional international brokers take up to 80% in intermediary margins.
                CarbonKheti enforces a hardcoded benefit-split architecture on every single transaction:
              </p>
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-200">
                Disbursements are disbursed in 3 phases: 20% on onboarding KYC, 40% on mid-season evidence, and 40% post-harvest audit.
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0c2e20]/60 rounded-3xl p-8 border border-emerald-900/60 space-y-6">
              <div className="h-4 w-full rounded-full overflow-hidden flex bg-stone-900">
                <div style={{ width: `${config.farmerSplitPct}%` }} className="bg-emerald-500 h-full" title="Farmer Share" />
                <div style={{ width: `${config.platformSplitPct}%` }} className="bg-amber-400 h-full" title="FPO / Tech" />
                <div style={{ width: `${config.verificationSplitPct}%` }} className="bg-sky-400 h-full" title="Audits" />
                <div style={{ width: `${config.bufferSplitPct}%` }} className="bg-purple-400 h-full" title="Buffer Reserve" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">{config.farmerSplitPct}%</div>
                  <div className="text-xs font-semibold text-stone-200 mt-1">Farmer Share</div>
                  <div className="text-[11px] text-stone-400">Direct to UPI / Bank</div>
                </div>

                <div>
                  <div className="text-2xl font-bold font-mono text-amber-400">{config.platformSplitPct}%</div>
                  <div className="text-xs font-semibold text-stone-200 mt-1">FPO Operations</div>
                  <div className="text-[11px] text-stone-400">Extension & Technology</div>
                </div>

                <div>
                  <div className="text-2xl font-bold font-mono text-sky-400">{config.verificationSplitPct}%</div>
                  <div className="text-xs font-semibold text-stone-200 mt-1">Independent MRV</div>
                  <div className="text-[11px] text-stone-400">Ground truth & Satellite</div>
                </div>

                <div>
                  <div className="text-2xl font-bold font-mono text-purple-400">{config.bufferSplitPct}%</div>
                  <div className="text-xs font-semibold text-stone-200 mt-1">Reversal Buffer</div>
                  <div className="text-[11px] text-stone-400">Climate risk mitigation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic CCTS Approved Methodologies Explorer */}
      <section className="py-24 bg-[#F8FAF8] text-[#091910] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DynamicMethodologyExplorer />
        </div>
      </section>
    </div>
  );
}
