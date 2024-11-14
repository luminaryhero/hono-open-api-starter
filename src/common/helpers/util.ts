import type { Context } from "hono";

import _ from "lodash";

import { format } from "@/common/helpers/date";

import type { PR, R } from "../types";

/**
 * Paginate a list of items, given a page and page size.
 *
 * @param {any[]} items The list of items to paginate.
 * @param {number} page The page number to return.
 * @param {number} pageSize The number of items per page.
 * @returns {object} An object with two properties: "meta" and "items". "meta" contains
 *   the total number of items, the current page, and the page size. "items" is an array
 *   of the items for the given page.
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
    throw new Error("error");
  }

  const responseData = {
    code: 0,
    data,
    message: "ok",
  };

  const result = serialize(responseData as R | PR);

  return c.json(result);
}

/**
 * If data is null or undefined, throw an error with given message.
 * @param {any} data
 * @param {string} message
 */
export function nilThrowError(data: any, message: string) {
  if (_.isNil(data))
    throw new Error(message || "error");
}

/**
 * 序列化响应数据
 * @param data
 * @returns
 */
function serialize<T extends R | PR>(data: T): T {
  const safeFields = ["password"];

  if ("meta" in data.data) {
    let items = data.data.items;

    items = items.map((item: any) => {
      if (item.createdAt) {
        item.createdAt = format(item.createdAt);
      }
      if (item.updatedAt) {
        item.updatedAt = format(item.updatedAt);
      }

      item = _.omit(item, safeFields);

      return item;
    });

    return {
      ...data,
      data: {
        ...data.data,
        items,
      },
    };
  }
  else {
    let item = data.data;

    if (item.createdAt) {
      item.createdAt = format(item.createdAt);
    }
    if (item.updatedAt) {
      item.updatedAt = format(item.updatedAt);
    }

    item = _.omit(item, safeFields);

    return {
      ...data,
      data: item,
    };
  }
}
