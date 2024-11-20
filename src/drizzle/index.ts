import { DefaultLogger } from "drizzle-orm/logger";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "@/env";

// import * as articleSchema from "./schemas/article";
// import * as articleToTagSchema from "./schemas/article-to-tag";
// import * as commentSchema from "./schemas/comment";
// import * as tagSchema from "./schemas/tag";
// import * as taskSchema from "./schemas/task";
// import * as userSchema from "./schemas/user";

import * as relations from "./relations";
import * as schema from "./schema";

const logger = new DefaultLogger();

const client = postgres(env.DATABASE_URL);
const db = drizzle({
  client,
  logger,
  casing: "snake_case",
  schema: {
    ...schema,
    ...relations,
  },
});

export default db;
