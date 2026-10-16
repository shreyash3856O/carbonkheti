import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Singleton pattern for serverless environments
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export type DB = typeof db;
