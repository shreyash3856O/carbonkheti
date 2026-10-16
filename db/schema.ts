import {
  pgTable,
  text,
  varchar,
  integer,
  bigint,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
  primaryKey,
  real,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ─────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "farmer",
  "agent",
  "cooperative",
  "factory_buyer",
  "admin",
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

export const practiceTypeEnum = pgEnum("practice_type", [
  "no_till",
  "reduced_tillage",
  "cover_crops",
  "residue_retention",
  "alternate_wetting_drying",
  "agroforestry",
  "boundary_trees",
]);

export const irrigationTypeEnum = pgEnum("irrigation_type", [
  "rainfed",
  "flood",
  "drip",
  "sprinkler",
  "none",
]);

export const tillageTypeEnum = pgEnum("tillage_type", [
  "conventional",
  "reduced",
  "no_till",
  "minimum",
]);

export const residuePracticeEnum = pgEnum("residue_practice", [
  "burned",
  "incorporated",
  "retained",
  "removed",
]);

export const fertiliserTypeEnum = pgEnum("fertiliser_type", [
  "chemical_urea",
  "chemical_dap",
  "chemical_mixed",
  "organic_compost",
  "organic_fym",
  "organic_vermi",
  "biofertiliser",
  "none",
]);

export const evidenceStatusEnum = pgEnum("evidence_status", [
  "pending",
  "verified",
  "rejected",
]);

export const batchStatusEnum = pgEnum("batch_status", [
  "draft",
  "active",
  "retired",
  "cancelled",
]);

export const creditStatusEnum = pgEnum("credit_status", [
  "issued",
  "retired",
  "cancelled",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "invoice_sent",
  "paid",
  "cancelled",
]);

export const payoutStageEnum = pgEnum("payout_stage", [
  "signup",
  "mid_season",
  "final",
]);

export const payoutStatusEnum = pgEnum("payout_status", [
  "pending",
  "processing",
  "paid",
  "failed",
]);

export const grievanceStatusEnum = pgEnum("grievance_status", [
  "open",
  "in_progress",
  "resolved",
  "closed",
]);

export const consentTypeEnum = pgEnum("consent_type", [
  "data_usage",
  "photo_sharing",
  "story_sharing",
  "payout_terms",
  "cooling_off",
  "dpdp_notice",
]);

export const landUnitEnum = pgEnum("land_unit", [
  "acres",
  "hectares",
  "bigha",
  "guntha",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "approve",
  "reject",
  "verify",
  "pay",
]);

// ─── Reference Tables ──────────────────────────────────────────────────────────

export const states = pgTable("states", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  code: varchar("code", { length: 4 }).notNull().unique(),
});

export const districts = pgTable(
  "districts",
  {
    id: serial("id").primaryKey(),
    stateId: integer("state_id")
      .notNull()
      .references(() => states.id),
    name: varchar("name", { length: 100 }).notNull(),
  },
  (t) => [index("districts_state_idx").on(t.stateId)]
);

export const talukas = pgTable(
  "talukas",
  {
    id: serial("id").primaryKey(),
    districtId: integer("district_id")
      .notNull()
      .references(() => districts.id),
    name: varchar("name", { length: 100 }).notNull(),
  },
  (t) => [index("talukas_district_idx").on(t.districtId)]
);

export const villages = pgTable(
  "villages",
  {
    id: serial("id").primaryKey(),
    talukaId: integer("taluka_id")
      .notNull()
      .references(() => talukas.id),
    name: varchar("name", { length: 100 }).notNull(),
  },
  (t) => [index("villages_taluka_idx").on(t.talukaId)]
);

export const cropList = pgTable("crop_list", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 100 }).notNull(),
  nameHi: varchar("name_hi", { length: 100 }),
  nameMr: varchar("name_mr", { length: 100 }),
  category: varchar("category", { length: 50 }), // cereal, pulse, oilseed, fiber, sugarcane, horticulture
});

// ─── Users & Auth ──────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // UUID
    phone: varchar("phone", { length: 15 }).notNull(), // +91XXXXXXXXXX
    role: userRoleEnum("role").notNull(),
    languagePref: varchar("language_pref", { length: 10 }).notNull().default("en"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    lastLoginAt: timestamp("last_login_at"),
  },
  (t) => [uniqueIndex("users_phone_idx").on(t.phone)]
);

