import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    hmr: {
      overlay: false // Kikapcsolja a HMR overlay hibaüzeneteket
    }
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore certain warnings
        if (warning.code === 'MESSAGES_CHANNEL_CLOSED') return
        if (warning.message?.includes('message channel closed')) return
        warn(warning)
      }
    }
  },
  optimizeDeps: {
    exclude: ['fsevents'] // Kizárjuk a problémás függőségeket
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
