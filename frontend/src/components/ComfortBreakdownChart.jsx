// Score Breakdown Chart

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

function distanceFromRange(value, min, max) {
  if (value < min) return min - value;
  if (value > max) return value - max;
  return 0;
}

function componentScore(value, min, max, penalty) {
  return Math.max(0, 100 - penalty * distanceFromRange(value, min, max));
}

function visScore(metres) {
  return Math.max(0, Math.min(100, (metres / 8000) * 100));
}

function getBreakdownData({ tempC, humidity, windSpeed, clouds, visibility }) {
  const tScore  = componentScore(tempC,      18, 24,  2);
  const hScore  = componentScore(humidity,   40, 60,  1);
  const wScore  = componentScore(windSpeed,   0,  5,  4);
  const cScore  = componentScore(clouds,     20, 50, 0.5);
  const vScore  = visScore(visibility);

  return [
    {
      name:      'Temp (35%)',
      earned:    parseFloat((tScore * 0.35).toFixed(1)),
      maxPoints: 35,
      raw:       `${parseFloat(tempC).toFixed(1)}°C`,
      pct:       Math.round(tScore),
      colorLight: '#0B2A5B',
      colorDark:  '#38BDF8',
    },
    {
      name:      'Humidity (25%)',
      earned:    parseFloat((hScore * 0.25).toFixed(1)),
      maxPoints: 25,
      raw:       `${humidity}%`,
      pct:       Math.round(hScore),
      colorLight: '#0EA5E9',
      colorDark:  '#22D3EE',
    },
    {
      name:      'Wind (20%)',
      earned:    parseFloat((wScore * 0.20).toFixed(1)),
      maxPoints: 20,
      raw:       `${parseFloat(windSpeed).toFixed(1)} m/s`,
      pct:       Math.round(wScore),
      colorLight: '#124A91',
      colorDark:  '#818CF8',
    },
    {
      name:      'Clouds (10%)',
      earned:    parseFloat((cScore * 0.10).toFixed(1)),
      maxPoints: 10,
      raw:       `${clouds}%`,
      pct:       Math.round(cScore),
      colorLight: '#F59E0B',
      colorDark:  '#FBBF24',
    },
    {
      name:      'Visibility (10%)',
      earned:    parseFloat((vScore * 0.10).toFixed(1)),
      maxPoints: 10,
      raw:       `${(visibility / 1000).toFixed(1)} km`,
      pct:       Math.round(vScore),
      colorLight: '#16A34A',
      colorDark:  '#4ADE80',
    },
  ];
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const d = payload[0].payload;

  return (
    <div className="rounded-xl px-3 py-2 text-xs bg-[#FFFFFF] dark:bg-[#0B1728] border border-[#D9E5F2] dark:border-[#214371] shadow-lg">
      <p className="font-bold text-[#102A43] dark:text-[#FFFFFF] mb-1">{d.name}</p>
      <p className="text-[#64748B] dark:text-[#CBD5E1]">
        Measured: <span className="font-semibold text-[#102A43] dark:text-[#38BDF8]">{d.raw}</span>
      </p>
      <p className="text-[#64748B] dark:text-[#CBD5E1]">
        Component score: <span className="font-semibold text-[#102A43] dark:text-[#4ADE80]">{d.pct} / 100</span>
      </p>
      <p className="text-[#64748B] dark:text-[#CBD5E1]">
        Points earned: <span className="font-bold text-[#0EA5E9] dark:text-[#38BDF8]">{d.earned} / {d.maxPoints}</span>
      </p>
    </div>
  );
}

function ComfortBreakdownChart({ city }) {
  const data = useMemo(() => getBreakdownData(city), [city]);

  return (
    <div className="mt-4 pt-4 border-t border-[#D9E5F2] dark:border-[#1E3A5F]">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-[#0B2A5B] dark:text-[#38BDF8] flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0EA5E9] dark:bg-[#38BDF8]"></span>
          Score Breakdown
        </p>
        <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
          Max 100 points
        </span>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
          barCategoryGap="18%"
        >
          <CartesianGrid
            strokeDasharray="2 2"
            horizontal={false}
            stroke="currentColor"
            className="text-[#D9E5F2] dark:text-[#1E3A5F]"
          />

          <YAxis
            dataKey="name"
            type="category"
            width={100}
            tick={{ fontSize: 10, fill: 'currentColor', fontWeight: 600 }}
            className="text-[#64748B] dark:text-[#CBD5E1]"
            axisLine={false}
            tickLine={false}
          />

          <XAxis
            type="number"
            domain={[0, 35]}
            tick={{ fontSize: 9.5, fill: 'currentColor' }}
            className="text-[#64748B] dark:text-[#94A3B8]"
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }} />

          <Bar dataKey="earned" radius={[0, 4, 4, 0]} maxBarSize={12}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.colorDark} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {data.map(({ name, colorDark, earned, maxPoints }) => (
          <span key={name} className="flex items-center gap-1 text-[11px] font-medium text-[#64748B] dark:text-[#CBD5E1]">
            <span
              className="inline-block w-2 h-2 rounded-sm flex-shrink-0"
              style={{ background: colorDark }}
            />
            {earned}/{maxPoints}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ComfortBreakdownChart;
