<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">{{ props.title }}</h2>

      <!-- Tombol Export -->
      <div class="flex gap-2">
        <button @click="exportCSV" class="btn-export bg-emerald-500">
          CSV
        </button>
        <button @click="exportExcel" class="btn-export bg-indigo-500">
          Excel
        </button>
        <button @click="exportPDF" class="btn-export bg-rose-500">PDF</button>
      </div>
    </div>

    <!-- Tabel -->
    <div
      class="overflow-x-auto relative rounded border"
      :style="{
        ...Object.fromEntries(
          (leftStickyOffsets.value || []).map((offset, i) => [
            `--offset-left-${i}`,
            `${offset}px`,
          ])
        ),
        ...Object.fromEntries(
          (rightStickyOffsets.value || []).map(([i, offset]) => [
            `--offset-right-${i}`,
            `${offset}px`,
          ])
        ),
      }"
    >
      <table class="min-w-full text-sm text-gray-800">
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="(header, i) in props.headers"
              :key="header.value"
              v-bind="getStickyClass(header, i)"
              :class="['text-left p-2', header.class]"
            >
              {{ header.text }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedItems"
            :key="item.id || index"
            class="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
          >
            <td
              v-for="(header, j) in props.headers"
              :key="header.value"
              v-bind="getStickyClass(header, j)"
              :class="['border px-2 py-1 whitespace-nowrap', header.class]"
            >
              <slot :name="`cell-${header.value}`" :row="item">
                {{ item[header.value] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginasi -->
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Menampilkan {{ startIndex + 1 }}–{{ endIndex }} dari
        {{ filteredItems.length }}
      </div>
      <div class="flex items-center gap-2">
        <button @click="prevPage" :disabled="page === 1" class="btn-nav">
          &lt;
        </button>
        <span>Hal. {{ page }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="btn-nav"
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { utils, writeFile } from "xlsx";
import { exportToPDF } from "./utils/pdfexport.js";

// Tangkap props ke variabel `props`
const props = defineProps({
  title: String,
  headers: Array,
  items: Array,
  search: String,
  perPage: { type: Number, default: 10 },
});

const page = ref(1);

// Filtering
const filteredItems = computed(() => {
  if (!props.search) return props.items;
  const keyword = props.search.toLowerCase();
  return props.items.filter((item) =>
    Object.values(item).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(keyword)
    )
  );
});

//console.log("✅ headers:", props.headers);
//console.log("✅ items:", props.items);

// Pagination
const totalPages = computed(() =>
  Math.ceil(filteredItems.value.length / props.perPage)
);
const startIndex = computed(() => (page.value - 1) * props.perPage);
const endIndex = computed(() =>
  Math.min(page.value * props.perPage, filteredItems.value.length)
);
const paginatedItems = computed(() =>
  filteredItems.value.slice(startIndex.value, endIndex.value)
);

// Reset page saat search atau items berubah
watch(
  () => [props.search, props.items],
  () => {
    page.value = 1;
  }
);

function getStickyClass(header, index) {
  if (!header.sticky) return {};

  const position = header.stickyPosition || "left";
  const zIndex = position === "right" ? "z-30" : "z-20";

  const offset =
    position === "left"
      ? leftStickyOffsets.value[index] || 0
      : rightStickyOffsets.value.find(([i]) => i === index)?.[1] || 0;

  return {
    class: `sticky bg-white ${zIndex}`,
    style: `${position}: ${offset}px; background: white;`,
  };
}

// Fungsi untuk mendapatkan kelas sticky
// Menghitung offset untuk kolom sticky di kiri
const leftStickyOffsets = computed(() => {
  let offset = 0;
  if (!props.headers || !Array.isArray(props.headers)) return [];

  return props.headers.map((header) => {
    if (header.sticky && header.stickyPosition === "left") {
      const current = offset;
      offset += 150;
      return current;
    }
    return null;
  });
});

// Menghitung offset untuk kolom sticky di kanan
const rightStickyOffsets = computed(() => {
  let offset = 0;
  const arr = props.headers;
  const results = [];

  if (!arr || !Array.isArray(arr)) return [];

  for (let i = arr.length - 1; i >= 0; i--) {
    const header = arr[i];
    if (header.sticky && header.stickyPosition === "right") {
      results.unshift([i, offset]); // disimpan dari awal (biar urut kanan)
      offset += 150; // asumsi lebar kolom
    }
  }

  return results;
});

function logItem(item, key) {
  console.log(`📦 item[${key}]:`, item[key]);
  return item[key];
}

// Navigasi halaman
function prevPage() {
  if (page.value > 1) page.value--;
}
function nextPage() {
  if (page.value < totalPages.value) page.value++;
}

// Export CSV
function exportCSV() {
  const rows = [props.headers.map((h) => h.text)];
  filteredItems.value.forEach((item) => {
    rows.push(props.headers.map((h) => item[h.value]));
  });

  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${props.title || "data"}.csv`;
  link.click();
}

// Export Excel
function exportExcel() {
  const data = filteredItems.value.map((item) =>
    Object.fromEntries(props.headers.map((h) => [h.text, item[h.value]]))
  );
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");
  writeFile(workbook, `${props.title || "data"}.xlsx`);
}

// Export PDF
function exportPDF() {
  exportToPDF(props.title, props.headers, filteredItems.value);
}
</script>

<style scoped>
.btn-export {
  @apply text-white px-2 py-1 rounded text-xs hover:opacity-90;
}

.btn-nav {
  @apply px-2 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50;
}
</style>
