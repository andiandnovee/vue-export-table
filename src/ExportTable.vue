<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'

const props = defineProps({
  columns: Array, // ['Nama', 'Email', ...]
  data: Array     // array of object
})

function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(props.data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

  XLSX.writeFile(workbook, 'data-export.xlsx')
}
</script>

<template>
  <div class="overflow-x-auto p-4 border rounded">
    <table class="min-w-full border">
      <thead class="bg-gray-100">
        <tr>
          <th v-for="col in columns" :key="col" class="p-2 border">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="index">
          <td v-for="col in columns" :key="col" class="p-2 border">
            {{ row[col] }}
          </td>
        </tr>
      </tbody>
    </table>

    <button
      @click="exportToExcel"
      class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Export ke Excel
    </button>
  </div>
</template>
