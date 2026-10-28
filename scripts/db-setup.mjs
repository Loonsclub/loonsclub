// Creates the tables in db/schema.sql. Usage: npm run db:setup (reads DATABASE_URL from .env.local)
import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add your Supabase or Neon connection string to .env.local.");
  process.exit(1);
}

const sql = postgres(url, { prepare: false, ssl: /@(localhost|127\.0\.0\.1)[:/]/.test(url) ? false : "require", max: 1 });
try {
  await sql.unsafe(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
  console.log("Database schema is ready.");
} finally {
  await sql.end();
}
