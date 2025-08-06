export function generateId(prefix?: string): string {
  const id = crypto.randomUUID().replaceAll("-", "_");
  return prefix ? `${prefix}_${id}` : id;
}
