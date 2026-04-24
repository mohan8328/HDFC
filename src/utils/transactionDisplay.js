/** @typedef {'hdfc' | 'other' | 'upi' | 'union' | 'neft'} PaymentSourceKey */

const SOURCE_LABELS = {
  hdfc: 'HDFC Bank',
  other: 'Other bank',
  upi: 'UPI',
  union: 'Union Bank',
  neft: 'NEFT',
}

export function paymentSourceLabel(key) {
  if (!key) return '—'
  return SOURCE_LABELS[key] ?? String(key)
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/**
 * "Paid on 20 Apr, 08:22 PM" from ISO date and HH:mm (24h).
 * @param {string} dateISO
 * @param {string} [time24]
 */
export function formatPaidOnLine(dateISO, time24) {
  if (!dateISO) return '—'
  const [y, m, d] = dateISO.split('-').map(Number)
  const t = new Date(y, m - 1, d)
  if (Number.isNaN(t.getTime())) return '—'
  const day = t.getDate()
  const mon = MONTHS[t.getMonth()] ?? '—'
  const timePart = time24
    ? `, ${formatTime12h(time24)}`
    : ''
  return `Paid on ${day} ${mon}${timePart}`
}

function formatTime12h(hhmm) {
  const [h, min] = hhmm.split(':').map((x) => parseInt(x, 10))
  if (Number.isNaN(h) || Number.isNaN(min)) return hhmm
  const h12 = h % 12 === 0 ? 12 : h % 12
  const suf = h < 12 ? 'AM' : 'PM'
  return `${h12}:${String(min).padStart(2, '0')} ${suf}`
}

/** @param {{ date: string, time?: string }} r */
export function transactionSortKey(r) {
  const t = r.time && /^\d{1,2}:\d{2}$/.test(r.time) ? r.time : '00:00'
  const [th, tm] = t.split(':').map((n) => parseInt(n, 10))
  const [y, mo, d] = r.date.split('-').map((n) => parseInt(n, 10))
  return new Date(y, mo - 1, d, th, tm, 0, 0).getTime()
}

/**
 * @param {string} ym YYYY-MM
 */
export function formatMonthBarLabel(ym) {
  const [y, m] = ym.split('-').map((n) => parseInt(n, 10))
  if (Number.isNaN(y) || Number.isNaN(m)) return ym
  return `${MONTHS[m - 1] ?? m} ${y}`
}

/**
 * @param {Array<{ date: string, withdrawal: number | null, deposit: number | null }>} list
 */
export function sumWithdrawals(list) {
  return list.reduce((a, r) => a + (r.withdrawal > 0 ? r.withdrawal : 0), 0)
}
