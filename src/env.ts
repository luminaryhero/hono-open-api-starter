import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(dotenv.config());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  PORT: z.coerce.number().default(9999),
});

// eslint-disable-next-line node/no-process-env
const env = envSchema.parse(process.env);

export default env;
