import { describe, it, expect } from 'vitest';
import { getMarginTierLevel, MARGIN_TIER_LABELS } from '../index';

describe('getMarginTierLevel', () => {
  it('returns correct tier for boundary values', () => {
    expect(getMarginTierLevel(0)).toBe(1);
    expect(getMarginTierLevel(20)).toBe(2);
    expect(getMarginTierLevel(40)).toBe(3);
    expect(getMarginTierLevel(60)).toBe(4);
    expect(getMarginTierLevel(80)).toBe(5);
    expect(getMarginTierLevel(100)).toBe(6);
  });

  it('returns correct tier for mid-range values', () => {
    expect(getMarginTierLevel(10)).toBe(1);
    expect(getMarginTierLevel(25)).toBe(2);
    expect(getMarginTierLevel(39)).toBe(2);
    expect(getMarginTierLevel(55)).toBe(3);
    expect(getMarginTierLevel(79)).toBe(4);
    expect(getMarginTierLevel(99)).toBe(5);
  });

  it('handles 79 vs 81 correctly - should be different tiers (档4 vs 档5)', () => {
    expect(getMarginTierLevel(79)).toBe(4);
    expect(getMarginTierLevel(81)).toBe(5);
    expect(getMarginTierLevel(79)).not.toBe(getMarginTierLevel(81));
  });

  it('validates MARGIN_TIER_LABELS coverage for tiers 1-5', () => {
    expect(MARGIN_TIER_LABELS[1]).toBe('第1档(0-20)');
    expect(MARGIN_TIER_LABELS[2]).toBe('第2档(20-40)');
    expect(MARGIN_TIER_LABELS[3]).toBe('第3档(40-60)');
    expect(MARGIN_TIER_LABELS[4]).toBe('第4档(60-80)');
    expect(MARGIN_TIER_LABELS[5]).toBe('第5档(80-100)');
  });

  it('shows tier 6 is undefined in MARGIN_TIER_LABELS (known boundary gap)', () => {
    expect(MARGIN_TIER_LABELS[6]).toBeUndefined();
  });
});
