export function formatAllCapsList(list: string[]): string {
  return list
    .map((word) =>
      word
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" "),
    )
    .join(", ");
}
