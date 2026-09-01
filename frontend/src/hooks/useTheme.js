// Dark/light mode toggle hook


import { useState, useEffect } from 'react';

function useTheme() {
 
  const [isDark, setIsDark] = useState(() => {
   
    const stored = localStorage.getItem('theme');
    return stored !== 'light'; // true = dark, false = light
  });


  useEffect(() => {
    const html = document.documentElement; 

    if (isDark) {
    
      html.classList.add('dark');
    } else {
      
      html.classList.remove('dark');
    }
  }, [isDark]);


  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      // Persist the choice so the next page load starts in the right mode.
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return { isDark, toggle };
}

export default useTheme;