export const otpTokens = pgTable(
  "otp_tokens",
  {
    id: serial("id").primaryKey(),
    phone: varchar("phone", { length: 15 }).notNull(),
    otp: varchar("otp", { length: 6 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    usedAt: timestamp("used_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("otp_phone_idx").on(t.phone)]
);

// ─── Cooperatives & Agents ─────────────────────────────────────────────────────

export const cooperatives = pgTable("cooperatives", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 200 }).notNull(),
  regNumber: varchar("reg_number", { length: 100 }),
  stateId: integer("state_id").references(() => states.id),
  districtId: integer("district_id").references(() => districts.id),
  contactName: varchar("contact_name", { length: 100 }),
  contactPhone: varchar("contact_phone", { length: 15 }),
  approvalStatus: approvalStatusEnum("approval_status").notNull().default("pending"),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by").references(() => users.id),
  kycDocUrl: text("kyc_doc_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  cooperativeId: text("cooperative_id").references(() => cooperatives.id),
  name: varchar("name", { length: 100 }).notNull(),
  approvalStatus: approvalStatusEnum("approval_status").notNull().default("pending"),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Farmers ───────────────────────────────────────────────────────────────────

export const farmers = pgTable("farmers", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  cooperativeId: text("cooperative_id").references(() => cooperatives.id),
  enrolledByAgentId: text("enrolled_by_agent_id").references(() => agents.id),
  // Personal details
  nameLocal: varchar("name_local", { length: 100 }).notNull(),
  nameEn: varchar("name_en", { length: 100 }),
  fatherHusbandName: varchar("father_husband_name", { length: 100 }),
  // Location
  villageId: integer("village_id").references(() => villages.id),
  villageName: varchar("village_name", { length: 100 }), // fallback if not in ref table
  talukaId: integer("taluka_id").references(() => talukas.id),
  districtId: integer("district_id").references(() => districts.id),
  stateId: integer("state_id").references(() => states.id),
  // Bank / UPI (encrypted at rest — store encrypted blob)
  bankDetailsEncrypted: text("bank_details_encrypted"),
  upiId: text("upi_id"), // stored encrypted
  // KYC & status
  landDocUrl: text("land_doc_url"),
  landDocType: varchar("land_doc_type", { length: 50 }), // 712_extract, khasra_khatauni, patta
  kycStatus: approvalStatusEnum("kyc_status").notNull().default("pending"),
  // Consent tracking
  consentCompletedAt: timestamp("consent_completed_at"),
  coolingOffEndsAt: timestamp("cooling_off_ends_at"),
  // Photo sharing (consent-gated)
  photoUrl: text("photo_url"),
  photoConsentGranted: boolean("photo_consent_granted").notNull().default(false),
  storyText: text("story_text"),
  storyVoiceUrl: text("story_voice_url"),
  storyConsentGranted: boolean("story_consent_granted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Plots ─────────────────────────────────────────────────────────────────────

export const plots = pgTable(
  "plots",
  {
    id: text("id").primaryKey(),
    farmerId: text("farmer_id")
      .notNull()
      .references(() => farmers.id),
    plotName: varchar("plot_name", { length: 100 }),
    surveyNumber: varchar("survey_number", { length: 50 }),
    // Geometry stored as GeoJSON text (PostGIS geometry column added via migration)
    geometryGeoJson: text("geometry_geojson"), // polygon boundary
    centerLat: real("center_lat"),
    centerLng: real("center_lng"),
    // Area
    areaValue: real("area_value").notNull(),
    areaUnit: landUnitEnum("area_unit").notNull().default("acres"),
    areaAcres: real("area_acres"), // computed canonical value
    // Land document
    landDocUrl: text("land_doc_url"),
    landDocType: varchar("land_doc_type", { length: 50 }),
    // Admin
    isActive: boolean("is_active").notNull().default(true),
    activeBatchId: text("active_batch_id"), // FK added below to avoid circular
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("plots_farmer_idx").on(t.farmerId)]
);

// ─── Baselines ─────────────────────────────────────────────────────────────────

export const baselines = pgTable(
  "baselines",
  {
    id: serial("id").primaryKey(),
    plotId: text("plot_id")
      .notNull()
      .references(() => plots.id),
    year: integer("year").notNull(), // e.g. 2022, 2023, 2024
    tillagePractice: tillageTypeEnum("tillage_practice"),
    fertilizerType: fertiliserTypeEnum("fertilizer_type"),
    irrigationType: irrigationTypeEnum("irrigation_type"),
    residuePractice: residuePracticeEnum("residue_practice"),
    cropId: integer("crop_id").references(() => cropList.id),
    cropNameFreeform: varchar("crop_name_freeform", { length: 100 }),
    recordedByUserId: text("recorded_by_user_id").references(() => users.id),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("baselines_plot_year_idx").on(t.plotId, t.year)]
);

// ─── Practices ─────────────────────────────────────────────────────────────────

export const practices = pgTable(
  "practices",
  {
    id: text("id").primaryKey(),
    farmerId: text("farmer_id")
      .notNull()
      .references(() => farmers.id),
    plotId: text("plot_id")
      .notNull()
      .references(() => plots.id),
    practiceType: practiceTypeEnum("practice_type").notNull(),
    seasonYear: integer("season_year").notNull(),
    seasonLabel: varchar("season_label", { length: 50 }), // e.g. "Kharif 2025"
    cropId: integer("crop_id").references(() => cropList.id),
    cropNameFreeform: varchar("crop_name_freeform", { length: 100 }),
    status: approvalStatusEnum("status").notNull().default("pending"),
    // Additionality check result
    additionalityPassed: boolean("additionality_passed"),
    additionalityNote: text("additionality_note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("practices_farmer_idx").on(t.farmerId)]
);

// ─── Evidence (photo logs) ─────────────────────────────────────────────────────

export const evidence = pgTable(
  "evidence",
  {
    id: text("id").primaryKey(),
    practiceId: text("practice_id")
      .notNull()
      .references(() => practices.id),
    fileUrl: text("file_url").notNull(),
    fileHash: varchar("file_hash", { length: 64 }).notNull(), // SHA-256, for dedup
    mimeType: varchar("mime_type", { length: 50 }),
    fileSizeBytes: integer("file_size_bytes"),
    // Geo-tag
    geoLat: real("geo_lat"),
    geoLng: real("geo_lng"),
    geoAccuracyM: real("geo_accuracy_m"),
    // Timestamp (may differ from created_at if uploaded offline)
    capturedAt: timestamp("captured_at").notNull(),
    // Who captured
    capturedByUserId: text("captured_by_user_id").references(() => users.id),
    // Offline queue support
    offlineId: varchar("offline_id", { length: 100 }),
    syncedAt: timestamp("synced_at"),
    // Checklist context
    checklistItemId: varchar("checklist_item_id", { length: 100 }),
    notes: text("notes"),
    // Fraud checks
    gpsInsidePlot: boolean("gps_inside_plot"),
    isDuplicateHash: boolean("is_duplicate_hash").notNull().default(false),
    status: evidenceStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("evidence_practice_idx").on(t.practiceId),
    uniqueIndex("evidence_hash_idx").on(t.fileHash),
  ]
);

// ─── Verifications ─────────────────────────────────────────────────────────────

export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  practiceId: text("practice_id")
    .notNull()
    .references(() => practices.id),
  verifiedByUserId: text("verified_by_user_id")
    .notNull()
    .references(() => users.id),
  status: evidenceStatusEnum("status").notNull(),
  notes: text("notes"),
  // MRV satellite stub
  satelliteProvider: varchar("satellite_provider", { length: 50 }).default("none"),
  satelliteResult: jsonb("satellite_result"), // null in v1 stub
  verifiedAt: timestamp("verified_at").notNull().defaultNow(),
});

// ─── Credit Batches ────────────────────────────────────────────────────────────

export const creditBatches = pgTable(
  "credit_batches",
  {
    id: text("id").primaryKey(),
    serialPrefix: varchar("serial_prefix", { length: 20 }).notNull(), // e.g. "CK-MH-2025"
    startSerial: integer("start_serial").notNull(),
    endSerial: integer("end_serial").notNull(),
    // Batch details
    practiceType: practiceTypeEnum("practice_type").notNull(),
    vintageYear: integer("vintage_year").notNull(),
    stateId: integer("state_id").references(() => states.id),
    districtId: integer("district_id").references(() => districts.id),
    totalTons: real("total_tons").notNull(),
    pricePerTonInr: integer("price_per_ton_inr"), // paise
    // Status
    status: batchStatusEnum("status").notNull().default("draft"),
    // CCTS compliance note (admin fills in, no claim of certification)
    cctsNote: text("ccts_note"),
    // Co-benefits
    coBenefits: jsonb("co_benefits"),
    // Admin
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => users.id),
    approvedByUserId: text("approved_by_user_id").references(() => users.id),
    approvedAt: timestamp("approved_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("batches_status_idx").on(t.status),
    index("batches_practice_idx").on(t.practiceType),
  ]
);

// ─── Batch → Plot join ─────────────────────────────────────────────────────────

export const batchPlots = pgTable(
  "batch_plots",
  {
    batchId: text("batch_id")
      .notNull()
      .references(() => creditBatches.id),
    plotId: text("plot_id")
      .notNull()
      .references(() => plots.id),
    practiceId: text("practice_id").references(() => practices.id),
    tonsAllocated: real("tons_allocated"),
  },
  (t) => [primaryKey({ columns: [t.batchId, t.plotId] })]
);

// ─── Credits (individual serial numbers) ──────────────────────────────────────

export const credits = pgTable(
  "credits",
  {
    serialNumber: varchar("serial_number", { length: 50 }).primaryKey(),
    batchId: text("batch_id")
      .notNull()
      .references(() => creditBatches.id),
    status: creditStatusEnum("status").notNull().default("issued"),
    retiredAt: timestamp("retired_at"),
    retiredByOrderId: text("retired_by_order_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("credits_batch_idx").on(t.batchId)]
);

// ─── Factory Buyers ────────────────────────────────────────────────────────────

export const factoryBuyers = pgTable("factory_buyers", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  companyName: varchar("company_name", { length: 200 }).notNull(),
  gstin: varchar("gstin", { length: 15 }), // format validation only
  cin: varchar("cin", { length: 21 }), // format validation only
  contactName: varchar("contact_name", { length: 100 }),
  contactEmail: varchar("contact_email", { length: 200 }),
  industry: varchar("industry", { length: 100 }),
  kycDocUrl: text("kyc_doc_url"),
  approvalStatus: approvalStatusEnum("approval_status").notNull().default("pending"),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by").references(() => users.id),
  // Supply-chain mapping
  supplyChainCoopIds: jsonb("supply_chain_coop_ids"), // array of cooperative IDs
  optInPublicRegistry: boolean("opt_in_public_registry").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Orders ────────────────────────────────────────────────────────────────────

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    factoryId: text("factory_id")
      .notNull()
      .references(() => factoryBuyers.id),
    batchId: text("batch_id")
      .notNull()
      .references(() => creditBatches.id),
    tonsRequested: real("tons_requested").notNull(),
    pricePerTonInr: integer("price_per_ton_inr").notNull(), // paise
    totalAmountInrPaise: bigint("total_amount_inr_paise", { mode: "number" }),
    priceFloorInr: integer("price_floor_inr"),
    isMultiYear: boolean("is_multi_year").notNull().default(false),
    multiYearTermYears: integer("multi_year_term_years"),
    status: orderStatusEnum("status").notNull().default("pending"),
    // Invoice (draft PDF)
    invoicePdfUrl: text("invoice_pdf_url"),
    invoiceNumber: varchar("invoice_number", { length: 50 }),
    gstRate: real("gst_rate").notNull().default(18), // 18% placeholder — legal review required
    // Admin
    confirmedByUserId: text("confirmed_by_user_id").references(() => users.id),
    confirmedAt: timestamp("confirmed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("orders_factory_idx").on(t.factoryId)]
);

// ─── Payouts ───────────────────────────────────────────────────────────────────

export const payouts = pgTable(
  "payouts",
  {
    id: text("id").primaryKey(),
    farmerId: text("farmer_id")
      .notNull()
      .references(() => farmers.id),
    orderId: text("order_id").references(() => orders.id),
    batchId: text("batch_id").references(() => creditBatches.id),
    stage: payoutStageEnum("stage").notNull(),
    amountInrPaise: bigint("amount_inr_paise", { mode: "number" }).notNull(),
    status: payoutStatusEnum("status").notNull().default("pending"),
    paymentProvider: varchar("payment_provider", { length: 50 }).default("stub"),
    paymentRef: varchar("payment_ref", { length: 100 }),
    scheduledAt: timestamp("scheduled_at"),
    paidAt: timestamp("paid_at"),
    failureReason: text("failure_reason"),
    markedPaidByUserId: text("marked_paid_by_user_id").references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("payouts_farmer_idx").on(t.farmerId)]
);

// ─── Grievances ────────────────────────────────────────────────────────────────

export const grievances = pgTable("grievances", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  text: text("text"),
  voiceNoteUrl: text("voice_note_url"),
  status: grievanceStatusEnum("status").notNull().default("open"),
  resolvedByUserId: text("resolved_by_user_id").references(() => users.id),
  resolutionNote: text("resolution_note"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Consents ──────────────────────────────────────────────────────────────────

export const consents = pgTable(
  "consents",
  {
    id: serial("id").primaryKey(),
    farmerId: text("farmer_id")
      .notNull()
      .references(() => farmers.id),
    consentType: consentTypeEnum("consent_type").notNull(),
    grantedAt: timestamp("granted_at"),
    grantedByUserId: text("granted_by_user_id").references(() => users.id), // agent if assisted
    withdrawnAt: timestamp("withdrawn_at"),
    withdrawnByUserId: text("withdrawn_by_user_id").references(() => users.id),
    languageAtConsent: varchar("language_at_consent", { length: 10 }),
    isAgentAssisted: boolean("is_agent_assisted").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("consents_farmer_type_idx").on(t.farmerId, t.consentType),
    index("consents_farmer_idx").on(t.farmerId),
  ]
);

// ─── Platform Config ───────────────────────────────────────────────────────────

export const platformConfig = pgTable(
  "platform_config",
  {
    key: varchar("key", { length: 100 }).primaryKey(),
    value: text("value").notNull(),
    description: text("description"),
    updatedByUserId: text("updated_by_user_id").references(() => users.id),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

// ─── Audit Log ─────────────────────────────────────────────────────────────────

export const auditLog = pgTable(
  "audit_log",
  {
    id: serial("id").primaryKey(),
    tableName: varchar("table_name", { length: 100 }).notNull(),
    rowId: text("row_id").notNull(),
    action: auditActionEnum("action").notNull(),
    oldVal: jsonb("old_val"),
    newVal: jsonb("new_val"),
    byUserId: text("by_user_id").references(() => users.id),
    at: timestamp("at").notNull().defaultNow(),
    ipAddress: varchar("ip_address", { length: 50 }),
    userAgent: text("user_agent"),
  },
  (t) => [
    index("audit_table_row_idx").on(t.tableName, t.rowId),
    index("audit_user_idx").on(t.byUserId),
  ]
);

// ─── Relations ─────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  farmer: one(farmers, { fields: [users.id], references: [farmers.userId] }),
  cooperative: one(cooperatives, { fields: [users.id], references: [cooperatives.userId] }),
  agent: one(agents, { fields: [users.id], references: [agents.userId] }),
  factoryBuyer: one(factoryBuyers, { fields: [users.id], references: [factoryBuyers.userId] }),
}));

export const farmersRelations = relations(farmers, ({ one, many }) => ({
  user: one(users, { fields: [farmers.userId], references: [users.id] }),
  cooperative: one(cooperatives, { fields: [farmers.cooperativeId], references: [cooperatives.id] }),
  plots: many(plots),
  practices: many(practices),
  consents: many(consents),
  payouts: many(payouts),
  village: one(villages, { fields: [farmers.villageId], references: [villages.id] }),
}));

export const plotsRelations = relations(plots, ({ one, many }) => ({
  farmer: one(farmers, { fields: [plots.farmerId], references: [farmers.id] }),
  baselines: many(baselines),
  batchPlots: many(batchPlots),
}));

export const practicesRelations = relations(practices, ({ one, many }) => ({
  farmer: one(farmers, { fields: [practices.farmerId], references: [farmers.id] }),
  plot: one(plots, { fields: [practices.plotId], references: [plots.id] }),
  evidence: many(evidence),
  verifications: many(verifications),
}));

export const creditBatchesRelations = relations(creditBatches, ({ one, many }) => ({
  batchPlots: many(batchPlots),
  credits: many(credits),
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  factory: one(factoryBuyers, { fields: [orders.factoryId], references: [factoryBuyers.id] }),
  batch: one(creditBatches, { fields: [orders.batchId], references: [creditBatches.id] }),
  payouts: many(payouts),
}));

// ─── Type Exports ──────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Farmer = typeof farmers.$inferSelect;
export type NewFarmer = typeof farmers.$inferInsert;
export type Plot = typeof plots.$inferSelect;
export type NewPlot = typeof plots.$inferInsert;
export type Baseline = typeof baselines.$inferSelect;
export type Practice = typeof practices.$inferSelect;
export type Evidence = typeof evidence.$inferSelect;
export type CreditBatch = typeof creditBatches.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Payout = typeof payouts.$inferSelect;
export type Cooperative = typeof cooperatives.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type FactoryBuyer = typeof factoryBuyers.$inferSelect;
export type PlatformConfig = typeof platformConfig.$inferSelect;
export type AuditLog = typeof auditLog.$inferSelect;
export type Consent = typeof consents.$inferSelect;
export type Grievance = typeof grievances.$inferSelect;
