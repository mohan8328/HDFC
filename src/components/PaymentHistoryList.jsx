import { useMemo } from 'react'
import {
  formatMonthBarLabel,
  formatPaidOnLine,
  paymentSourceLabel,
  sumWithdrawals,
  transactionSortKey,
} from '../utils/transactionDisplay'
import { formatRupee } from '../utils/statementLedger'

function SourceLine({ source }) {
  return (
    <p className="phistory__source phistory__source--plain">
      <span className="phistory__source-label">From</span>{' '}
      <span className="phistory__source-text">{paymentSourceLabel(source)}</span>
    </p>
  )
}

/**
 * @param {object} props
 * @param {Array<Record<string, unknown>>} props.transactions
 */
export function PaymentHistoryList({ transactions }) {
  const groups = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => transactionSortKey(b) - transactionSortKey(a),
    )
    const byMonth = new Map()
    for (const r of sorted) {
      const ym = r.date && r.date.length >= 7 ? r.date.slice(0, 7) : 'unknown'
      if (!byMonth.has(ym)) byMonth.set(ym, [])
      byMonth.get(ym).push(r)
    }
    const months = Array.from(byMonth.keys()).sort((a, b) => b.localeCompare(a))
    return months.map((ym) => ({
      key: ym,
      label: formatMonthBarLabel(ym),
      total: sumWithdrawals(byMonth.get(ym) ?? []),
      rows: byMonth.get(ym) ?? [],
    }))
  }, [transactions])

  if (transactions.length === 0) {
    return <p className="phistory__empty">No payments in this range.</p>
  }

  return (
    <div className="phistory">
      {groups.map((g) => (
        <div key={g.key} className="phistory__month">
          <div className="phistory__bar">
            <span className="phistory__bar-month">{g.label}</span>
            <span className="phistory__bar-right">
              <span className="phistory__bar-label">Total spent</span>
              <span className="phistory__bar-amount">₹{g.total.toFixed(2)}</span>
            </span>
          </div>
          <ul className="phistory__list">
            {g.rows.map((r) => (
              <li key={r.id} className="phistory__row">
                <div className="phistory__body">
                  <p className="phistory__title">{r.merchant ?? r.narration}</p>
                  <p className="phistory__time">{formatPaidOnLine(r.date, r.time)}</p>
                  <p className="phistory__category">{r.category}</p>
                </div>
                <div className="phistory__amt-block">
                  <p className="phistory__amount">
                    {r.deposit != null && r.deposit > 0 ? (
                      <>
                        + {formatRupee(r.deposit)}
                      </>
                    ) : r.withdrawal != null && r.withdrawal > 0 ? (
                      <>− {formatRupee(r.withdrawal)}</>
                    ) : (
                      '—'
                    )}
                  </p>
                  <SourceLine source={r.paymentSource} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
