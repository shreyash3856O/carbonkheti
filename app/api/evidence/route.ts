import { NextResponse } from "next/server";
import crypto from "crypto";
import { dataStore } from "@/lib/data/store";
import { storageAdapter } from "@/lib/adapters/storage";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const practiceId = formData.get("practiceId") as string;
    const geoLat = formData.get("geoLat") ? parseFloat(formData.get("geoLat") as string) : undefined;
    const geoLng = formData.get("geoLng") ? parseFloat(formData.get("geoLng") as string) : undefined;
    const notes = (formData.get("notes") as string) || "";
    const capturedByUserId = (formData.get("userId") as string) || undefined;

    if (!file || !practiceId) {
      return NextResponse.json({ error: "File and practice ID are required" }, { status: 400 });
    }

    // Read bytes & compute SHA-256 hash for dedup
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Upload file using storage adapter
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `evidence-${Date.now()}-${fileHash.slice(0, 8)}.${ext}`;
    const uploadResult = await storageAdapter.upload(buffer, filename, "evidence");

    // Geo validation: verify GPS coordinate is recorded
    const gpsInsidePlot = geoLat !== undefined && geoLng !== undefined;

    // Record evidence in data store (handles duplicate hash check)
    const result = dataStore.addEvidence({
      practiceId,
      fileUrl: uploadResult.url,
      fileHash,
      geoLat,
      geoLng,
      capturedAt: new Date().toISOString(),
      capturedByUserId,
      gpsInsidePlot,
      notes,
    });

    if (result.isDuplicate) {
      return NextResponse.json(
        {
          error: "Duplicate photo detected. A photo with identical SHA-256 hash has already been submitted for MRV.",
          evidence: result.evidence,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      evidence: result.evidence,
    });
  } catch (error) {
    console.error("Error uploading evidence:", error);
    return NextResponse.json({ error: "Failed to upload evidence" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const practiceId = searchParams.get("practiceId");
    if (!practiceId) {
      return NextResponse.json({ error: "practiceId query param is required" }, { status: 400 });
    }

    const items = dataStore.getEvidenceByPracticeId(practiceId);
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return NextResponse.json({ error: "Failed to fetch evidence" }, { status: 500 });
  }
}
