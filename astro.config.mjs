import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite'; // Import from Vite plugin

export default defineConfig({
  integrations: [
    react(),
    // REMOVE tailwind() from integrations!
  ],
  vite: {
    plugins: [
      tailwindcss(), // Add tailwindcss here
    ],
  },
});