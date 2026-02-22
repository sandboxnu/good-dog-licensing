export function formatAllCapsList(list: string[]): string {
  return list.map((word) => formatAllCapsWord(word)).join(", ");
}

export function formatAllCapsWord(word: string): string {
  return word
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
