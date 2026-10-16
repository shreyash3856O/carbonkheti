import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = dataStore.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { farmersEnrolled: 0, tonsCredited: 0, payoutsReleasedInr: 0, statesCovered: 0 },
      { status: 500 }
    );
  }
}
