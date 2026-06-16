function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => Math.round(c).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

interface ColorStop {
  pos: number;
  color: string;
}

const GRADIENT_STOPS: ColorStop[] = [
  { pos: 0, color: '#6C757D' },
  { pos: 25, color: '#ADB5BD' },
  { pos: 49, color: '#ADB5BD' },
  { pos: 50, color: '#FFD166' },
  { pos: 65, color: '#F4A261' },
  { pos: 79, color: '#F4A261' },
  { pos: 80, color: '#52B788' },
  { pos: 100, color: '#2D6A4F' },
];

export function valueToColor(value: number): string {
  const clamped = Math.max(0, Math.min(100, value));

  let lower = GRADIENT_STOPS[0];
  let upper = GRADIENT_STOPS[GRADIENT_STOPS.length - 1];

  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    if (clamped >= GRADIENT_STOPS[i].pos && clamped <= GRADIENT_STOPS[i + 1].pos) {
      lower = GRADIENT_STOPS[i];
      upper = GRADIENT_STOPS[i + 1];
      break;
    }
  }

  const range = upper.pos - lower.pos;
  const t = range === 0 ? 0 : (clamped - lower.pos) / range;

  const [r1, g1, b1] = hexToRgb(lower.color);
  const [r2, g2, b2] = hexToRgb(upper.color);

  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
}

export function valueToTextColor(value: number): string {
  if (value >= 75) return '#FFFFFF';
  if (value >= 50) return '#3D2E00';
  return '#1A1A1A';
}

export function valueToBgClass(value: number): string {
  if (value >= 80) return 'bg-emerald-700 text-white';
  if (value >= 60) return 'bg-amber-500 text-amber-950';
  if (value >= 50) return 'bg-amber-400 text-amber-950';
  if (value >= 40) return 'bg-gray-400 text-gray-900';
  return 'bg-gray-300 text-gray-800';
}
