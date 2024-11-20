import { DefaultLogger } from "drizzle-orm/logger";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "@/env";

import * as articleSchema from "./schemas/article";
import * as articleToTagSchema from "./schemas/article-to-tag";
import * as commentSchema from "./schemas/comment";
import * as permissionSchema from "./schemas/permission";
import * as roleSchema from "./schemas/role";
import * as roleToPermSchema from "./schemas/role-to-permission";
import * as tagSchema from "./schemas/tag";
import * as taskSchema from "./schemas/task";
import * as userSchema from "./schemas/user";
import * as userToRoleSchema from "./schemas/user-to-role";

const schema = {
  ...articleSchema,
  ...articleToTagSchema,
  ...commentSchema,
  ...tagSchema,
  ...taskSchema,
  ...userSchema,
  ...roleSchema,
  ...userToRoleSchema,
  ...roleToPermSchema,
  ...permissionSchema,
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
