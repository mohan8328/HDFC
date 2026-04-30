import { formatLocalYmd, lastDayOfMonth } from './statementRange'

const CAT_TO_KEY = {
  Travel: 'travel',
  Groceries: 'groceries',
  Food: 'food',
  Shopping: 'shopping',
  'Money Transfer': 'moneyTransfer',
  Salary: 'salary',
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
  narration: narrationOverride = null,
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
    narration: narrationOverride ?? `UPI/${merchant}`,
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

/** One-off NEFT credit (e.g. salary) — not included in April debit scaling. */
function injectMsgGlobalNeftCredit(rows, fromDate, toDate) {
  const start = new Date(fromDate)
  const end = new Date(toDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return

  const years = new Set()
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    const d = new Date(t)
    if (d.getMonth() === 3) years.add(d.getFullYear()) // April
  }
  const refBase = 5041289000000
  for (const year of years) {
    const ymd = `${year}-04-29`
    if (ymd < fromDate || ymd > toDate) continue
    _seq += 1
    rows.push(
      row({
        date: ymd,
        time: '15:30',
        merchant: 'MSG Global Solutions India Private Limited',
        amount: 0,
        category: 'Salary',
        paymentSource: 'neft',
        refNo: `NEFTC${String(refBase + _seq).slice(0, 12)}`,
        deposit: 52_186,
        narration:
          'NEFT CR — MSG Global Solutions India Private Limited / salary payment',
      }),
    )
  }
}

/** BMTC trips on 28–29 Apr only (no BMTC on 30 Apr). Salary ₹52,186 is NEFT on 29 Apr. */
function injectAprilBmtcDays(rows, fromDate, toDate) {
  const start = new Date(fromDate)
  const end = new Date(toDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return

  const years = new Set()
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    const d = new Date(t)
    if (d.getMonth() === 3) years.add(d.getFullYear())
  }

  const bmtcDays = [
    { day: 28, time: '09:15', amt: 28, suf: 'Ka51aj8572' },
    { day: 29, time: '08:40', amt: 40, suf: 'Ka57f2238' },
  ]

  for (const year of years) {
    for (const { day, time, amt, suf } of bmtcDays) {
      const ymd = `${year}-04-${String(day).padStart(2, '0')}`
      if (ymd < fromDate || ymd > toDate) continue
      rows.push(
        row({
          date: ymd,
          time,
          merchant: `Bmtc Bus ${suf}`,
          amount: amt,
          category: 'Travel',
          paymentSource: 'upi',
        }),
      )
    }
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

/** April only: higher BMTC fares (₹23→40, ₹40→80); month total debits normalized to ~₹4500 below. */
const BMTC_FARES_APRIL = [6, 40, 40, 28, 28, 80, 80, 80, 60, 90]
const APRIL_DEBIT_TARGET_INR = 4500

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
      const rowsBeforeMonth = rows.length
      const rng = mulberry32(hashString(`${fromDate}|${toDate}|${ym}`))
      const effDays =
        Math.floor((effEnd.getTime() - effStart.getTime()) / 86400000) + 1
      let nTotal = targetTxCountForMonth(lastD, effDays)
      if (mo === 4) {
        nTotal = Math.round(nTotal * 1.22)
      }

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
        let ymd
        if (kind === 'bmtc' && mo === 4) {
          const poolNoApr30 = dayPool.filter((d) => parseInt(String(d.split('-')[2]), 10) !== 30)
          if (poolNoApr30.length === 0) continue
          ymd = poolNoApr30[Math.floor(rng() * poolNoApr30.length)]
        } else {
          ymd = dayPool[Math.floor(rng() * dayPool.length)]
        }
        if (ymd < fromDate || ymd > toDate) continue

        if (kind === 'bmtc') {
          const fares = mo === 4 ? BMTC_FARES_APRIL : BMTC_FARES
          const amt = fares[Math.floor(rng() * fares.length)]
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

      if (mo === 4) {
        const monthSlice = rows.slice(rowsBeforeMonth)
        let sum = 0
        for (const r of monthSlice) sum += r.withdrawal ?? 0
        if (sum > 0) {
          const factor = APRIL_DEBIT_TARGET_INR / sum
          for (const r of monthSlice) {
            if (r.withdrawal && r.withdrawal > 0) {
              r.withdrawal = Math.max(1, Math.round(r.withdrawal * factor))
            }
          }
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

  injectMsgGlobalNeftCredit(rows, fromDate, toDate)
  injectAprilBmtcDays(rows, fromDate, toDate)

  return rows
}
