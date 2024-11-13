import type { Context } from "hono";
import type { HandlerResponse } from "hono/types";

/**
 * 分页
 */
export function paginate(items: any[], page: number, pageSize: number) {
  return {
    meta: {
      total: items.length,
      page,
      pageSize,
    },
    items: items.slice((page - 1) * pageSize, page * pageSize),
  };
}

/**
 * 统一返回响应数据格式
 */
export function successResponse(c: Context, data: any): any {
  if (data == null || undefined) {
    return c.json({
      code: -1,
      data: null,
      message: "error",
    });
  }

  return c.json({
    code: 0,
    data,
    message: "ok",
  });
}
