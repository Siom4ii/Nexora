import { useEffect, useState } from 'react';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * It uses window.matchMedia directly for better reliability on web browsers.
 */
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial sync after hydration
    setColorScheme(matchMedia.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };

    matchMedia.addEventListener('change', handler);
    return () => matchMedia.removeEventListener('change', handler);
  }, []);

  return colorScheme;
}
