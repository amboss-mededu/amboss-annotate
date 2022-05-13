const path = require('path')
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'amboss-annotate'
    },
  },
  plugins: [
    copy({targets: [
      { src: path.resolve(__dirname, 'src/phrasios_us.json'), dest: 'dist/' },
      { src: path.resolve(__dirname, 'src/phrasios_de.json'), dest: 'dist/' },
      { src: path.resolve(__dirname, 'src/terms_us_en.json'), dest: 'dist/' },
      { src: path.resolve(__dirname, 'src/terms_de_de.json'), dest: 'dist/' },
    ], hook: 'writeBundle'}),
  ],
})
