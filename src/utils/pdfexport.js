// src/utils/pdfExport.js
export async function exportToPDF(title, headers, items) {
  const jsPDF = (await import('jspdf')).default
  const autoTable = (await import('jspdf-autotable')).default

  const doc = new jsPDF()
  doc.text(title || 'Data', 10, 10)

  autoTable(doc, {
    startY: 20,
    head: [headers.map(h => h.text)],
    body: items.map(item => headers.map(h => item[h.value]))
  })

  doc.save(`${title || 'data'}.pdf`)
}
