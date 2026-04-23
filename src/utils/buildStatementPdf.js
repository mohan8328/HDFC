import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import hdfcLogo from '../assets/hdfc-bank-logo.png'
import {
  BANK_NAME,
  ACCOUNT_HOLDER_NAME,
  ACCOUNT_TYPE_LABEL,
  ACCOUNT_NUMBER_MASKED,
} from '../data/accountInfo'
import { paymentSourceLabel } from './transactionDisplay'
import {
  getOpeningBalanceForRange,
  sortChrono,
  withRunningBalances,
  formatInrPdf,
} from './statementLedger'

function fmtDrCr(n) {
  if (n == null || n <= 0) return '—'
  return formatInrPdf(n)
}

function fetchImageAsDataUrl(url) {
  return fetch(url)
    .then((r) => r.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const fr = new FileReader()
          fr.onload = () => resolve(/** @type {string} */ (fr.result))
          fr.onerror = reject
          fr.readAsDataURL(blob)
        }),
    )
}

/**
 * @param {object} p
 * @param {string} p.fromDate
 * @param {string} p.toDate
 * @param {string} p.generatedAt
 * @param {Array<Record<string, unknown>>} p.transactions
 * @param {Array<Record<string, unknown>>} p.allLedgerRows
 */
export async function buildStatementPdfBlob({
  fromDate,
  toDate,
  generatedAt,
  transactions,
  allLedgerRows,
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 12
  const cx = pageW / 2

  const opening = getOpeningBalanceForRange(allLedgerRows, fromDate)
  const inRangeSorted = sortChrono(transactions)
  const withBal = withRunningBalances(inRangeSorted, opening)

  let yTop = 10
  let textX = margin + 34
  try {
    const dataUrl = await fetchImageAsDataUrl(hdfcLogo)
    doc.addImage(dataUrl, 'PNG', margin, yTop, 32, 11)
  } catch {
    textX = margin
    yTop = 8
  }
  doc.setFontSize(13)
  doc.setTextColor(0, 44, 91)
  doc.setFont('helvetica', 'bold')
  doc.text(BANK_NAME, textX, yTop + 5)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(60, 60, 60)
  doc.text(`Account holder: ${ACCOUNT_HOLDER_NAME}`, textX, yTop + 11)
  doc.text(`${ACCOUNT_TYPE_LABEL} · A/c no. ${ACCOUNT_NUMBER_MASKED}`, textX, yTop + 17)

  const blockBottom = yTop + 23
  let y = blockBottom + 6

  doc.setFontSize(12)
  doc.setTextColor(0, 44, 91)
  doc.setFont('helvetica', 'bold')
  doc.text('Account statement — UPI & payments', cx, y, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  y += 6

  doc.setFontSize(8.5)
  doc.setTextColor(60, 60, 60)
  doc.text(`Statement period: ${fromDate} to ${toDate}`, cx, y, { align: 'center' })
  y += 5
  doc.text(`Generated: ${generatedAt}`, cx, y, { align: 'center' })
  const startY = y + 8

  const openingRow = [
    fromDate,
    '—',
    'Opening balance (brought forward)',
    '—',
    '—',
    '—',
    '—',
    '—',
    formatInrPdf(opening),
  ]

  const body = [
    openingRow,
    ...withBal.map((r) => {
      const dr = r.withdrawal > 0 ? r.withdrawal : 0
      const cr = r.deposit > 0 ? r.deposit : 0
      return [
        r.date,
        r.time ?? '—',
        r.narration ?? r.merchant ?? '—',
        r.refNo ?? '—',
        r.category ?? r.memo ?? '—',
        paymentSourceLabel(r.paymentSource),
        fmtDrCr(dr),
        fmtDrCr(cr),
        formatInrPdf(r.balanceAfter),
      ]
    }),
  ]

  const head = [
    [
      'Date',
      'Time (24h)',
      'UPI description',
      'UPI reference',
      'Category',
      'Paid from',
      'Debit (Rs.)',
      'Credit (Rs.)',
      'Balance (Rs.)',
    ],
  ]

  const colW = (pageW - 2 * margin) / 9
  const columnStyles = Object.fromEntries(
    Array(9)
      .fill(0)
      .map((_, i) => [
        i,
        {
          halign: 'center',
          cellWidth: colW,
        },
      ]),
  )

  autoTable(doc, {
    startY,
    head,
    body,
    theme: 'grid',
    styles: {
      fontSize: 6.2,
      cellPadding: 1.1,
      overflow: 'linebreak',
      halign: 'center',
    },
    headStyles: {
      fillColor: [0, 76, 143],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: { halign: 'center' },
    columnStyles,
    margin: { left: margin, right: margin },
  })

  return doc.output('blob')
}
