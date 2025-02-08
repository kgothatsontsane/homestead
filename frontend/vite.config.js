/// <reference types="vite/client" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ['babel-plugin-react-compiler']
          ]
        }
      })
    ],
    optimizeDeps: {
      include: ['react/compiler-runtime', '@clerk/clerk-react']
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      port: parseInt(env.VITE_PORT)
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            clerk: ['@clerk/clerk-react'],
            vendor: ['react', 'react-dom', 'react-router-dom'],
          }
        }
      },
      chunkSizeWarningLimit: 1000
    }
  }
})

