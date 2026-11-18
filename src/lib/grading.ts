import type { NumericStep } from '../content/types';

/**
 * Parse what someone types on a phone keypad: "1,200", "$1.2", "40%", "−7.5".
 * Returns null when it isn't a number.
 */
export function parseNumber(input: string): number | null {
  const cleaned = input
    .trim()
    .replace(/[−–]/g, '-')
    .replace(/[$€£,%x\s]/gi, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return null;
  return Number(cleaned);
}

export function toleranceFor(step: Pick<NumericStep, 'answer' | 'tolerance'>): number {
  return step.tolerance ?? Math.max(0.01, Math.abs(step.answer) * 0.005);
}

export function checkNumeric(step: Pick<NumericStep, 'answer' | 'tolerance'>, input: string): boolean {
  const n = parseNumber(input);
  if (n === null) return false;
  return Math.abs(n - step.answer) <= toleranceFor(step) + 1e-9;
}

export function checkOrder(correct: string[], attempt: string[]): boolean {
  return correct.length === attempt.length && correct.every((item, i) => item === attempt[i]);
}
