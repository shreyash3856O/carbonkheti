import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get("stateId");
    let farmers = dataStore.getFarmers();

    if (stateId) {
      farmers = farmers.filter((f) => f.stateId === parseInt(stateId));
    }

    // Attach plot counts and practice counts
    const enriched = farmers.map((f) => {
      const plots = dataStore.getPlotsByFarmerId(f.id);
      const practices = dataStore.getPracticesByFarmerId(f.id);
      const payouts = dataStore.getPayoutsByFarmerId(f.id);
      return {
        ...f,
        plotCount: plots.length,
        totalAcres: plots.reduce((acc, p) => acc + (p.areaAcres || 0), 0),
        practices,
        payouts,
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Error fetching farmers:", error);
    return NextResponse.json({ error: "Failed to fetch farmers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nameLocal,
      nameEn,
      phone,
      stateId,
      districtId,
      villageName,
      taluka,
      upiId,
      bankAccountMasked,
      ifscCode,
      landDocType,
      landDocUrl,
      enrolledByAgentId,
      cooperativeId,
      // Plot details
      plotName = "Main Field",
      surveyNumber,
      areaValue,
      areaUnit = "acres",
      centerLat,
      centerLng,
      boundaryGeoJson,
      // Baseline history (last 3 years)
      baselineYear = 2024,
      baselineTillage = "conventional",
      baselineResidue = "burned",
      baselineFertilizer = "chemical_urea",
      baselineIrrigation = "flood",
      // Practice target
      targetPracticeType,
      seasonYear = 2025,
      seasonLabel = "Kharif 2025",
      // Consent flags
      consentDataUsage = true,
      consentPhoto = false,
      consentStory = false,
      photoUrl,
      storyText,
    } = body;

    if (!nameLocal || !phone || !stateId || !districtId || !villageName || !surveyNumber || !areaValue) {
      return NextResponse.json(
        { error: "Missing required fields (Name, Phone, State, District, Village, Survey #, Land Area)" },
        { status: 400 }
      );
    }

    // Ensure User account exists
    const user = dataStore.upsertUser(phone, "farmer");

    // Compute canonical area in acres
    const numArea = parseFloat(areaValue);
    let areaAcres = numArea;
    if (areaUnit === "hectares") areaAcres = numArea * 2.47105;
    else if (areaUnit === "bigha") areaAcres = numArea * 0.625; // standard avg bigha
    else if (areaUnit === "guntha") areaAcres = numArea * 0.025;

    // Cooling off period (15 days from now under DPDP fair terms)
    const coolingOffDate = new Date();
    coolingOffDate.setDate(coolingOffDate.getDate() + 15);

    // 1. Create Farmer
    const newFarmer = dataStore.createFarmer({
      userId: user.id,
      nameLocal,
      nameEn,
      phone,
      stateId: parseInt(stateId),
      districtId: parseInt(districtId),
      villageName,
      taluka,
      upiId,
      bankAccountMasked,
      ifscCode,
      landDocType,
      landDocUrl,
      enrolledByAgentId,
      cooperativeId,
      photoUrl,
      photoConsentGranted: Boolean(consentPhoto),
      storyText,
      storyConsentGranted: Boolean(consentStory),
      coolingOffEndsAt: coolingOffDate.toISOString(),
    });

    // 2. Create Plot
    const newPlot = dataStore.createPlot({
      farmerId: newFarmer.id,
      plotName,
      surveyNumber,
      areaAcres: Math.round(areaAcres * 100) / 100,
      areaValue: numArea,
      areaUnit,
      centerLat: centerLat ? parseFloat(centerLat) : undefined,
      centerLng: centerLng ? parseFloat(centerLng) : undefined,
      boundaryGeoJson,
      landDocUrl,
    });

    // 3. Record Baseline
    const newBaseline = dataStore.addBaseline({
      plotId: newPlot.id,
      year: parseInt(baselineYear),
      tillagePractice: baselineTillage,
      residuePractice: baselineResidue,
      fertilizerType: baselineFertilizer,
      irrigationType: baselineIrrigation,
      recordedByUserId: enrolledByAgentId || user.id,
    });

    // 4. Record Practice with Additionality check
    let practiceResult = null;
    if (targetPracticeType) {
      practiceResult = dataStore.createPractice({
        farmerId: newFarmer.id,
        plotId: newPlot.id,
        practiceType: targetPracticeType,
        seasonYear: parseInt(seasonYear),
        seasonLabel,
      });
    }

    // 5. Record DPDP Consents
    dataStore.recordConsent({
      farmerId: newFarmer.id,
      consentType: "data_usage",
      grantedAt: new Date().toISOString(),
      isAgentAssisted: Boolean(enrolledByAgentId),
      language: "en",
    });
    if (consentPhoto) {
      dataStore.recordConsent({
        farmerId: newFarmer.id,
        consentType: "photo_sharing",
        grantedAt: new Date().toISOString(),
        isAgentAssisted: Boolean(enrolledByAgentId),
        language: "en",
      });
    }

    return NextResponse.json({
      success: true,
      farmer: newFarmer,
      plot: newPlot,
      baseline: newBaseline,
      practice: practiceResult?.practice,
      additionalityPassed: practiceResult?.additionalityPassed ?? true,
      additionalityNote: practiceResult?.practice.additionalityNote,
    });
  } catch (error) {
    console.error("Error creating farmer:", error);
    return NextResponse.json({ error: "Failed to enroll farmer" }, { status: 500 });
  }
}
