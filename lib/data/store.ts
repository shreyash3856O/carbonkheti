import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface StateRef {
  id: number;
  name: string;
  code: string;
}

export interface DistrictRef {
  id: number;
  stateId: number;
  name: string;
}

export interface PracticeMenuItem {
  code: string;
  name: string;
  category: string;
  description: string;
  carbonEstTonsPerAcreYear: number;
}

export interface CropRef {
  id: number;
  nameEn: string;
  nameHi: string;
  category: string;
}

export const STATES_SEED: StateRef[] = [
  { id: 1, name: "Maharashtra", code: "MH" },
  { id: 2, name: "Punjab", code: "PB" },
  { id: 3, name: "Haryana", code: "HR" },
  { id: 4, name: "Gujarat", code: "GJ" },
  { id: 5, name: "Madhya Pradesh", code: "MP" },
  { id: 6, name: "Uttar Pradesh", code: "UP" },
  { id: 7, name: "Karnataka", code: "KA" },
  { id: 8, name: "Andhra Pradesh", code: "AP" },
  { id: 9, name: "Telangana", code: "TS" },
  { id: 10, name: "Tamil Nadu", code: "TN" },
  { id: 11, name: "Odisha", code: "OD" },
  { id: 12, name: "West Bengal", code: "WB" },
  { id: 13, name: "Rajasthan", code: "RJ" },
  { id: 14, name: "Kerala", code: "KL" },
  { id: 15, name: "Bihar", code: "BR" },
];

export const DISTRICTS_SEED: DistrictRef[] = [
  // Maharashtra
  { id: 101, stateId: 1, name: "Yavatmal" },
  { id: 102, stateId: 1, name: "Wardha" },
  { id: 103, stateId: 1, name: "Amravati" },
  { id: 104, stateId: 1, name: "Akola" },
  { id: 105, stateId: 1, name: "Nashik" },
  { id: 106, stateId: 1, name: "Pune" },
  { id: 107, stateId: 1, name: "Kolhapur" },
  // Punjab
  { id: 201, stateId: 2, name: "Ludhiana" },
  { id: 202, stateId: 2, name: "Sangrur" },
  { id: 203, stateId: 2, name: "Patiala" },
  { id: 204, stateId: 2, name: "Bathinda" },
  // Haryana
  { id: 301, stateId: 3, name: "Karnal" },
  { id: 302, stateId: 3, name: "Kurukshetra" },
  { id: 303, stateId: 3, name: "Hisar" },
  // Gujarat
  { id: 401, stateId: 4, name: "Rajkot" },
  { id: 402, stateId: 4, name: "Junagadh" },
  { id: 403, stateId: 4, name: "Surat" },
  // MP
  { id: 501, stateId: 5, name: "Indore" },
  { id: 502, stateId: 5, name: "Ujjain" },
  { id: 503, stateId: 5, name: "Hoshangabad" },
  // UP
  { id: 601, stateId: 6, name: "Varanasi" },
  { id: 602, stateId: 6, name: "Meerut" },
  { id: 603, stateId: 6, name: "Barabanki" },
  // Karnataka
  { id: 701, stateId: 7, name: "Belagavi" },
  { id: 702, stateId: 7, name: "Dharwad" },
  { id: 703, stateId: 7, name: "Mandya" },
  // AP & TS
  { id: 801, stateId: 8, name: "Guntur" },
  { id: 802, stateId: 8, name: "Krishna" },
  { id: 901, stateId: 9, name: "Warangal" },
  { id: 902, stateId: 9, name: "Nalgonda" },
  // Tamil Nadu
  { id: 1001, stateId: 10, name: "Thanjavur" },
  { id: 1002, stateId: 10, name: "Coimbatore" },
  // Odisha
  { id: 1101, stateId: 11, name: "Sambalpur" },
  { id: 1102, stateId: 11, name: "Bargarh" },
  // WB
  { id: 1201, stateId: 12, name: "Burdwan" },
  { id: 1202, stateId: 12, name: "Hooghly" },
];

