import type { MiddlewareHandler } from "hono/types";

import { HTTPException } from "hono/http-exception";

interface AuthOptions {
  roles?: string[];
  permissions?: string[];
}

/**
 * Role and Permission Auth Middleware for Hono.
 */
function checkAuth(options: AuthOptions): MiddlewareHandler {
  const { roles, permissions } = options;

  return async function checkAuth(ctx, next) {
    const jwtPayload = ctx.get("jwtPayload");
    const currentRole = jwtPayload?.role || "user";
    const userPermissions = jwtPayload?.permissions || [];

    if (roles && !roles.includes(currentRole)) {
      throw new HTTPException(401, {
        message: "Current role Unauthorized",
      });
    }

    if (permissions && permissions.length > 0) {
      if (!permissions.every(permission => userPermissions.includes(permission))) {
        throw new HTTPException(401, {
          message: "Current permission Unauthorized",
        });
      }
    }

    await next();
  };
}

export default checkAuth;
