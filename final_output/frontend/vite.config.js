import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // VITE_API_BASE_URL is optional.
  // - If empty/unset (recommended for dev), requests go to /user, /idle, ... and Vite proxies them to the backend.
  // - If set, you can also use it for proxy target or for production builds.
  const env = loadEnv(mode, process.cwd(), '');
  const target = (env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');

  const proxyConfig = {
    target,
    changeOrigin: true,
  };

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    server: {
      proxy: {
        '/user': proxyConfig,
        '/idle': proxyConfig,
        '/order': proxyConfig,
        '/favorite': proxyConfig,
        '/message': proxyConfig,
        '/address': proxyConfig,
        '/order-address': proxyConfig,
        '/file': proxyConfig,
        '/image': proxyConfig,
        '/admin': proxyConfig,
      },
    },
  };
});
