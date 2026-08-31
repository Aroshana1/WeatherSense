// WeatherSense Logo & Brand


import React from 'react';

function LogoPlaceholder({ className = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  }[size] || 'w-10 h-10 text-sm';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {<img src="/logo.png" alt="WeatherSense Logo" className="w-12 h-12 object-contain" />
      }


      {/* Brand Text */}
      <div className="flex flex-col">
        <h1 className="font-display font-black text-2xl tracking-tight text-[#0B2A5B] dark:text-[#FFFFFF] leading-none">
          Weather<span className="text-[#0EA5E9] dark:text-[#38BDF8]">Sense</span>
        </h1>
        <span className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1 font-medium">
          Weather Comfort Index
        </span>
      </div>
    </div>
  );
}

export default LogoPlaceholder;
