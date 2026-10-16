import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";
import { paymentAdapter } from "@/lib/adapters/payments";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId");

    const payouts = farmerId
      ? dataStore.getPayoutsByFarmerId(farmerId)
      : dataStore.getAllPayouts();

    const enriched = payouts.map((p) => {
      const farmer = dataStore.getFarmerById(p.farmerId);
      return {
        ...p,
        farmerName: farmer ? farmer.nameLocal : "Unknown Farmer",
        farmerPhone: farmer ? farmer.phone : "",
        amountInr: Math.round(p.amountInrPaise / 100),
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Error fetching payouts:", error);
    return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { payoutId } = await req.json();

    if (!payoutId) {
      return NextResponse.json({ error: "payoutId is required" }, { status: 400 });
    }

    const payout = dataStore.releasePayout(payoutId);

    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }

    // Call payment adapter (stub in v1)
    await paymentAdapter.initiatePayout({
      farmerId: payout.farmerId,
      amountInrPaise: payout.amountInrPaise,
      reference: payout.id,
    });

    return NextResponse.json({
      success: true,
      payout,
      isStub: true,
      message: "Payout marked as PAID. (Payments not live in v1 — stub adapter used)",
    });
  } catch (error) {
    console.error("Error releasing payout:", error);
    return NextResponse.json({ error: "Failed to release payout" }, { status: 500 });
  }
}
