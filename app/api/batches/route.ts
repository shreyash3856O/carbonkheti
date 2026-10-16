import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const batches = dataStore.getCreditBatches();
    return NextResponse.json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json({ error: "Failed to fetch batches" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      practiceType,
      vintageYear = 2025,
      stateId,
      districtId,
      totalTons,
      pricePerTonInr, // in rupees
      plotIds = [],
      cctsNote = "References India's Carbon Credit Trading Scheme (CCTS) guidelines. Self-declared V1 protocol with plot traceability.",
      userId = "admin-1",
    } = body;

    if (!practiceType || !stateId || !districtId || !totalTons || !pricePerTonInr) {
      return NextResponse.json(
        { error: "Missing required fields (practiceType, stateId, districtId, totalTons, pricePerTonInr)" },
        { status: 400 }
      );
    }

    const pricePerTonInrPaise = Math.round(parseFloat(pricePerTonInr) * 100);

    const result = dataStore.createCreditBatch({
      practiceType,
      vintageYear: parseInt(vintageYear),
      stateId: parseInt(stateId),
      districtId: parseInt(districtId),
      totalTons: parseFloat(totalTons),
      pricePerTonInrPaise,
      plotIds,
      cctsNote,
      createdByUserId: userId,
    });

    return NextResponse.json({
      success: true,
      batch: result.batch,
      creditsCreated: result.creditsCreated,
    });
  } catch (error) {
    console.error("Error creating credit batch:", error);
    return NextResponse.json({ error: "Failed to create credit batch" }, { status: 500 });
  }
}
