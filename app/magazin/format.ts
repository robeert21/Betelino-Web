export function formatPrice(bani: number): string {
  const lei = bani / 100;
  const formatted = Number.isInteger(lei) ? lei.toString() : lei.toFixed(2).replace(/0$/, "");
  return `${formatted.replace(".", ",")} lei`;
}
