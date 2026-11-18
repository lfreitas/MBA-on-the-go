// Inline SVG icons so the app has no network or font dependency.

type IconName = 'flame' | 'check' | 'lock' | 'close' | 'back' | 'gear' | 'play' | 'repeat' | 'book' | 'x';

const paths: Record<IconName, string> = {
  flame: 'M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4.2 2.5-5.5.2 1.8 1 3 2.2 3.5C11 8 11 5 12 2z',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z',
  close: 'M6 6l12 12M18 6L6 18',
  x: 'M6 6l12 12M18 6L6 18',
  back: 'M15 5l-7 7 7 7',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7 7 0 0 1-2.1 1.2L14.7 21h-4l-.3-2.4a7 7 0 0 1-2.1-1.2l-1.9.7-2-3.4 1.6-1.2a7 7 0 0 1 0-2.4L4.4 9.9l2-3.4 1.9.7a7 7 0 0 1 2.1-1.2L10.7 3h4l.3 2.4a7 7 0 0 1 2.1 1.2l1.9-.7 2 3.4-1.6 1.2a7 7 0 0 1 0 2.4z',
  play: 'M8 5.5v13l10.5-6.5z',
  repeat: 'M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7',
};

const filled = new Set<IconName>(['flame', 'play']);

export function Icon({ name, size = 22, label }: { name: IconName; size?: number; label?: string }) {
  const isFilled = filled.has(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={paths[name]} />
    </svg>
  );
}
