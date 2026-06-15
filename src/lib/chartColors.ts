export const APP_COLORS = [
  '#0063e5',
  '#00b8ff',
  '#ffb63f',
  '#7b61ff',
  '#00d68f',
  '#ff6b9d',
  '#ff5757',
  '#47d5ff',
];

export function appColor(index: number): string {
  return APP_COLORS[index % APP_COLORS.length];
}
