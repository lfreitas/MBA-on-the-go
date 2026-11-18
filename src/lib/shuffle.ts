/** Fisher–Yates shuffle that never returns the input order (when it can avoid it). */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let attempt = 0; attempt < 5; attempt++) {
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (out.length < 2 || out.some((item, i) => item !== items[i])) break;
  }
  return out;
}
