"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PublicRegistryPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [registryItems, setRegistryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [practiceFilter, setPracticeFilter] = useState("");
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

  const fetchRegistry = async () => {
    try {
      const url = new URL("/api/registry", window.location.origin);
      if (search) url.searchParams.set("q", search);
      if (practiceFilter) url.searchParams.set("practice", practiceFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      setRegistryItems(data);
    } catch (err) {
      console.error("Error fetching registry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, [practiceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistry();
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Registry Title */}
      <div className="luxury-card rounded-2xl p-8 mb-8 bg-white border border-stone-200">
        <div className="max-w-3xl space-y-2">
          <span className="badge-pill bg-emerald-50 text-emerald-800 border border-emerald-200">
            Public Decentralized Ledger
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            National Agricultural Carbon Credit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
            Every serialized carbon credit is immutably indexed with underlying practice evidence,
            geographic plot coordinates, and retirement provenance.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="luxury-card rounded-xl p-4 mb-6 bg-white border border-stone-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full sm:w-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search serial prefix (e.g. CK-MH-2025), district, or practice..."
              className="w-full pl-3 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800"
            />
          </div>
          <button
            type="submit"
            className="bg-[#0c2e20] text-white text-xs font-semibold px-4 py-2 rounded-lg"
          >
            Search Ledger
          </button>
        </form>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold">Filter:</span>
          <select
            value={practiceFilter}
            onChange={(e) => setPracticeFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800"
          >
            <option value="">All CCTS Methodologies</option>
            <option value="residue_retention">Residue Retention (Zero-Burn)</option>
            <option value="no_till">No-Till Soil Conservation</option>
            <option value="alternate_wetting_drying">AWD in Paddy</option>
            <option value="agroforestry">Field Agroforestry</option>
          </select>
        </div>
      </div>

      {/* Ledger Items */}
      {loading ? (
        <div className="text-center py-16 text-xs text-stone-500">
          Syncing public ledger records...
        </div>
      ) : registryItems.length === 0 ? (
        <div className="luxury-card rounded-2xl p-16 text-center max-w-md mx-auto bg-white border border-stone-200">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-1">Zero Matching Records</h3>
          <p className="text-xs text-stone-500 mb-6">
            No verified credits currently match your filter criteria.
          </p>
          <Link
            href={`/${locale}/admin`}
            className="bg-[#0c2e20] text-white text-xs font-semibold px-4 py-2 rounded-lg inline-block"
          >
            Go to MRV Minting Console
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {registryItems.map((item) => {
            const isExpanded = expandedBatchId === item.batchId;
            return (
              <div
                key={item.batchId}
                className="luxury-card rounded-xl border border-stone-200 bg-white overflow-hidden transition-all"
              >
                <div
                  onClick={() => setExpandedBatchId(isExpanded ? null : item.batchId)}
                  className="p-5 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                        {item.serialPrefix}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        Vintage {item.vintageYear}
                      </span>
                      <span className="text-xs text-stone-400">•</span>
                      <span className="text-xs text-stone-700">
                        {item.districtName}, {item.stateName}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900">
                      {item.practiceName}
                    </h3>
                    <div className="font-mono text-[11px] text-stone-500">
                      Serial Range: {item.serialRange}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xl font-bold font-mono text-[#0c2e20]">
                        {item.totalTons} <span className="text-xs font-sans text-stone-500">tCO₂e</span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {item.availableTons} available • {item.retiredTons} retired
                      </div>
                    </div>
                    <span className="text-xs text-stone-400 font-semibold">
                      {isExpanded ? "Hide Audit Detail" : "Inspect Traceability →"}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-stone-50 p-6 border-t border-stone-200 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[10px] mb-1">
                        Methodological Compliance Note
                      </h4>
                      <p className="text-stone-600 bg-white p-3 rounded-lg border border-stone-200">
                        {item.cctsNote}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[10px] mb-2">
                        Contributing Producer Extent ({item.contributors.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {item.contributors.map((c: any, idx: number) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-stone-200 space-y-1">
                            <div className="font-semibold text-stone-900">{c.farmerName}</div>
                            <div className="text-[11px] text-stone-500">{c.village}, {c.state}</div>
                            <div className="text-[11px] text-emerald-800 font-semibold">Plot Extent: {c.plotAreaAcres} Acres</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
