import { describe, it, expect } from 'vitest';
import { valueToColor, valueToTextColor, valueToBgClass } from '../colorMapping';

describe('valueToColor', () => {
  it('clamps values below 0 to boundary color #6C757D', () => {
    expect(valueToColor(-10)).toBe('#6c757d');
    expect(valueToColor(0)).toBe('#6c757d');
  });

  it('clamps values above 100 to boundary color #2D6A4F', () => {
    expect(valueToColor(150)).toBe('#2d6a4f');
    expect(valueToColor(100)).toBe('#2d6a4f');
  });

  it('returns exact stop colors at gradient positions', () => {
    expect(valueToColor(0)).toBe('#6c757d');
    expect(valueToColor(25)).toBe('#adb5bd');
    expect(valueToColor(49)).toBe('#adb5bd');
    expect(valueToColor(50)).toBe('#ffd166');
    expect(valueToColor(65)).toBe('#f4a261');
    expect(valueToColor(79)).toBe('#f4a261');
    expect(valueToColor(80)).toBe('#52b788');
    expect(valueToColor(100)).toBe('#2d6a4f');
  });

  it('interpolates between gradient stops', () => {
    const midGray = valueToColor(12);
    expect(midGray).toMatch(/^#[0-9a-f]{6}$/);
    expect(midGray).not.toBe('#6c757d');
    expect(midGray).not.toBe('#adb5bd');

    const midYellow = valueToColor(57);
    expect(midYellow).toMatch(/^#[0-9a-f]{6}$/);

    const midGreen = valueToColor(90);
    expect(midGreen).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('handles flat gradient segments (same color at both ends)', () => {
    expect(valueToColor(37)).toBe('#adb5bd');
    expect(valueToColor(72)).toBe('#f4a261');
  });

  it('always returns valid 7-character hex color strings', () => {
    for (let v = 0; v <= 100; v += 5) {
      expect(valueToColor(v)).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe('valueToTextColor', () => {
  it('returns #FFFFFF for values >= 75', () => {
    expect(valueToTextColor(75)).toBe('#FFFFFF');
    expect(valueToTextColor(80)).toBe('#FFFFFF');
    expect(valueToTextColor(100)).toBe('#FFFFFF');
  });

  it('returns #3D2E00 for values >= 50 and < 75', () => {
    expect(valueToTextColor(50)).toBe('#3D2E00');
    expect(valueToTextColor(60)).toBe('#3D2E00');
    expect(valueToTextColor(74)).toBe('#3D2E00');
  });

  it('returns #1A1A1A for values < 50', () => {
    expect(valueToTextColor(49)).toBe('#1A1A1A');
    expect(valueToTextColor(25)).toBe('#1A1A1A');
    expect(valueToTextColor(0)).toBe('#1A1A1A');
  });
});

describe('valueToBgClass', () => {
  it('returns emerald class for values >= 80', () => {
    expect(valueToBgClass(80)).toBe('bg-emerald-700 text-white');
    expect(valueToBgClass(100)).toBe('bg-emerald-700 text-white');
  });

  it('returns amber-500 class for values >= 60 and < 80', () => {
    expect(valueToBgClass(60)).toBe('bg-amber-500 text-amber-950');
    expect(valueToBgClass(79)).toBe('bg-amber-500 text-amber-950');
  });

  it('returns amber-400 class for values >= 50 and < 60', () => {
    expect(valueToBgClass(50)).toBe('bg-amber-400 text-amber-950');
    expect(valueToBgClass(59)).toBe('bg-amber-400 text-amber-950');
  });

  it('returns gray-400 class for values >= 40 and < 50', () => {
    expect(valueToBgClass(40)).toBe('bg-gray-400 text-gray-900');
    expect(valueToBgClass(49)).toBe('bg-gray-400 text-gray-900');
  });

  it('returns gray-300 class for values < 40', () => {
    expect(valueToBgClass(39)).toBe('bg-gray-300 text-gray-800');
    expect(valueToBgClass(0)).toBe('bg-gray-300 text-gray-800');
  });
});
