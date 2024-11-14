import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import env from "@/env";

const client = createClient({
  url: env.DATABASE_URL,
});

const db = drizzle(client);

export default db;
