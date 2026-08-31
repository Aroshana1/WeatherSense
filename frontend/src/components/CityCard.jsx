//Clean Weather Comfort Card


import React, { useState } from 'react';
import ComfortBreakdownChart from './ComfortBreakdownChart.jsx';

function getFlagEmoji(countryCode) {
  if (!countryCode) return '🌐';
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

function getScoreStyle(score) {
  if (score >= 90)
    return {
      label: 'Excellent',
      badgeLight: 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/40',
      badgeDark: 'dark:bg-[#16A34A]/25 dark:text-[#4ADE80] dark:border-[#4ADE80]/50',
      barLight: 'bg-[#16A34A]',
      barDark: 'dark:bg-[#4ADE80]',
      colorLight: 'text-[#16A34A]',
      colorDark: 'dark:text-[#4ADE80]',
    };
  if (score >= 70)
    return {
      label: 'Good',
      badgeLight: 'bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/40',
      badgeDark: 'dark:bg-[#0284C7]/25 dark:text-[#38BDF8] dark:border-[#38BDF8]/50',
      barLight: 'bg-[#0EA5E9]',
      barDark: 'dark:bg-[#38BDF8]',
      colorLight: 'text-[#0EA5E9]',
      colorDark: 'dark:text-[#38BDF8]',
    };
  if (score >= 50)
    return {
      label: 'Fair',
      badgeLight: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/40',
      badgeDark: 'dark:bg-[#D97706]/25 dark:text-[#FBBF24] dark:border-[#FBBF24]/50',
      barLight: 'bg-[#F59E0B]',
      barDark: 'dark:bg-[#FBBF24]',
      colorLight: 'text-[#F59E0B]',
      colorDark: 'dark:text-[#FBBF24]',
    };
  if (score >= 30)
    return {
      label: 'Poor',
      badgeLight: 'bg-[#F59E0B]/15 text-[#D97706] border-[#F59E0B]/50',
      badgeDark: 'dark:bg-[#F59E0B]/25 dark:text-[#FBBF24] dark:border-[#FBBF24]/60',
      barLight: 'bg-[#F59E0B]',
      barDark: 'dark:bg-[#FBBF24]',
      colorLight: 'text-[#D97706]',
      colorDark: 'dark:text-[#FBBF24]',
    };
  return {
    label: 'Bad',
    badgeLight: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/40',
    badgeDark: 'dark:bg-[#DC2626]/25 dark:text-[#F87171] dark:border-[#F87171]/50',
    barLight: 'bg-[#EF4444]',
    barDark: 'dark:bg-[#F87171]',
    colorLight: 'text-[#EF4444]',
    colorDark: 'dark:text-[#F87171]',
  };
}

function getWeatherIcon(clouds, visibility) {
  if (visibility < 2000) return '🌫️';
  if (clouds > 80)        return '☁️';
  if (clouds > 50)        return '⛅';
  if (clouds > 20)        return '🌤️';
  return '☀️';
}

function CityCard({ city }) {
  const {
    rank, name, country, comfortScore,
    tempC, humidity, windSpeed, clouds, visibility,
  } = city;

  const [isExpanded, setIsExpanded] = useState(false);

  const style        = getScoreStyle(comfortScore);
  const flagEmoji    = getFlagEmoji(country);
  const weatherIcon  = getWeatherIcon(clouds, visibility);
  const visibilityKm = (visibility / 1000).toFixed(1);
  const displayTemp  = parseFloat(tempC).toFixed(1);
  const displayWind  = parseFloat(windSpeed).toFixed(1);

  const stats = [
    { icon: '🌡️', value: `${displayTemp}°C`, label: 'Temp' },
    { icon: '💧',  value: `${humidity}%`,     label: 'Humidity' },
    { icon: '💨',  value: `${displayWind}m/s`, label: 'Wind' },
    { icon: '☁️',  value: `${clouds}%`,       label: 'Clouds' },
    { icon: '👁️',  value: `${visibilityKm}km`, label: 'Visibility' },
  ];

  return (
    <article
      onClick={() => setIsExpanded(prev => !prev)}
      className={[
        'flex flex-col gap-4 rounded-2xl p-5 cursor-pointer border select-none',
        'transition-all duration-200 hover:-translate-y-1',
        // Light Mode
        'bg-[#FFFFFF] border-[#D9E5F2] text-[#102A43] shadow-retro-md hover:border-[#124A91]',
        // Dark Mode
        'dark:bg-[#0D1C30] dark:border-[#1E3A5F] dark:text-[#FFFFFF] dark:shadow-lg dark:hover:border-[#38BDF8] dark:hover:bg-[#10233D]',
      ].join(' ')}
      aria-label={`${name} — Comfort Score ${comfortScore} out of 100. Click to ${isExpanded ? 'hide' : 'show'} score breakdown.`}
      aria-expanded={isExpanded}
    >
      {/* ── Row 1: Rank & Score Label ───────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Clean Rank Badge */}
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0B2A5B] dark:bg-[#142948] dark:text-[#38BDF8] border border-[#D9E5F2] dark:border-[#214371]">
            #{rank}
          </span>
          {/* Score Status Badge */}
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${style.badgeLight} ${style.badgeDark}`}>
            {style.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            {weatherIcon}
          </span>
          <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]" aria-hidden="true">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* ── Row 2: City Name & Country ──────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#102A43] dark:text-[#FFFFFF] leading-tight">
          {name}
        </h2>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 flex items-center gap-1.5 font-medium">
          <span aria-label={`${country} flag`}>{flagEmoji}</span>
          <span className="dark:text-[#CBD5E1]">{country || 'Global'}</span>
        </p>
      </div>

      {/* ── Row 3: Comfort Score Box ─────────────────────────────────────── */}
      <div className="p-3.5 rounded-xl bg-[#F5F9FD] dark:bg-[#071322] border border-[#D9E5F2] dark:border-[#1B3556] flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
            Comfort Score
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-black tracking-tight leading-none ${style.colorLight} ${style.colorDark}`}>
              {comfortScore}
            </span>
            <span className="text-xs font-bold text-[#64748B] dark:text-[#64748B]">/100</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="h-2 rounded-full bg-[#D9E5F2] dark:bg-[#11233A] overflow-hidden p-0.5 border border-[#D9E5F2] dark:border-[#1E3C63]"
          role="progressbar"
          aria-valuenow={comfortScore}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full ${style.barLight} ${style.barDark} transition-all duration-700 ease-out`}
            style={{ width: `${comfortScore}%` }}
          />
        </div>
      </div>

      {/* ── Row 4: Weather Parameters Grid ───────────────────────────────── */}
      <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-[#D9E5F2] dark:border-[#1E3A5F]">
        {stats.map(({ icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-0.5 text-center p-2 rounded-xl bg-[#F5F9FD] dark:bg-[#132742] border border-[#D9E5F2] dark:border-[#22446E]"
            aria-label={`${label}: ${value}`}
          >
            <span className="text-sm select-none" aria-hidden="true">{icon}</span>
            <span className="text-[11px] font-bold text-[#102A43] dark:text-[#FFFFFF]">{value}</span>
            <span className="text-[9px] font-medium text-[#64748B] dark:text-[#94A3B8]">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Expandable Score Breakdown Chart ─────────────────────────────── */}
      {isExpanded && <ComfortBreakdownChart city={city} />}
    </article>
  );
}

export default CityCard;
