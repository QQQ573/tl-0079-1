export interface Brand {
  id: string;
  name: string;
  color: string;
}

export interface SKU {
  id: string;
  name: string;
  brandId: string;
  category: string;
  salesPercentile: number;
  repurchaseRate: number;
  socialMention: number;
  marginTier: number;
}

export type MetricKey = 'salesPercentile' | 'repurchaseRate' | 'socialMention' | 'marginTier';

export const METRIC_KEYS: MetricKey[] = ['salesPercentile', 'repurchaseRate', 'socialMention', 'marginTier'];

export const METRIC_LABELS: Record<MetricKey, string> = {
  salesPercentile: '销量排名分位',
  repurchaseRate: '复购率',
  socialMention: '社媒提及',
  marginTier: '毛利档',
};

export const MARGIN_TIER_LABELS: Record<number, string> = {
  1: '第1档(0-20)',
  2: '第2档(20-40)',
  3: '第3档(40-60)',
  4: '第4档(60-80)',
  5: '第5档(80-100)',
};

export function getMarginTierLevel(value: number): number {
  return Math.floor(value / 20) + 1;
}
