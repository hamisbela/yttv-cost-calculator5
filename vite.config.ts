import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Ensure blog content is included in the build
  assetsInclude: ['**/*.md', '**/*.jpg', '**/*.png', '**/*.gif', '**/*.jpeg', '**/*.webp'],
  publicDir: 'blog-content',
  server: {
    fs: {
      // Allow serving files from project root, blog-content, and node_modules
      allow: ['.', 'blog-content', 'node_modules'],
      strict: false
    },
  },
});