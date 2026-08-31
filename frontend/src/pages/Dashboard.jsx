// WeatherSense Dashboard with Analytics & Grid


import React, { useMemo, useState } from 'react';
import useWeatherData from '../hooks/useWeatherData.js';
import useTheme from '../hooks/useTheme.js';
import CityList from '../components/CityList.jsx';
import LogoutButton from '../components/LogoutButton.jsx';
import SortFilterBar from '../components/SortFilterBar.jsx';
import ThemeToggleButton from '../components/ThemeToggleButton.jsx';
import LogoPlaceholder from '../components/LogoPlaceholder.jsx';
import WeatherTrendsChart from '../components/WeatherTrendsChart.jsx';

function Dashboard({ user }) {
  const { data, loading, error, lastUpdated, refetch } = useWeatherData();
  const { isDark, toggle: toggleTheme } = useTheme();

  const [sortBy,       setSortBy]       = useState('rank');
  const [filterTier,   setFilterTier]   = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const displayedCities = useMemo(() => {
    let result = [...data];

    if (filterTier !== 'all') {
      result = result.filter(city => {
        const score = city.comfortScore;
        if (filterTier === 'Excellent') return score >= 90;
        if (filterTier === 'Good')      return score >= 70 && score < 90;
        if (filterTier === 'Fair')      return score >= 50 && score < 70;
        if (filterTier === 'Poor')      return score < 50;
        return true;
      });
    }

    switch (sortBy) {
      case 'rank':     result.sort((a, b) => a.rank - b.rank);              break;
      case 'temp':     result.sort((a, b) => b.tempC - a.tempC);            break;
      case 'humidity': result.sort((a, b) => a.humidity - b.humidity);      break;
      case 'name':     result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return result;
  }, [data, sortBy, filterTier]);

  return (
    <div className="min-h-screen bg-[#F5F9FD] dark:bg-[#07111E] text-[#102A43] dark:text-[#FFFFFF] transition-colors duration-200 font-sans station-bg-light dark:station-bg-dark">
      
      {/* ── Main Container ─────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="mb-8 p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#0D1C30] border border-[#D9E5F2] dark:border-[#1E3A5F] shadow-retro-md dark:shadow-xl">
          <div className="flex items-start md:items-center justify-between flex-wrap gap-6">

            {/* Left: Logo & Brand */}
            <LogoPlaceholder size="md" />

            {/* Right: User Email + Theme Toggle + Trends Button + Refresh + Logout */}
            <div className="flex items-center gap-3 flex-wrap">
              {user?.email && (
                <span className="hidden sm:block text-xs font-semibold px-3 py-2 rounded-xl bg-[#E0F2FE] dark:bg-[#132742] border border-[#D9E5F2] dark:border-[#22446E] text-[#0B2A5B] dark:text-[#38BDF8] max-w-[200px] truncate">
                  {user.email}
                </span>
              )}

              {/* Toggle Trends Graph View Button */}
              <button
                onClick={() => setShowAnalytics((prev) => !prev)}
                className={[
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-150 shadow-sm active:translate-y-0.5',
                  showAnalytics
                    ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] dark:bg-[#38BDF8] dark:text-[#071322] dark:border-[#38BDF8]'
                    : 'bg-[#FFFFFF] border-[#D9E5F2] text-[#102A43] hover:border-[#124A91] dark:bg-[#132742] dark:border-[#22446E] dark:text-[#FFFFFF] dark:hover:border-[#38BDF8]',
                ].join(' ')}
                aria-label="Toggle weather trends chart"
              >
                <span>📊</span>
                <span className="hidden md:inline">{showAnalytics ? 'Hide Trends' : 'View Trends'}</span>
              </button>

              {/* Theme Toggle */}
              <ThemeToggleButton isDark={isDark} toggle={toggleTheme} />

              {/* Refresh Button */}
              <button
                onClick={refetch}
                disabled={loading}
                id="refresh-button"
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold',
                  'transition-all duration-150 select-none shadow-sm active:translate-y-0.5',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  // Light Mode
                  'bg-[#0B2A5B] text-white border-[#0B2A5B] hover:bg-[#124A91] hover:border-[#124A91]',
                  // Dark Mode
                  'dark:bg-[#38BDF8] dark:text-[#071322] dark:border-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:hover:border-[#0EA5E9]',
                ].join(' ')}
                aria-label="Refresh weather data"
              >
                <span className={`text-sm inline-block ${loading ? 'animate-spin' : ''}`} aria-hidden="true">
                  ↻
                </span>
                <span>{loading ? 'Refreshing…' : 'Refresh'}</span>
              </button>

              {/* Logout Button */}
              <LogoutButton />
            </div>
          </div>

          {/* Last Updated Timestamp */}
          {lastUpdated && (
            <div className="mt-4 pt-3 border-t border-[#D9E5F2] dark:border-[#1E3A5F] text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center justify-between flex-wrap gap-2">
              <p aria-live="polite">
                Last updated:{' '}
                <time dateTime={lastUpdated.toISOString()} className="font-bold text-[#102A43] dark:text-[#FFFFFF]">
                  {lastUpdated.toLocaleTimeString()}
                </time>
                {' '}· Auto-refreshes every 5 minutes
              </p>
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                {data.length} Cities Loaded
              </span>
            </div>
          )}
        </header>

        {/* ── Error Banner ───────────────────────────────────────────────── */}
        {error && (
          <div
            className="mb-8 p-5 rounded-2xl bg-[#EF4444]/10 dark:bg-[#EF4444]/20 border border-[#EF4444]/40 dark:border-[#F87171]/50 text-[#EF4444] dark:text-[#F87171] shadow-md"
            role="alert"
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <span>⚠️ Failed to load weather data:</span>
              <span>{error}</span>
            </div>
            <button
              onClick={refetch}
              className="mt-3 text-xs font-bold underline underline-offset-4 hover:opacity-80"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Optional Weather Trends Chart Section ──────────────────────── */}
        {showAnalytics && !loading && data.length > 0 && (
          <WeatherTrendsChart cities={data} />
        )}

        {/* ── Sort & Filter Controls ─────────────────────────────────────── */}
        {!loading && data.length > 0 && (
          <SortFilterBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterTier={filterTier}
            onFilterChange={setFilterTier}
            totalCities={data.length}
            shownCities={displayedCities.length}
          />
        )}

        {/* ── City Cards Grid ────────────────────────────────────────────── */}
        <main>
          <CityList cities={displayedCities} loading={loading} />
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer className="mt-14 pt-6 border-t border-[#D9E5F2] dark:border-[#1E3A5F] text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
          <p>
            WeatherSense — Weather Comfort Index
            {' '}·{' '}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0EA5E9] dark:text-[#38BDF8] hover:underline font-semibold"
            >
              OpenWeatherMap
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
