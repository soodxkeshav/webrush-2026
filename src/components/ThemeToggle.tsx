import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeSetting } from '../hooks/useTheme';

const LABEL: Record<ThemeSetting, string> = { system: 'System', light: 'Light', dark: 'Dark' };
const ICON: Record<ThemeSetting, typeof Sun> = { system: Monitor, light: Sun, dark: Moon };

/** Theme cycle button — always carries visible text (FAIE rule: no icon-only actions). */
export function ThemeToggle() {
  const { theme, cycle } = useTheme();
  const Icon = ICON[theme];

  return (
    <button
      type="button"
      onClick={cycle}
      data-testid="theme-toggle"
      className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-2 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      title={`Theme: ${LABEL[theme]} — click to change`}
    >
      <Icon size={14} aria-hidden="true" />
      <span aria-hidden="true">{LABEL[theme]}</span>
      <span className="sr-only">Theme: {LABEL[theme]}. Activate to change.</span>
    </button>
  );
}