export const PRACTICE_MENU: PracticeMenuItem[] = [
  {
    code: "no_till",
    name: "No-Till Farming (Zero Tillage)",
    category: "Soil Conservation",
    description: "Planting crops directly into undisturbed soil to preserve soil organic matter and fungal networks.",
    carbonEstTonsPerAcreYear: 0.8,
  },
  {
    code: "reduced_tillage",
    name: "Reduced Tillage",
    category: "Soil Conservation",
    description: "Limiting mechanical tillage passes to minimize soil disturbance and emissions.",
    carbonEstTonsPerAcreYear: 0.4,
  },
  {
    code: "cover_crops",
    name: "Cover Cropping (Multi-Species)",
    category: "Soil Health",
    description: "Growing non-commercial cover crops (dhaincha, sunn hemp, legumes) between main seasons to fix nitrogen and build soil humus.",
    carbonEstTonsPerAcreYear: 0.7,
  },
  {
    code: "residue_retention",
    name: "Crop Residue Retention (Zero-Burn)",
    category: "Air Quality & Carbon",
    description: "Incorporating or mulching paddy/wheat straw on fields using Happy Seeder / Super-SMS instead of open burning.",
    carbonEstTonsPerAcreYear: 1.2,
  },
  {
    code: "alternate_wetting_drying",
    name: "Alternate Wetting and Drying (AWD) in Paddy",
    category: "Methane Abatement",
    description: "Periodic field drainage in irrigated rice to suppress anaerobic methanogenic bacteria and conserve water.",
    carbonEstTonsPerAcreYear: 1.5,
  },
  {
    code: "agroforestry",
    name: "Agroforestry / Silvo-Arable Planting",
    category: "Biomass Sequestration",
    description: "Integrating perennial indigenous tree species within crop rows or field bunds for deep root carbon capture.",
    carbonEstTonsPerAcreYear: 2.0,
  },
  {
    code: "boundary_trees",
    name: "Field Boundary Tree Plantation",
    category: "Biomass Sequestration",
    description: "Planting neem, teak, bamboo, or subabul along farm borders as windbreaks and carbon banks.",
    carbonEstTonsPerAcreYear: 1.0,
  },
];

export const CROP_LIST: CropRef[] = [
  { id: 1, nameEn: "Paddy (Rice)", nameHi: "धान", category: "cereal" },
  { id: 2, nameEn: "Wheat", nameHi: "गेहूं", category: "cereal" },
  { id: 3, nameEn: "Cotton", nameHi: "कपास", category: "fiber" },
  { id: 4, nameEn: "Soybean", nameHi: "सोयाबीन", category: "oilseed" },
  { id: 5, nameEn: "Sugarcane", nameHi: "गन्ना", category: "sugar" },
  { id: 6, nameEn: "Maize", nameHi: "मक्का", category: "cereal" },
  { id: 7, nameEn: "Pigeon Pea (Arhar/Tur)", nameHi: "अरहर / तूर", category: "pulse" },
  { id: 8, nameEn: "Groundnut", nameHi: "मूंगफली", category: "oilseed" },
  { id: 9, nameEn: "Pearl Millet (Bajra)", nameHi: "बाजरा", category: "millet" },
  { id: 10, nameEn: "Sorghum (Jowar)", nameHi: "ज्वार", category: "millet" },
];

export interface StoredUser {
  id: string;
  phone: string;
  role: "farmer" | "agent" | "cooperative" | "factory_buyer" | "admin";
  languagePref: string;
  createdAt: string;
}

export interface StoredFarmer {
  id: string;
  userId: string;
  nameLocal: string;
  nameEn?: string;
  phone: string;
  cooperativeId?: string;
  enrolledByAgentId?: string;
  stateId: number;
  districtId: number;
  taluka?: string;
  villageName: string;
  upiId?: string;
  bankAccountMasked?: string;
  ifscCode?: string;
  landDocType?: string;
  landDocUrl?: string;
  kycStatus: "pending" | "approved" | "rejected";
  coolingOffEndsAt?: string;
  photoUrl?: string;
  photoConsentGranted: boolean;
  storyText?: string;
  storyConsentGranted: boolean;
  createdAt: string;
}

export interface StoredPlot {
  id: string;
  farmerId: string;
  plotName: string;
  surveyNumber: string;
  areaAcres: number;
  areaValue: number;
  areaUnit: "acres" | "hectares" | "bigha" | "guntha";
  centerLat?: number;
  centerLng?: number;
  boundaryGeoJson?: string;
  landDocUrl?: string;
  activeBatchId?: string | null;
  createdAt: string;
}

export interface StoredBaseline {
  id: string;
  plotId: string;
  year: number;
  tillagePractice: string;
  fertilizerType: string;
  irrigationType: string;
  residuePractice: string;
  cropId?: number;
  recordedByUserId?: string;
  createdAt: string;
}

