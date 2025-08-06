import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db/schema";
import { Pool } from "pg";
import { pgSchema } from "drizzle-orm/pg-core";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema,
});
