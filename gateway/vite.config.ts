import inject from '@rollup/plugin-inject'
import {TanStackRouterVite} from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'
import wasm from 'vite-plugin-wasm'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    TanStackRouterVite(),
    react(),
    {...inject({Buffer: ['buffer/', 'Buffer']}), enforce: 'post'},
    nodePolyfills(),
    svgr(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
