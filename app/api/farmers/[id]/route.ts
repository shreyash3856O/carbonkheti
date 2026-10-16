import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const farmer = dataStore.getFarmerById(id);

    if (!farmer) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
    }

    const plots = dataStore.getPlotsByFarmerId(farmer.id);
    const practices = dataStore.getPracticesByFarmerId(farmer.id);
    const payouts = dataStore.getPayoutsByFarmerId(farmer.id);

    // Calculate totals for passbook
    const totalEarnedPaise = payouts
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amountInrPaise, 0);

    const pendingPayoutsPaise = payouts
      .filter((p) => p.status === "pending" || p.status === "processing")
      .reduce((sum, p) => sum + p.amountInrPaise, 0);

    // Total tons credited estimated or active
    const totalAcres = plots.reduce((sum, p) => sum + (p.areaAcres || 0), 0);
    const estimatedTons = Math.round(totalAcres * 1.2 * 10) / 10;

    return NextResponse.json({
      farmer,
      plots,
      practices,
      payouts,
      passbook: {
        totalEarnedPaise,
        totalEarnedInr: Math.round(totalEarnedPaise / 100),
        pendingPayoutsPaise,
        pendingPayoutsInr: Math.round(pendingPayoutsPaise / 100),
        totalAcres,
        estimatedTons,
        coolingOffActive: farmer.coolingOffEndsAt
          ? new Date(farmer.coolingOffEndsAt) > new Date()
          : false,
      },
    });
  } catch (error) {
    console.error("Error fetching farmer details:", error);
    return NextResponse.json({ error: "Failed to fetch farmer" }, { status: 500 });
  }
}
