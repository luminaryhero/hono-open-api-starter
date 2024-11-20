import { DefaultLogger } from "drizzle-orm/logger";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "@/env";

import * as taskSchema from "./schemas/task";
import * as userSchema from "./schemas/user";

const schema = {
  ...taskSchema,
  ...userSchema,
};

const logger = new DefaultLogger();

const client = postgres(env.DATABASE_URL);
const db = drizzle({
  client,
  logger,
  casing: "snake_case",
  schema,
});

export default db;
