// Sort & Filter Control Bar


import React from 'react';

const SORT_OPTIONS = [
  { value: 'rank',     label: '🏆 Comfort Score (Highest)' },
  { value: 'temp',     label: '🌡️ Temperature (Highest)' },
  { value: 'humidity', label: '💧 Humidity (Lowest)' },
  { value: 'name',     label: '🔤 City Name (A–Z)' },
];

const FILTER_TIERS = ['All', 'Excellent', 'Good', 'Fair', 'Poor'];

function SortFilterBar({ sortBy, onSortChange, filterTier, onFilterChange, totalCities, shownCities }) {
  return (
    <div
      className={[
        'flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 p-4 rounded-2xl border',
        // Light Mode
        'bg-[#FFFFFF] border-[#D9E5F2] text-[#102A43] shadow-retro-md',
        // Dark Mode
        'dark:bg-[#0D1C30] dark:border-[#1E3A5F] dark:text-[#FFFFFF] dark:shadow-md',
        'transition-all duration-200',
      ].join(' ')}
      aria-label="Sort and filter controls"
    >
      {/* ── Left: Sort Dropdown ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        <label htmlFor="sort-select" className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={[
            'rounded-xl px-3 py-1.5 text-xs font-semibold',
            'border outline-none cursor-pointer transition-colors duration-150',
            // Light Mode
            'bg-[#F5F9FD] border-[#D9E5F2] text-[#102A43] hover:border-[#124A91] focus:border-[#0EA5E9]',
            // Dark Mode
            'dark:bg-[#132742] dark:border-[#22446E] dark:text-[#FFFFFF] dark:hover:border-[#38BDF8] dark:focus:border-[#38BDF8]',
          ].join(' ')}
          aria-label="Sort cities by"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value} className="bg-white text-[#102A43] dark:bg-[#0D1C30] dark:text-white">
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Middle: Filter Tier Badges ───────────────────────────────────── */}
      <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filter by tier">
        <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] mr-1">
          Filter:
        </span>
        {FILTER_TIERS.map((tier) => {
          const isActive = tier === 'All' ? filterTier === 'all' : filterTier === tier;

          return (
            <button
              key={tier}
              onClick={() => onFilterChange(tier === 'All' ? 'all' : tier)}
              aria-pressed={isActive}
              className={[
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150',
                isActive
                  ? // Active
                    'bg-[#0B2A5B] text-white border border-[#0B2A5B] dark:bg-[#38BDF8] dark:text-[#071322] dark:border-[#38BDF8] shadow-sm'
                  : // Inactive
                    'bg-[#F5F9FD] text-[#64748B] border border-[#D9E5F2] hover:border-[#124A91] hover:text-[#102A43] dark:bg-[#132742] dark:text-[#CBD5E1] dark:border-[#22446E] dark:hover:border-[#38BDF8] dark:hover:text-white',
              ].join(' ')}
            >
              {tier}
            </button>
          );
        })}
      </div>

      {/* ── Right: Cities Counter ───────────────────────────────────────── */}
      <div className="text-xs font-semibold text-[#0B2A5B] dark:text-[#38BDF8] bg-[#E0F2FE] dark:bg-[#132742] px-3 py-1.5 rounded-xl border border-[#D9E5F2] dark:border-[#22446E]">
        {shownCities === totalCities ? `${totalCities} cities` : `Showing ${shownCities} of ${totalCities}`}
      </div>
    </div>
  );
}

export default SortFilterBar;