export interface StoredPractice {
  id: string;
  farmerId: string;
  plotId: string;
  practiceType: string;
  seasonYear: number;
  seasonLabel: string;
  cropId?: number;
  status: "pending" | "approved" | "rejected";
  additionalityPassed: boolean;
  additionalityNote?: string;
  createdAt: string;
}

export interface StoredEvidence {
  id: string;
  practiceId: string;
  fileUrl: string;
  fileHash: string; // SHA-256 for dedup
  geoLat?: number;
  geoLng?: number;
  capturedAt: string;
  capturedByUserId?: string;
  gpsInsidePlot: boolean;
  isDuplicateHash: boolean;
  status: "pending" | "verified" | "rejected";
  notes?: string;
  createdAt: string;
}

export interface StoredCreditBatch {
  id: string;
  serialPrefix: string;
  startSerial: number;
  endSerial: number;
  practiceType: string;
  vintageYear: number;
  stateId: number;
  districtId: number;
  totalTons: number;
  availableTons: number;
  pricePerTonInr: number; // in paise
  status: "draft" | "active" | "retired" | "cancelled";
  cctsNote: string;
  plotIds: string[];
  createdByUserId: string;
  createdAt: string;
}

export interface StoredCredit {
  serialNumber: string;
  batchId: string;
  status: "issued" | "retired" | "cancelled";
  retiredByOrderId?: string;
  createdAt: string;
}

export interface StoredOrder {
  id: string;
  factoryId: string;
  companyName: string;
  batchId: string;
  tonsRequested: number;
  pricePerTonInrPaise: number;
  totalAmountInrPaise: number;
  status: "pending" | "confirmed" | "invoice_sent" | "paid" | "cancelled";
  invoiceNumber: string;
  gstRate: number; // 18% default
  createdAt: string;
}

export interface StoredPayout {
  id: string;
  farmerId: string;
  orderId?: string;
  batchId?: string;
  stage: "signup" | "mid_season" | "final";
  amountInrPaise: number;
  status: "pending" | "processing" | "paid" | "failed";
  paidAt?: string;
  createdAt: string;
}

export interface StoredGrievance {
  id: string;
  userId: string;
  text?: string;
  voiceNoteUrl?: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  resolutionNote?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface StoredConsent {
  id: string;
  farmerId: string;
  consentType: "data_usage" | "photo_sharing" | "story_sharing" | "payout_terms" | "cooling_off" | "dpdp_notice";
  grantedAt?: string;
  withdrawnAt?: string;
  isAgentAssisted: boolean;
  language: string;
}

export interface PlatformConfigStore {
  farmerSplitPct: number; // default 70
  platformSplitPct: number; // default 10
  verificationSplitPct: number; // default 10
  bufferSplitPct: number; // default 10
  helplineNumber: string;
  cctsNote: string;
}

export interface AppData {
  users: StoredUser[];
  farmers: StoredFarmer[];
  plots: StoredPlot[];
  baselines: StoredBaseline[];
  practices: StoredPractice[];
  evidence: StoredEvidence[];
  creditBatches: StoredCreditBatch[];
  credits: StoredCredit[];
  orders: StoredOrder[];
  payouts: StoredPayout[];
  grievances: StoredGrievance[];
  consents: StoredConsent[];
  config: PlatformConfigStore;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

const INITIAL_DATA: AppData = {
  users: [],
  farmers: [],
  plots: [],
  baselines: [],
  practices: [],
  evidence: [],
  creditBatches: [],
  credits: [],
  orders: [],
  payouts: [],
  grievances: [],
  consents: [],
  config: {
    farmerSplitPct: 70,
    platformSplitPct: 10,
    verificationSplitPct: 10,
    bufferSplitPct: 10,
    helplineNumber: "+91-1800-CARBON-KHETI",
    cctsNote: "This methodology references India's Carbon Credit Trading Scheme (CCTS) draft guidelines. Certification status: Self-declared V1 protocol with end-to-end plot traceability.",
  },
};

function readData(): AppData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf8");
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading store.json, using fallback initial data", err);
    return INITIAL_DATA;
  }
}

function writeData(data: AppData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing store.json", err);
  }
}

