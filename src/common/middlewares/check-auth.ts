import type { MiddlewareHandler } from "hono/types";

import { HTTPException } from "hono/http-exception";
import _ from "lodash";

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
    const userRoles = jwtPayload?.roles || ["user"];
    const userPermissions = jwtPayload?.permissions || [];

    if (roles && roles.length > 0) {
      // 用户角色与所需角色集合没有交集，则抛出异常
      if (_.intersection(roles, userRoles).length === 0) {
        throw new HTTPException(401, {
          message: "Current role Unauthorized",
        });
      }
    }

    if (permissions && permissions.length > 0) {
      // 判断用户权限是否覆盖所需权限集合，不能则抛出异常
      if (_.difference(permissions, userPermissions).length !== 0) {
        throw new HTTPException(401, {
          message: "Current permission Unauthorized",
        });
      }
    }

    await next();
  };
}

export default checkAuth;
