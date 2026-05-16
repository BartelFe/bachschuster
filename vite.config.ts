import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
      // Keep shaders readable in dev + during the build for easier debugging.
      // W10 polish will switch on `compress: true` for a small size win.
      compress: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // 5180 instead of the Vite default 5173 — sidesteps port collisions with
    // sibling projects (Jakob-Bader's vite often holds 5173/5174 on Felix's
    // machine). `strictPort: false` keeps the auto-bump fallback intact.
    port: 5180,
    strictPort: false,
    open: false,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          gsap: ['gsap'],
          // WebGL chunks are isolated so non-Home routes don't pay for three.js.
          three: [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/postprocessing',
          ],
        },
      },
    },
  },
});
