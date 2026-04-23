import { formatLocalYmd, lastDayOfMonth } from './statementRange'

const CAT_TO_KEY = {
  Travel: 'travel',
  Groceries: 'groceries',
  Food: 'food',
  Shopping: 'shopping',
  'Money Transfer': 'moneyTransfer',
}

let _seq = 0

function randomLookingUpiRef(id) {
  const a = (id * 1_104_305_245 + 12_345) % 2_147_483_646
  const b = (a * 48_271 + id * 97) % 2_147_483_646
  const c = b % 900_000_000_000
  return String(100_000_000_000 + c)
}

function hashString(s) {
  let h = 1779033703
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function row({
  date,
  time,
  merchant,
  amount,
  category,
  paymentSource,
  refNo = null,
  deposit = null,
}) {
  _seq += 1
  const id = _seq
  const categoryKey = CAT_TO_KEY[category] ?? 'groceries'
  const ref = refNo ?? randomLookingUpiRef(id)
  const withdrawal = deposit != null && deposit > 0 ? 0 : amount
  return {
    id,
    date,
    valueDate: date,
    time,
    merchant,
    narration: `UPI/${merchant}`,
    refNo: ref,
    category,
    categoryKey,
    paymentSource,
    withdrawal: withdrawal > 0 ? withdrawal : null,
    deposit: deposit != null && deposit > 0 ? deposit : null,
    balance: null,
    memo: category,
  }
}

const BMTC_SUFFIXES = [
  'Ka51aj8572',
  'Ka57f2238',
  'Ka57f0127',
  'Ka57f5224',
  'Ka51aj8585',
  'Ka57f6344',
  'Ka57f1137',
  'Ka51aj8607',
  'Ka57f3059',
  'Ka01f9468',
  'Ka57f3073',
  'Ka51aj7592',
  'Ka51aj8608',
  'Ka51aj8913',
  'Ka57f5289',
  'Ka57f4904',
]

const SMALL_FOOD = [
  'Sri Muneshwara Swami Condiments',
  'Chai Point',
  'S L V Iyengars Bakery And Cake Corner',
  'Eatfit',
]

const SMALL_TRANSFER = [
  'Mr Naresh',
  'Vivek V',
  'Bhagya R',
  'Ranjeet Singh',
  'Manjunath M',
  'Mr Manjunath M',
]

const SOURCES = ['hdfc', 'hdfc', 'hdfc', 'other', 'upi', 'union']

/** Typical BMTC UPI fares (₹). */
const BMTC_FARES = [6, 23, 23, 28, 28, 40, 40, 40, 60, 90]

/** Small peer / shop amounts (₹). */
const SMALL_AMOUNTS = [10, 10, 20, 20, 20, 28, 36, 40, 50]

function bmtcMerchant(rng) {
  const suf = BMTC_SUFFIXES[Math.floor(rng() * BMTC_SUFFIXES.length)]
  if (rng() < 0.1) return 'Bmtc'
  return `Bmtc Bus ${suf}`
}

function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

function randomTime(rng) {
  const h = 7 + Math.floor(rng() * 15)
  const m = Math.floor(rng() * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function zeptoAmount(rng) {
  return 300 + Math.floor(rng() * 101)
}

/**
 * @param {number} fullDaysInMonth calendar days in this month (28–31)
 * @param {number} effDays days in this month overlapping the statement range
 */
function targetTxCountForMonth(fullDaysInMonth, effDays) {
  const base = 40
  if (effDays >= fullDaysInMonth) return base
  return Math.max(12, Math.round((base * effDays) / fullDaysInMonth))
}

function parseYmd(s) {
  const [y, m, d] = s.split('-').map((n) => parseInt(n, 10))
  return new Date(y, m - 1, d)
}

function monthsKey(y, m) {
  return `${y}-${String(m).padStart(2, '0')}`
}

/**
 * Dummy UPI-style rows for the inclusive date range (local dates).
 * ~40 debits per full month: mostly BMTC (₹6–90), a few Zepto (₹300–400), rest tiny transfers.
 */
export function generateTransactionsForRange(fromDate, toDate) {
  _seq = 0
  const rows = []
  const start = parseYmd(fromDate)
  const end = parseYmd(toDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return rows
  }

  let y = start.getFullYear()
  let mo = start.getMonth() + 1

  while (true) {
    const ym = monthsKey(y, mo)
    const first = new Date(y, mo - 1, 1)
    const lastD = lastDayOfMonth(y, mo)
    const last = new Date(y, mo - 1, lastD)
    const effStart = first < start ? start : first
    const effEnd = last > end ? end : last
    if (effStart <= effEnd) {
      const rng = mulberry32(hashString(`${fromDate}|${toDate}|${ym}`))
      const effDays =
        Math.floor((effEnd.getTime() - effStart.getTime()) / 86400000) + 1
      const nTotal = targetTxCountForMonth(lastD, effDays)

      const nZepto = Math.max(1, Math.min(4, Math.round(nTotal * 0.075)))
      const nOtherSmall = Math.max(2, Math.min(8, Math.round(nTotal * 0.1)))
      const nBmtc = Math.max(1, nTotal - nZepto - nOtherSmall)

      /** @type {{ kind: 'bmtc' | 'zepto' | 'small' }[]} */
      const kinds = []
      for (let i = 0; i < nBmtc; i++) kinds.push({ kind: 'bmtc' })
      for (let i = 0; i < nZepto; i++) kinds.push({ kind: 'zepto' })
      for (let i = 0; i < nOtherSmall; i++) kinds.push({ kind: 'small' })
      shuffleInPlace(kinds, rng)

      const dayPool = []
      for (let t = effStart.getTime(); t <= effEnd.getTime(); t += 86400000) {
        dayPool.push(formatLocalYmd(new Date(t)))
      }

      for (const { kind } of kinds) {
        const ymd = dayPool[Math.floor(rng() * dayPool.length)]
        if (ymd < fromDate || ymd > toDate) continue

        if (kind === 'bmtc') {
          const amt = BMTC_FARES[Math.floor(rng() * BMTC_FARES.length)]
          rows.push(
            row({
              date: ymd,
              time: randomTime(rng),
              merchant: bmtcMerchant(rng),
              amount: amt,
              category: 'Travel',
              paymentSource: SOURCES[Math.floor(rng() * SOURCES.length)],
            }),
          )
        } else if (kind === 'zepto') {
          rows.push(
            row({
              date: ymd,
              time: randomTime(rng),
              merchant: 'Zepto Marketplace Pr',
              amount: zeptoAmount(rng),
              category: 'Groceries',
              paymentSource: SOURCES[Math.floor(rng() * SOURCES.length)],
            }),
          )
        } else {
          const useTransfer = rng() < 0.55
          const merchant = useTransfer
            ? SMALL_TRANSFER[Math.floor(rng() * SMALL_TRANSFER.length)]
            : SMALL_FOOD[Math.floor(rng() * SMALL_FOOD.length)]
          const category = useTransfer ? 'Money Transfer' : 'Food'
          const amt = SMALL_AMOUNTS[Math.floor(rng() * SMALL_AMOUNTS.length)]
          rows.push(
            row({
              date: ymd,
              time: randomTime(rng),
              merchant,
              amount: amt,
              category,
              paymentSource: SOURCES[Math.floor(rng() * SOURCES.length)],
            }),
          )
        }
      }
    }

    if (last >= end) break
    mo += 1
    if (mo > 12) {
      mo = 1
      y += 1
    }
  }

  return rows
}
