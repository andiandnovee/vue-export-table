import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'), // pastikan file ini ada dan ekspor komponen
      name: 'VueExportTable',
      fileName: (format) => `vue-export-table.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'jspdf', 'jspdf-autotable', 'xlsx'],
      output: {
        globals: {
          vue: 'Vue',
          jspdf: 'jsPDF', // ✅ Nama global yang digunakan oleh browser saat import UMD
          'jspdf-autotable': 'autoTable',
          xlsx: 'XLSX',
        }
      }
    }
  }
})
