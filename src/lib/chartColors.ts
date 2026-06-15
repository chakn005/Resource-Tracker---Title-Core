export const APP_COLORS = [
  '#4f8cff',
  '#34d399',
  '#f87171',
  '#fbbf24',
  '#a78bfa',
  '#22d3ee',
  '#fb923c',
  '#e879f9',
];

export function appColor(index: number): string {
  return APP_COLORS[index % APP_COLORS.length];
}
