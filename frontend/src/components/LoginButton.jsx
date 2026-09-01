// WeatherSense Sign In Button


import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      id="login-button"
      onClick={() => loginWithRedirect()}
      className={[
        'w-full py-3.5 px-6 rounded-xl font-bold text-base select-none',
        'border transition-all duration-150 shadow-md active:translate-y-0.5',
        // Light Mode: Deep Blue
        'bg-[#0B2A5B] text-white border-[#0B2A5B] hover:bg-[#124A91] hover:border-[#124A91]',
        // Dark Mode: Bright Blue
        'dark:bg-[#38BDF8] dark:text-[#071322] dark:border-[#38BDF8] dark:hover:bg-[#0EA5E9] dark:hover:border-[#0EA5E9]',
      ].join(' ')}
      aria-label="Sign in to WeatherSense"
    >
      Sign In
    </button>
  );
}

export default LoginButton;
