// Multi-City Temperature & Comfort Analytics Graph


import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

function CustomChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl p-4 text-xs font-sans bg-[#FFFFFF] dark:bg-[#0D1C30] border border-[#D9E5F2] dark:border-[#1E3A5F] shadow-xl">
      <p className="font-bold text-sm text-[#102A43] dark:text-[#FFFFFF] mb-2">{label}</p>
      <div className="flex flex-col gap-1.5 font-medium">
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-bold text-[#102A43] dark:text-[#FFFFFF]">
              {item.value} {item.unit || ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeatherTrendsChart({ cities }) {
  const [metric, setMetric] = useState('temp'); // 'temp' | 'comfort' | 'combined'

  // Prepare clean chart data from the cities list
  const chartData = useMemo(() => {
    return (cities || []).map((city) => ({
      name: city.name,
      temperature: parseFloat(city.tempC),
      comfortScore: city.comfortScore,
      humidity: city.humidity,
      windSpeed: parseFloat(city.windSpeed),
    }));
  }, [cities]);

  if (!cities || cities.length === 0) return null;

  return (
    <div className="mb-8 p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#0D1C30] border border-[#D9E5F2] dark:border-[#1E3A5F] shadow-retro-md dark:shadow-xl transition-all duration-200">
      
      {/* ── Graph Header & Metric Selector ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#102A43] dark:text-[#FFFFFF] flex items-center gap-2">
            <span>📊</span>
            <span>Temperature & Weather Trends</span>
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Cross-city meteorological comparison across all monitored locations
          </p>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F5F9FD] dark:bg-[#071322] border border-[#D9E5F2] dark:border-[#1E3A5F] self-start sm:self-auto">
          <button
            onClick={() => setMetric('temp')}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150',
              metric === 'temp'
                ? 'bg-[#0B2A5B] text-white dark:bg-[#38BDF8] dark:text-[#071322] shadow-sm'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#102A43] dark:hover:text-white',
            ].join(' ')}
          >
            🌡️ Temperature
          </button>
          <button
            onClick={() => setMetric('comfort')}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150',
              metric === 'comfort'
                ? 'bg-[#0B2A5B] text-white dark:bg-[#38BDF8] dark:text-[#071322] shadow-sm'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#102A43] dark:hover:text-white',
            ].join(' ')}
          >
            🏆 Comfort Score
          </button>
          <button
            onClick={() => setMetric('combined')}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150',
              metric === 'combined'
                ? 'bg-[#0B2A5B] text-white dark:bg-[#38BDF8] dark:text-[#071322] shadow-sm'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#102A43] dark:hover:text-white',
            ].join(' ')}
          >
            📈 Combined View
          </button>
        </div>
      </div>

      {/* ── Recharts Graph Container ───────────────────────────────────── */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'combined' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[#D9E5F2] dark:text-[#1E3A5F]" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'currentColor', fontWeight: 600 }}
                className="text-[#64748B] dark:text-[#CBD5E1]"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-[#64748B] dark:text-[#94A3B8]"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                unit="°C"
                stroke="#0EA5E9"
                strokeWidth={3}
                dot={{ r: 4, fill: '#0EA5E9' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="comfortScore"
                name="Comfort Score (/100)"
                unit="/100"
                stroke="#FBBF24"
                strokeWidth={3}
                dot={{ r: 4, fill: '#FBBF24' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[#D9E5F2] dark:text-[#1E3A5F]" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'currentColor', fontWeight: 600 }}
                className="text-[#64748B] dark:text-[#CBD5E1]"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-[#64748B] dark:text-[#94A3B8]"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Bar
                dataKey={metric === 'temp' ? 'temperature' : 'comfortScore'}
                name={metric === 'temp' ? 'Temperature (°C)' : 'Comfort Score'}
                unit={metric === 'temp' ? '°C' : '/100'}
                radius={[6, 6, 0, 0]}
                maxBarSize={38}
              >
                {chartData.map((entry, index) => {
                  let fillColor = '#0EA5E9';
                  if (metric === 'temp') {
                    fillColor = entry.temperature > 25 ? '#F59E0B' : entry.temperature < 5 ? '#38BDF8' : '#16A34A';
                  } else {
                    fillColor = entry.comfortScore >= 80 ? '#16A34A' : entry.comfortScore >= 60 ? '#0EA5E9' : '#F59E0B';
                  }
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* ── Summary Stats Pill Strip ───────────────────────────────────── */}
      <div className="mt-4 pt-4 border-t border-[#D9E5F2] dark:border-[#1E3A5F] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-[#64748B] dark:text-[#94A3B8]">
          <span>
            Hottest: <strong className="text-[#102A43] dark:text-[#FFFFFF]">{[...chartData].sort((a, b) => b.temperature - a.temperature)[0]?.name || '-'} ({[...chartData].sort((a, b) => b.temperature - a.temperature)[0]?.temperature || 0}°C)</strong>
          </span>
          <span>
            Coldest: <strong className="text-[#102A43] dark:text-[#FFFFFF]">{[...chartData].sort((a, b) => a.temperature - b.temperature)[0]?.name || '-'} ({[...chartData].sort((a, b) => a.temperature - b.temperature)[0]?.temperature || 0}°C)</strong>
          </span>
        </div>
        <span className="text-[#64748B] dark:text-[#94A3B8]">
          Highest Score: <strong className="text-[#16A34A] dark:text-[#4ADE80]">{[...chartData].sort((a, b) => b.comfortScore - a.comfortScore)[0]?.name || '-'} ({[...chartData].sort((a, b) => b.comfortScore - a.comfortScore)[0]?.comfortScore || 0}/100)</strong>
        </span>
      </div>
    </div>
  );
}

export default WeatherTrendsChart;
