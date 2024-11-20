import { defineConfig } from "drizzle-kit";

import env from "@/env";

export default defineConfig({
  // schema: "./src/drizzle/schemas/*.ts",
  schema: ["./src/drizzle/schema.ts", "./src/drizzle/relations.ts"],
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  casing: "snake_case",
  verbose: true,
});
