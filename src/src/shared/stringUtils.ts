export function removeBracketsContent(str: string) {
  return str.replace(/ *\([^)]*\) */g, "");
}
