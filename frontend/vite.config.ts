import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
// server: {
//   proxy: {
//     '/api': {
//       target: 'https://backend-1004166685896.europe-central2.run.app',
//       changeOrigin: true,
//       secure: true,
//     }
//   }
// }
});