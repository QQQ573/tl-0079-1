import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { SKU, MetricKey } from '@/types';
import { METRIC_KEYS, METRIC_LABELS } from '@/types';
import { BRANDS } from '@/data/mockData';
import { valueToColor } from '@/utils/colorMapping';

interface RadarCompareProps {
  sku1: SKU;
  sku2: SKU;
}

export default function RadarCompare({ sku1, sku2 }: RadarCompareProps) {
  const data = METRIC_KEYS.map((key: MetricKey) => ({
    metric: METRIC_LABELS[key],
    [sku1.name]: sku1[key] as number,
    [sku2.name]: sku2[key] as number,
  }));

  const brand1 = BRANDS.find((b) => b.id === sku1.brandId);
  const brand2 = BRANDS.find((b) => b.id === sku2.brandId);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#E8DDD0" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fontSize: 11, fill: '#5C3D2E' }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: '#8B5E3C' }}
        />
        <Radar
          name={sku1.name}
          dataKey={sku1.name}
          stroke={brand1?.color || '#8B5E3C'}
          fill={brand1?.color || '#8B5E3C'}
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Radar
          name={sku2.name}
          dataKey={sku2.name}
          stroke={brand2?.color || '#52B788'}
          fill={brand2?.color || '#52B788'}
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Legend
          wrapperStyle={{ fontSize: 11 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
