import { NextResponse } from "next/server";
import { STATES_SEED, DISTRICTS_SEED, PRACTICE_MENU, CROP_LIST } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    states: STATES_SEED,
    districts: DISTRICTS_SEED,
    practices: PRACTICE_MENU,
    crops: CROP_LIST,
  });
}
