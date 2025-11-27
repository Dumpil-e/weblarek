import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true, // твой IP или true для всех интерфейсов
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [
          './src/scss'
        ],
      },
    },
  },
})