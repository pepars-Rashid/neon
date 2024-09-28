import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: "./src/database/schema.js",
  out: "./public/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL,
  },
});

