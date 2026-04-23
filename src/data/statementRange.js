function pad2(n) {
  return String(n).padStart(2, '0')
}

/** YYYY-MM-DD in local calendar from a Date (no UTC shift). */
export function formatLocalYmd(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/** Last calendar day of month (y, m) with m = 1–12. */
export function lastDayOfMonth(y, m) {
  return new Date(y, m, 0).getDate()
}

/**
 * @param {string} preset 'current_month' | '3_months' | '6_months' | '1_year'
 * @param {Date} [ref=new Date()]
 * @returns {{ fromDate: string, toDate: string }}
 */
export function getDateRangeForStatementPreset(preset, ref = new Date()) {
  const y = ref.getFullYear()
  const mo = ref.getMonth() + 1
  const todayStr = formatLocalYmd(ref)

  let monthsSpan = 1
  if (preset === '3_months') monthsSpan = 3
  else if (preset === '6_months') monthsSpan = 6
  else if (preset === '1_year') monthsSpan = 12

  const start = new Date(y, mo - 1 - (monthsSpan - 1), 1)
  const fromDate = `${start.getFullYear()}-${pad2(start.getMonth() + 1)}-01`

  const endLast = lastDayOfMonth(y, mo)
  const monthEndStr = `${y}-${pad2(mo)}-${pad2(endLast)}`
  const toDate = monthEndStr < todayStr ? monthEndStr : todayStr

  return { fromDate, toDate: toDate < fromDate ? fromDate : toDate }
}

export const STATEMENT_PERIOD_OPTIONS = [
  { value: 'current_month', label: 'Current month' },
  { value: '3_months', label: 'Last 3 months' },
  { value: '6_months', label: 'Last 6 months' },
  { value: '1_year', label: 'Last 1 year' },
  { value: 'custom', label: 'Custom (use dates below)' },
]
