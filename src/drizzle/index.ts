import { DefaultLogger } from "drizzle-orm/logger";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "@/env";

import * as articleSchema from "./schemas/article";
import * as commentSchema from "./schemas/comment";
import * as taskSchema from "./schemas/task";
import * as userSchema from "./schemas/user";

const logger = new DefaultLogger();

const client = postgres(env.DATABASE_URL);
const db = drizzle({
  client,
  logger,
  schema: { ...taskSchema, ...userSchema, ...articleSchema, ...commentSchema },
});

export default db;
