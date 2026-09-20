import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps asset URLs relative so the build works on GitHub Pages
// project sites and from file:// after build (architecture.md §12).
export default defineConfig({
  base: './',
  plugins: [react()],
});
