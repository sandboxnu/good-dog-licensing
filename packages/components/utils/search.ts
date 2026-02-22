export function search(s1: string, s2: string): boolean {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[\s_-]+/g, "");

  return normalize(s1).includes(normalize(s2));
}