export const dataStore = {
  getRawData(): AppData {
    return readData();
  },

  getStats() {
    const data = readData();
    const farmersEnrolled = data.farmers.length;
    const tonsCredited = data.creditBatches
      .filter((b) => b.status === "active" || b.status === "retired")
      .reduce((acc, b) => acc + b.totalTons, 0);
    const payoutsReleasedPaise = data.payouts
      .filter((p) => p.status === "paid")
      .reduce((acc, p) => acc + p.amountInrPaise, 0);
    const statesCovered = new Set(data.farmers.map((f) => f.stateId)).size;

    return {
      farmersEnrolled,
      tonsCredited,
      payoutsReleasedPaise,
      payoutsReleasedInr: Math.round(payoutsReleasedPaise / 100),
      statesCovered,
    };
  },

  // Users
  getUserByPhone(phone: string): StoredUser | undefined {
    const data = readData();
    return data.users.find((u) => u.phone === phone);
  },

  getUserById(id: string): StoredUser | undefined {
    const data = readData();
    return data.users.find((u) => u.id === id);
  },

  upsertUser(phone: string, role: StoredUser["role"], languagePref = "en"): StoredUser {
    const data = readData();
    let user = data.users.find((u) => u.phone === phone);
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        phone,
        role,
        languagePref,
        createdAt: new Date().toISOString(),
      };
      data.users.push(user);
    } else {
      user.role = role;
      user.languagePref = languagePref;
    }
    writeData(data);
    return user;
  },

  // Farmers
  getFarmers(): StoredFarmer[] {
    return readData().farmers;
  },

  getFarmerById(id: string): StoredFarmer | undefined {
    return readData().farmers.find((f) => f.id === id);
  },

  getFarmerByUserId(userId: string): StoredFarmer | undefined {
    return readData().farmers.find((f) => f.userId === userId);
  },

  createFarmer(farmer: Omit<StoredFarmer, "id" | "createdAt" | "kycStatus">): StoredFarmer {
    const data = readData();
    const newFarmer: StoredFarmer = {
      ...farmer,
      id: crypto.randomUUID(),
      kycStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    data.farmers.push(newFarmer);
    writeData(data);
    return newFarmer;
  },

  updateFarmerKyc(id: string, status: "pending" | "approved" | "rejected"): StoredFarmer | null {
    const data = readData();
    const farmer = data.farmers.find((f) => f.id === id);
    if (!farmer) return null;
    farmer.kycStatus = status;
    writeData(data);
    return farmer;
  },

  // Plots
  getPlotsByFarmerId(farmerId: string): StoredPlot[] {
    return readData().plots.filter((p) => p.farmerId === farmerId);
  },

  getPlotById(id: string): StoredPlot | undefined {
    return readData().plots.find((p) => p.id === id);
  },

  createPlot(plot: Omit<StoredPlot, "id" | "createdAt">): StoredPlot {
    const data = readData();
    const newPlot: StoredPlot = {
      ...plot,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    data.plots.push(newPlot);
    writeData(data);
    return newPlot;
  },

  // Baselines
  getBaselinesByPlotId(plotId: string): StoredBaseline[] {
    return readData().baselines.filter((b) => b.plotId === plotId);
  },

  addBaseline(baseline: Omit<StoredBaseline, "id" | "createdAt">): StoredBaseline {
    const data = readData();
    const newBaseline: StoredBaseline = {
      ...baseline,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    data.baselines.push(newBaseline);
    writeData(data);
    return newBaseline;
  },

  // Practices & Additionality
  getPracticesByFarmerId(farmerId: string): StoredPractice[] {
    return readData().practices.filter((p) => p.farmerId === farmerId);
  },

  checkAdditionality(plotId: string, proposedPractice: string): { passed: boolean; reason: string } {
    const baselines = this.getBaselinesByPlotId(plotId);
    // If the baseline shows the proposed practice was already customarily used in the last 3 years:
    const alreadyUsed = baselines.some((b) => {
      if (proposedPractice === "no_till" && b.tillagePractice === "no_till") return true;
      if (proposedPractice === "residue_retention" && b.residuePractice === "retained") return true;
      return false;
    });

    if (alreadyUsed) {
      return {
        passed: false,
        reason: "Practice already in use during baseline period. Fails additionality requirement under CarbonKheti rules.",
      };
    }

    return {
      passed: true,
      reason: "Practice is new compared to historical baseline. Additionality criteria met.",
    };
  },

  createPractice(practice: Omit<StoredPractice, "id" | "createdAt" | "status" | "additionalityPassed" | "additionalityNote">): {
    practice: StoredPractice;
    additionalityPassed: boolean;
  } {
    const data = readData();
    const additionality = this.checkAdditionality(practice.plotId, practice.practiceType);

    const newPractice: StoredPractice = {
      ...practice,
      id: crypto.randomUUID(),
      status: "pending",
      additionalityPassed: additionality.passed,
      additionalityNote: additionality.reason,
      createdAt: new Date().toISOString(),
    };

    data.practices.push(newPractice);
    writeData(data);
    return { practice: newPractice, additionalityPassed: additionality.passed };
  },

  // Evidence & Fraud checks
  addEvidence(evidenceItem: Omit<StoredEvidence, "id" | "createdAt" | "isDuplicateHash" | "status">): {
    evidence: StoredEvidence;
    isDuplicate: boolean;
  } {
    const data = readData();
    // SHA-256 Dedup Check
    const isDuplicate = data.evidence.some((e) => e.fileHash === evidenceItem.fileHash);

    const newEvidence: StoredEvidence = {
      ...evidenceItem,
      id: crypto.randomUUID(),
      isDuplicateHash: isDuplicate,
      status: isDuplicate ? "rejected" : "pending",
      createdAt: new Date().toISOString(),
    };

    data.evidence.push(newEvidence);
    writeData(data);
    return { evidence: newEvidence, isDuplicate };
  },

  getEvidenceByPracticeId(practiceId: string): StoredEvidence[] {
    return readData().evidence.filter((e) => e.practiceId === practiceId);
  },

  verifyEvidence(evidenceId: string, status: "verified" | "rejected", notes?: string) {
    const data = readData();
    const item = data.evidence.find((e) => e.id === evidenceId);
    if (!item) return null;
    item.status = status;
    if (notes) item.notes = notes;
    writeData(data);
    return item;
  },

  // Batches
  getCreditBatches(): StoredCreditBatch[] {
    return readData().creditBatches;
  },

  createCreditBatch(params: {
    practiceType: string;
    vintageYear: number;
    stateId: number;
    districtId: number;
    totalTons: number;
    pricePerTonInrPaise: number;
    plotIds: string[];
    cctsNote: string;
    createdByUserId: string;
  }): { batch: StoredCreditBatch; creditsCreated: number } {
    const data = readData();
    const state = STATES_SEED.find((s) => s.id === params.stateId);
    const stateCode = state ? state.code : "IN";
    const serialPrefix = `CK-${stateCode}-${params.vintageYear}`;

    const existingBatches = data.creditBatches.filter((b) => b.serialPrefix === serialPrefix);
    const startSerial = existingBatches.length > 0
      ? Math.max(...existingBatches.map((b) => b.endSerial)) + 1
      : 1;
    const endSerial = startSerial + Math.ceil(params.totalTons) - 1;

    const batchId = crypto.randomUUID();
    const newBatch: StoredCreditBatch = {
      id: batchId,
      serialPrefix,
      startSerial,
      endSerial,
      practiceType: params.practiceType,
      vintageYear: params.vintageYear,
      stateId: params.stateId,
      districtId: params.districtId,
      totalTons: params.totalTons,
      availableTons: params.totalTons,
      pricePerTonInr: params.pricePerTonInrPaise,
      status: "active",
      cctsNote: params.cctsNote,
      plotIds: params.plotIds,
      createdByUserId: params.createdByUserId,
      createdAt: new Date().toISOString(),
    };

    // Mark plots with this active batch id
    data.plots.forEach((p) => {
      if (params.plotIds.includes(p.id)) {
        p.activeBatchId = batchId;
      }
    });

    // Create unique serial numbers for each credit ton
    let createdCount = 0;
    for (let i = startSerial; i <= endSerial; i++) {
      const serialNumber = `${serialPrefix}-${String(i).padStart(6, "0")}`;
      data.credits.push({
        serialNumber,
        batchId,
        status: "issued",
        createdAt: new Date().toISOString(),
      });
      createdCount++;
    }

    data.creditBatches.push(newBatch);
    writeData(data);
    return { batch: newBatch, creditsCreated: createdCount };
  },

  // Orders
  getOrders(): StoredOrder[] {
    return readData().orders;
  },

  createOrder(params: {
    factoryId: string;
    companyName: string;
    batchId: string;
    tonsRequested: number;
  }): StoredOrder | { error: string } {
    const data = readData();
    const batch = data.creditBatches.find((b) => b.id === params.batchId);
    if (!batch) return { error: "Batch not found" };
    if (batch.availableTons < params.tonsRequested) {
      return { error: `Insufficient tons available in this batch (${batch.availableTons} available)` };
    }

    const orderId = crypto.randomUUID();
    const invoiceNumber = `INV-CK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmountInrPaise = Math.round(params.tonsRequested * batch.pricePerTonInr);

    batch.availableTons -= params.tonsRequested;

    const newOrder: StoredOrder = {
      id: orderId,
      factoryId: params.factoryId,
      companyName: params.companyName,
      batchId: params.batchId,
      tonsRequested: params.tonsRequested,
      pricePerTonInrPaise: batch.pricePerTonInr,
      totalAmountInrPaise,
      status: "pending",
      invoiceNumber,
      gstRate: 18,
      createdAt: new Date().toISOString(),
    };

    data.orders.push(newOrder);

    // Calculate payouts according to platform benefit-split formula
    // Default: 70% to Farmer, 10% platform, 10% verification, 10% buffer
    const farmerPoolPaise = Math.round((totalAmountInrPaise * (data.config.farmerSplitPct || 70)) / 100);

    // Find farmers in this batch's plots
    const batchPlots = data.plots.filter((p) => batch.plotIds.includes(p.id));
    const uniqueFarmerIds = Array.from(new Set(batchPlots.map((p) => p.farmerId)));
    if (uniqueFarmerIds.length > 0) {
      const perFarmerPaise = Math.round(farmerPoolPaise / uniqueFarmerIds.length);
      uniqueFarmerIds.forEach((farmerId) => {
        // Create 3-stage payouts: Signup (20%), Mid-Season (40%), Final (40%)
        const signupAmount = Math.round(perFarmerPaise * 0.2);
        const midAmount = Math.round(perFarmerPaise * 0.4);
        const finalAmount = perFarmerPaise - signupAmount - midAmount;

        data.payouts.push({
          id: crypto.randomUUID(),
          farmerId,
          orderId,
          batchId: batch.id,
          stage: "signup",
          amountInrPaise: signupAmount,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
        data.payouts.push({
          id: crypto.randomUUID(),
          farmerId,
          orderId,
          batchId: batch.id,
          stage: "mid_season",
          amountInrPaise: midAmount,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
        data.payouts.push({
          id: crypto.randomUUID(),
          farmerId,
          orderId,
          batchId: batch.id,
          stage: "final",
          amountInrPaise: finalAmount,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      });
    }

    writeData(data);
    return newOrder;
  },

  confirmOrder(orderId: string): StoredOrder | null {
    const data = readData();
    const order = data.orders.find((o) => o.id === orderId);
    if (!order) return null;
    order.status = "confirmed";
    writeData(data);
    return order;
  },

  // Payouts
  getPayoutsByFarmerId(farmerId: string): StoredPayout[] {
    return readData().payouts.filter((p) => p.farmerId === farmerId);
  },

  getAllPayouts(): StoredPayout[] {
    return readData().payouts;
  },

  releasePayout(payoutId: string): StoredPayout | null {
    const data = readData();
    const payout = data.payouts.find((p) => p.id === payoutId);
    if (!payout) return null;
    payout.status = "paid";
    payout.paidAt = new Date().toISOString();
    writeData(data);
    return payout;
  },

  // Grievances
  getGrievances(): StoredGrievance[] {
    return readData().grievances;
  },

  createGrievance(userId: string, text?: string, voiceNoteUrl?: string): StoredGrievance {
    const data = readData();
    const item: StoredGrievance = {
      id: crypto.randomUUID(),
      userId,
      text,
      voiceNoteUrl,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    data.grievances.push(item);
    writeData(data);
    return item;
  },

  resolveGrievance(id: string, note: string): StoredGrievance | null {
    const data = readData();
    const item = data.grievances.find((g) => g.id === id);
    if (!item) return null;
    item.status = "resolved";
    item.resolutionNote = note;
    item.resolvedAt = new Date().toISOString();
    writeData(data);
    return item;
  },

  // Consents
  recordConsent(consent: Omit<StoredConsent, "id">): StoredConsent {
    const data = readData();
    const newConsent: StoredConsent = {
      ...consent,
      id: crypto.randomUUID(),
    };
    data.consents.push(newConsent);
    writeData(data);
    return newConsent;
  },

  // Platform Config
  getConfig(): PlatformConfigStore {
    return readData().config;
  },

  updateConfig(updates: Partial<PlatformConfigStore>): PlatformConfigStore {
    const data = readData();
    data.config = { ...data.config, ...updates };
    writeData(data);
    return data.config;
  },
};
