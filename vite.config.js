import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import alias from './config/aliases.config.js'

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias,
  },
  base: '/'
})
