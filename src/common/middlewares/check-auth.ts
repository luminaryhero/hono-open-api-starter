/**
 * @module
 * Basic Auth Middleware for Hono.
 */

import type { MiddlewareHandler } from "hono/types";

import { HTTPException } from "hono/http-exception";

interface BasicAuthOptions {
  roles?: string[];
  permissions?: string[];
}

/**
 * Role and Permission Auth Middleware for Hono.
 */
function checkAuth(options: BasicAuthOptions): MiddlewareHandler {
  const { roles, permissions } = options;

  return async function basicAuth(ctx, next) {
    const jwtPayload = ctx.get("jwtPayload");
    const currentRole = jwtPayload?.role || "user";
    const userPermissions = jwtPayload?.permissions || [];

    console.log("currentRole", jwtPayload);
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
