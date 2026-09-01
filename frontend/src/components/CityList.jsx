// Responsive Grid of Station Cards with Independent Card Height


import React from 'react';
import CityCard from './CityCard.jsx';

function SkeletonCard() {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-5 border bg-[#FFFFFF] dark:bg-[#0D1C30] border-[#D9E5F2] dark:border-[#1E3A5F] animate-pulse shadow-sm"
      aria-busy="true"
      aria-label="Loading city weather card"
    >
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 bg-[#D9E5F2] dark:bg-[#152B46] rounded" />
        <div className="w-8 h-8 rounded bg-[#D9E5F2] dark:bg-[#152B46]" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-6 bg-[#D9E5F2] dark:bg-[#152B46] rounded w-3/4" />
        <div className="h-3 bg-[#D9E5F2] dark:bg-[#152B46] rounded w-1/3" />
      </div>

      <div className="h-16 bg-[#F5F9FD] dark:bg-[#071322] border border-[#D9E5F2] dark:border-[#1E3A5F] rounded-xl p-3 flex flex-col gap-2">
        <div className="h-6 bg-[#D9E5F2] dark:bg-[#152B46] rounded w-1/2" />
        <div className="h-1.5 bg-[#D9E5F2] dark:bg-[#152B46] rounded-full w-full" />
      </div>

      <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-[#D9E5F2] dark:border-[#1E3A5F]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-[#D9E5F2]/60 dark:bg-[#152B46] rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function CityList({ cities, loading }) {
  // `items-start` prevents cards in the same grid row from stretching when one expands!
  const gridClass = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start';

  if (loading) {
    return (
      <section aria-label="Loading cities" className={gridClass}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </section>
    );
  }

  if (!cities || cities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#64748B] dark:text-[#94A3B8] bg-[#FFFFFF] dark:bg-[#0D1C30] rounded-2xl border border-[#D9E5F2] dark:border-[#1E3A5F] p-8 shadow-md">
        <span className="text-5xl mb-3" aria-hidden="true">📡</span>
        <p className="text-lg font-bold uppercase tracking-wider text-[#102A43] dark:text-[#FFFFFF]">
          No City Weather Data Available
        </p>
        <p className="text-xs mt-1 text-[#64748B] dark:text-[#CBD5E1]">
          Please check your connection or refresh the page.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label={`${cities.length} cities ranked by comfort score`}
      className={gridClass}
    >
      {cities.map((city) => (
        <CityCard key={city.cityId} city={city} />
      ))}
    </section>
  );
}

export default CityList;
