import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeSetting } from '../hooks/useTheme';

const LABEL: Record<ThemeSetting, string> = { system: 'System', light: 'Light', dark: 'Dark' };
const ICON: Record<ThemeSetting, typeof Sun> = { system: Monitor, light: Sun, dark: Moon };

/** Theme cycle button — icon-only with aria-label + testid (rules.md allows this pairing). */
export function ThemeToggle() {
  const { theme, cycle } = useTheme();
  const Icon = ICON[theme];

  return (
    <button
      type="button"
      onClick={cycle}
      data-testid="theme-toggle"
      aria-label={`Theme: ${LABEL[theme]}. Activate to change.`}
      title={`Theme: ${LABEL[theme]} — click to change`}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:bg-surface-2 hover:text-text active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Icon size={16} aria-hidden="true" />
      <span className="sr-only">Change theme</span>
    </button>
  );
}
