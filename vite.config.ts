import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base precisa casar com o nome do repo para o GitHub Pages servir os assets.
// Em dev (vite dev / mode !== production) o base '/' é usado automaticamente.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/caa-vitrine/' : '/',
}))
