import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEY } from '../constants';

export type ThemeSetting = 'system' | 'light' | 'dark';
const CYCLE: ThemeSetting[] = ['system', 'light', 'dark'];

function readStored(): ThemeSetting {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'system';
  } catch {
    return 'system'; // localStorage unavailable → fall back to system, no crash
  }
}

/**
 * Three-state theme cycle (PRD §5.6): system → light → dark, persisted under
 * lifeReceipts.theme.v1, applied via a `.dark` class on <html>.
 */
export function useTheme(): { theme: ThemeSetting; effective: 'light' | 'dark'; cycle: () => void } {
  const [theme, setTheme] = useState<ThemeSetting>(readStored);
  const [systemDark, setSystemDark] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent): void => setSystemDark(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const effective: 'light' | 'dark' = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', effective === 'dark');
    document.documentElement.style.colorScheme = effective;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* persistence is best-effort */
    }
  }, [theme, effective]);

  const cycle = useCallback(() => {
    setTheme((current) => CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length]);
  }, []);

  return { theme, effective, cycle };
}
