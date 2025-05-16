export function applyFilters(query: any, filters: Record<string, any>): any {
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) {
      if (typeof value === 'string') {
        query = query.ilike(key, `%${value}%`);
      } else {
        query = query.eq(key, value);
      }
    }
  }
  return query;
}
