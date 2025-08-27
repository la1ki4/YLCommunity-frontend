import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import alias from './config/aliases.config.js'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias,
  },
  base: '/'
})
