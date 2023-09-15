import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/

export default ({ mode }: any) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    build: {
      watch: {
        exclude: 'node_modules/**',
        include: 'src/**',
      },
    },
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 8082,
      proxy: {
        '/api': {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  });
};
