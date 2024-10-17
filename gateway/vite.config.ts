import inject from '@rollup/plugin-inject'
import {TanStackRouterVite} from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    TanStackRouterVite(),
    react(),
    {...inject({Buffer: ['buffer/', 'Buffer']}), enforce: 'post'},
    nodePolyfills(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
