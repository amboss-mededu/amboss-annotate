const path = require('path')
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'inline',
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'amboss-annotate',
      formats: ['es']
    },
  },
})
