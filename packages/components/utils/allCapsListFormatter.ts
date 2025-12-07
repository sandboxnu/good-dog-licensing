export function formatAllCapsList(list: string[]): string {
  return list
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(", ");
}
