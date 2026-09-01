
/** @type {import('tailwindcss').Config} */
export default {
  
  darkMode: 'class',

  content: [
    './index.html',            // the root HTML file
    './src/**/*.{js,jsx}',     // all JS and JSX files in src/
  ],

  // ── Theme extensions ──────────────────────────────────────────────────────
  theme: {
    extend: {
      colors: {
       
        retro: {
          // Light Mode
          'primary-light': '#0B2A5B',
          'primary-hover-light': '#124A91',
          'accent-light': '#0EA5E9',
          'accent-soft-light': '#E0F2FE',
          'sun-light': '#FBBF24',
          'bg-light': '#F5F9FD',
          'card-light': '#FFFFFF',
          'border-light': '#D9E5F2',
          'text-main-light': '#102A43',
          'text-sec-light': '#64748B',
          'success-light': '#16A34A',
          'warning-light': '#F59E0B',
          'danger-light': '#EF4444',

          // Dark Mode
          'primary-dark': '#38BDF8',
          'primary-hover-dark': '#0EA5E9',
          'accent-dark': '#22D3EE',
          'bg-dark': '#071525',
          'surface-dark': '#0D2138',
          'card-dark': '#102A43',
          'elevated-dark': '#153250',
          'border-dark': '#244563',
          'text-main-dark': '#F1F7FC',
          'text-sec-dark': '#94AFC5',
          'sun-dark': '#FBBF24',
          'success-dark': '#4ADE80',
          'warning-dark': '#FBBF24',
          'danger-dark': '#F87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Chakra Petch"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'retro-sm': '2px 2px 0px 0px rgba(11, 42, 91, 0.08)',
        'retro-md': '4px 4px 0px 0px rgba(11, 42, 91, 0.1)',
        'retro-dark-sm': '2px 2px 0px 0px rgba(0, 0, 0, 0.4)',
        'retro-dark-md': '4px 4px 0px 0px rgba(0, 0, 0, 0.5)',
      },
    },
  },


  plugins: [],
};
