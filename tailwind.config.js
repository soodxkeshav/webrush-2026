/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-faint': 'var(--text-faint)',
        primary: '#6366f1',
        music: '#8b5cf6',
        purchase: '#f59e0b',
        transaction: '#3b82f6',
        quiet: '#14b8a6',
        wanderer: '#fb7185',
        night: '#6366f1',
        success: '#10b981',
        danger: '#ef4444',
      },
      maxWidth: {
        page: '80rem',
      },
    },
  },
  plugins: [],
};
