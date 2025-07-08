import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'), // file ini harus ekspor komponen utama
      name: 'VueExportTable',
      fileName: (format) => `vue-export-table.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // ⛔ jangan dibundle
      external: ['vue', 'jspdf', 'jspdf-autotable', 'xlsx'],
      output: {
        globals: {
          vue: 'Vue',
          jspdf: 'jsPDF',
          'jspdf-autotable': 'autoTable',
          xlsx: 'XLSX',
        }
      }
    }
  }
})
