import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { evidenceId, status, notes } = await req.json();

    if (!evidenceId || !status) {
      return NextResponse.json({ error: "evidenceId and status are required" }, { status: 400 });
    }

    if (status !== "verified" && status !== "rejected") {
      return NextResponse.json({ error: "Status must be 'verified' or 'rejected'" }, { status: 400 });
    }

    const updated = dataStore.verifyEvidence(evidenceId, status, notes);

    if (!updated) {
      return NextResponse.json({ error: "Evidence not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, evidence: updated });
  } catch (error) {
    console.error("Error verifying evidence:", error);
    return NextResponse.json({ error: "Failed to verify evidence" }, { status: 500 });
  }
}
