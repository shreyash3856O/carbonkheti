import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const grievances = dataStore.getGrievances();
    return NextResponse.json(grievances);
  } catch (error) {
    console.error("Error fetching grievances:", error);
    return NextResponse.json({ error: "Failed to fetch grievances" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId = "anon", text, voiceNoteUrl } = await req.json();

    if (!text && !voiceNoteUrl) {
      return NextResponse.json(
        { error: "Please provide either written grievance text or a voice note" },
        { status: 400 }
      );
    }

    const item = dataStore.createGrievance(userId, text, voiceNoteUrl);
    return NextResponse.json({ success: true, grievance: item });
  } catch (error) {
    console.error("Error filing grievance:", error);
    return NextResponse.json({ error: "Failed to file grievance" }, { status: 500 });
  }
}
