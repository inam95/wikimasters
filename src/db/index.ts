import assert from "node:assert";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import "dotenv/config";

assert(process.env.DATABASE_URL, "DATABASE_URL is not set");

export const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

export default db;
