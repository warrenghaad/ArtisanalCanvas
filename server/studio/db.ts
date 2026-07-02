import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// The studio reuses the Academy's Neon/Postgres connection. Constructed lazily
// from DATABASE_URL, exactly like server/storage.ts, so studio code stays
// self-contained and does not require refactoring the existing storage module.
const sql = neon(process.env.DATABASE_URL!);
export const studioDb = drizzle(sql);
