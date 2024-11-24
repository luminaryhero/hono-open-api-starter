import { createRoute, z } from "@hono/zod-openapi";

import * as HttpStatusCodes from "@/common/constants/http-status-codes";
import { createOpenAPIRouter } from "@/common/core/create-app";
import { jsonContent, jsonPageResponse, jsonResponse } from "@/common/helpers/openapi";
import { idParamsSchema, pageParamsSchema } from "@/common/helpers/schema";
import checkAuth from "@/common/middlewares/check-auth";
import { profileSchema } from "@/drizzle/schemas/profile";
import * as handler from "@/routers/profile/profile.handler";

/**
 * 更新用户信息
 */
const profileUpdateRoute = createRoute({
  summary: "更新用户信息",
  tags: ["Profile"],
  method: "put",
  path: "/profile",
  security: [{ Bearer: [] }],
  request: {
    params: idParamsSchema,
    body: jsonContent(
      z.object({
        username: z.string(),
        gender: z.number().refine(value => [0, 1, 2].includes(value), "gender must be 0, 1 or 2"),
        birthday: z.date(),
        signature: z.string(),
      }),
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(profileSchema),
  },
});

/**
 * 更新头像
 */
const avatarUpdateRoute = createRoute({
  summary: "更新头像",
  tags: ["Profile"],
  method: "put",
  path: "/profile/avatar",
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: ["file"],
            properties: {
              file: {
                type: "string",
                format: "binary",
              },
            },
          },
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonResponse(profileSchema),
  },
});

const router
  = createOpenAPIRouter()
    .openapi(profileUpdateRoute, handler.profileUpdateHandler)
    .openapi(avatarUpdateRoute, handler.avatarUpdateHandler);

export type ProfileUpdateRoute = typeof profileUpdateRoute;
export type AvatarUpdateRoute = typeof avatarUpdateRoute;

export default router;
