import { transactionSortKey } from './transactionDisplay'

/**
 * Available balance shown on the home card (fixed demo figure).
 * Statement PDF opening balance is derived per ledger via {@link computeInitialOpeningForLedger}.
 */
/** Demo ledger closing / available balance (aligned with MSG Global NEFT salary credit). */
export const TARGET_CLOSING_BALANCE_INR = 52186

function sumDebitsCredits(rows) {
  let dr = 0
  let cr = 0
  for (const r of rows) {
    if (r.withdrawal > 0) dr += r.withdrawal
    if (r.deposit > 0) cr += r.deposit
  }
  return { dr, cr }
}

/**
 * Book balance before the first row in `rows`, chosen so
 * {@link computeClosingBalance}(opening, rows) === targetClosing.
 */
export function computeInitialOpeningForLedger(
  rows,
  targetClosing = TARGET_CLOSING_BALANCE_INR,
) {
  const { dr, cr } = sumDebitsCredits(rows)
  return targetClosing + dr - cr
}

/**
 * Closing balance from opening + all ledger rows (order independent for totals).
 * @param {number} opening
 * @param {Array<{ withdrawal?: number | null, deposit?: number | null }>} rows
 */
export function computeClosingBalance(opening, rows) {
  let b = opening
  for (const r of rows) {
    const dr = r.withdrawal > 0 ? r.withdrawal : 0
    const cr = r.deposit > 0 ? r.deposit : 0
    b = b - dr + cr
  }
  return b
}

export function sortChrono(transactions) {
  return [...transactions].sort((a, b) => transactionSortKey(a) - transactionSortKey(b))
}

/**
 * Balance carried forward at the start of `fromDate` (after all transactions on prior calendar days).
 */
export function getOpeningBalanceForRange(allRows, fromDate) {
  const baseOpening = computeInitialOpeningForLedger(allRows)
  const prior = allRows.filter((r) => r.date < fromDate)
  return computeClosingBalance(baseOpening, sortChrono(prior))
}

/**
 * Each row gets `balanceAfter` (running balance after applying that row).
 * @param {Array<Record<string, unknown>>} sortedRows chronological
 * @param {number} opening starting balance before first row
 */
export function withRunningBalances(sortedRows, opening) {
  let b = opening
  return sortedRows.map((r) => {
    const dr = r.withdrawal > 0 ? r.withdrawal : 0
    const cr = r.deposit > 0 ? r.deposit : 0
    b = b - dr + cr
    return { ...r, balanceAfter: b }
  })
}

export function formatRupee(n) {
  if (n == null || Number.isNaN(n)) return '—'
  return `₹${Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/** PDF-friendly amounts: Helvetica cannot render ₹ reliably, so use "Rs." + 2 decimals. */
export function formatInrPdf(n) {
  if (n == null || Number.isNaN(n)) return '—'
  const s = Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `Rs. ${s}`
}
