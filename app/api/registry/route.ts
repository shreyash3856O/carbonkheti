import { NextResponse } from "next/server";
import { dataStore, STATES_SEED, DISTRICTS_SEED, PRACTICE_MENU } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase();
    const practiceFilter = searchParams.get("practice");
    const stateFilter = searchParams.get("stateId");

    const batches = dataStore.getCreditBatches();
    const rawData = dataStore.getRawData();

    let results = batches.map((batch) => {
      const state = STATES_SEED.find((s) => s.id === batch.stateId);
      const district = DISTRICTS_SEED.find((d) => d.id === batch.districtId);
      const practice = PRACTICE_MENU.find((p) => p.code === batch.practiceType);

      // Find plots in batch
      const plots = rawData.plots.filter((p) => batch.plotIds.includes(p.id));
      
      // Farmer anonymization guard: Only expose if both photo/story consent was explicitly given
      const contributors = plots.map((p) => {
        const farmer = rawData.farmers.find((f) => f.id === p.farmerId);
        if (!farmer) return null;

        const showIdentity = farmer.photoConsentGranted && farmer.storyConsentGranted;

        return {
          plotAreaAcres: p.areaAcres,
          village: farmer.villageName,
          state: state?.name || "India",
          farmerName: showIdentity ? farmer.nameLocal : `Farmer #${farmer.id.slice(0, 6)} (Identity protected)`,
          photoUrl: showIdentity ? farmer.photoUrl : null,
          storyText: showIdentity ? farmer.storyText : null,
        };
      }).filter(Boolean);

      // Total credits issued
      const batchCredits = rawData.credits.filter((c) => c.batchId === batch.id);
      const retiredCount = batchCredits.filter((c) => c.status === "retired").length;

      return {
        batchId: batch.id,
        serialPrefix: batch.serialPrefix,
        serialRange: `${batch.serialPrefix}-${String(batch.startSerial).padStart(6, "0")} to ${batch.serialPrefix}-${String(batch.endSerial).padStart(6, "0")}`,
        vintageYear: batch.vintageYear,
        practiceCode: batch.practiceType,
        practiceName: practice?.name || batch.practiceType,
        stateName: state?.name || "Unknown",
        districtName: district?.name || "Unknown",
        totalTons: batch.totalTons,
        availableTons: batch.availableTons,
        retiredTons: retiredCount,
        status: batch.status,
        cctsNote: batch.cctsNote,
        contributors,
        createdAt: batch.createdAt,
      };
    });

    if (query) {
      results = results.filter(
        (r) =>
          r.serialPrefix.toLowerCase().includes(query) ||
          r.serialRange.toLowerCase().includes(query) ||
          r.practiceName.toLowerCase().includes(query) ||
          r.stateName.toLowerCase().includes(query) ||
          r.districtName.toLowerCase().includes(query)
      );
    }

    if (practiceFilter) {
      results = results.filter((r) => r.practiceCode === practiceFilter);
    }

    if (stateFilter) {
      const stateObj = STATES_SEED.find((s) => s.id === parseInt(stateFilter));
      if (stateObj) {
        results = results.filter((r) => r.stateName === stateObj.name);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching registry:", error);
    return NextResponse.json({ error: "Failed to fetch registry" }, { status: 500 });
  }
}
