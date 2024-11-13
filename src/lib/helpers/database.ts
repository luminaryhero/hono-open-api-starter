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
