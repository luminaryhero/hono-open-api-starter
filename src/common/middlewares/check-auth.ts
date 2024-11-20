import type { MiddlewareHandler } from "hono/types";

import { HTTPException } from "hono/http-exception";

interface AuthOptions {
  roles?: string[];
}

/**
 * Role and Permission Auth Middleware for Hono.
 */
function checkAuth(options: AuthOptions): MiddlewareHandler {
  const { roles } = options;

  return async function checkAuth(ctx, next) {
    const jwtPayload = ctx.get("jwtPayload");
    const currentRole = jwtPayload?.role || "user";

    if (roles && !roles.includes(currentRole)) {
      throw new HTTPException(401, {
        message: "Current role Unauthorized",
      });
    }

    await next();
  };
}

export default checkAuth;
