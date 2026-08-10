import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  plugins: [
    react()
  ],

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },

  define: {
    global: 'globalThis',
    'process.env': {},
  },

  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },

  server: {
  host: "127.0.0.1",
  port: 5173,
},
});