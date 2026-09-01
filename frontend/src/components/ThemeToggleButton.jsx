// Clear, High-Contrast Theme Switch


import React from 'react';

function ThemeToggleButton({ isDark, toggle }) {
  return (
    <button
      id="theme-toggle-button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={[
        'flex items-center gap-2 px-3 py-2 rounded-xl border font-mono text-xs font-bold select-none',
        'transition-all duration-150 shadow-sm active:translate-y-0.5',
        // Light Mode
        'bg-[#FFFFFF] border-[#D9E5F2] text-[#102A43] hover:border-[#124A91] hover:bg-[#E0F2FE]',
        // Dark Mode
        'dark:bg-[#132742] dark:border-[#22446E] dark:text-[#FFFFFF] dark:hover:border-[#38BDF8] dark:hover:bg-[#1A3356]',
      ].join(' ')}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className="text-base select-none" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="hidden sm:inline uppercase tracking-wider text-[11px]">
        {isDark ? 'LIGHT MODE' : 'DARK MODE'}
      </span>
    </button>
  );
}

export default ThemeToggleButton;
