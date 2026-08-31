//  WeatherSense Log Out Button


import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <button
      id="logout-button"
      onClick={() =>
        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        })
      }
      className={[
        'flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold select-none',
        'transition-all duration-150 shadow-sm active:translate-y-0.5',
        // Light Mode
        'bg-[#FFFFFF] border-[#D9E5F2] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/5 shadow-retro-sm',
        // Dark Mode
        'dark:bg-[#132742] dark:border-[#22446E] dark:text-[#CBD5E1] dark:hover:border-[#F87171] dark:hover:text-[#F87171] dark:hover:bg-[#EF4444]/15',
      ].join(' ')}
      aria-label="Log out of WeatherSense"
    >
      <span aria-hidden="true">⏻</span>
      <span>Log Out</span>
    </button>
  );
}

export default LogoutButton;
