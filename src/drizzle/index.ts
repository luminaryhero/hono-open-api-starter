import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "@/env";

import * as taskSchema from "./schemas/task";
import * as userSchema from "./schemas/user";

const queryClient = postgres(env.DATABASE_URL);
const db = drizzle({ client: queryClient, schema: { ...taskSchema, ...userSchema } });

export default db;
