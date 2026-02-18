import { defineConfig } from "drizzle-kit";
import { ENV } from "./server/_core/env";

const connectionString = ENV.databaseUrl || "sqlite:./dev.db";

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

const isSqlite = connectionString.startsWith('sqlite:');

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: isSqlite ? "sqlite" : "mysql",
  dbCredentials: isSqlite ? {
    url: connectionString.replace('sqlite:', ''),
  } : {
    url: connectionString,
  },
});
