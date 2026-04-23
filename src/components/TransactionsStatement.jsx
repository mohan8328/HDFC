import { useMemo, useState, useCallback } from 'react'
import hdfcLogo from '../assets/hdfc-bank-logo.png'
import { generateTransactionsForRange } from '../data/generateStatementDummyData'
import {
  getDateRangeForStatementPreset,
  STATEMENT_PERIOD_OPTIONS,
} from '../data/statementRange'
import {
  BANK_NAME,
  ACCOUNT_HOLDER_NAME,
  ACCOUNT_TYPE_LABEL,
  ACCOUNT_NUMBER_MASKED,
} from '../data/accountInfo'
import { downloadBlob } from '../utils/downloadBlob'
import { buildStatementPdfBlob } from '../utils/buildStatementPdf'
import { transactionSortKey } from '../utils/transactionDisplay'
import { sortChrono } from '../utils/statementLedger'
import { PaymentHistoryList } from './PaymentHistoryList'

function initialRange() {
  return getDateRangeForStatementPreset('current_month')
}

export function TransactionsStatement() {
  const [periodPreset, setPeriodPreset] = useState('current_month')
  const [{ fromDate, toDate }, setRange] = useState(() => initialRange())
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [busy, setBusy] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const applyPreset = useCallback(
    (preset) => {
      setPeriodPreset(preset)
      if (preset !== 'custom') {
        setRange(getDateRangeForStatementPreset(preset, new Date()))
      }
    },
    [],
  )

  const ledgerRows = useMemo(
    () => generateTransactionsForRange(fromDate, toDate),
    [fromDate, toDate],
  )

  const statementPeriodRows = useMemo(() => {
    return ledgerRows
      .filter((r) => r.date >= fromDate && r.date <= toDate)
      .sort((a, b) => transactionSortKey(a) - transactionSortKey(b))
  }, [ledgerRows, fromDate, toDate])

  const filtered = useMemo(() => {
    return ledgerRows
      .filter((r) => {
        if (r.date < fromDate || r.date > toDate) return false
        if (typeFilter === 'debit' && !(r.withdrawal > 0)) return false
        if (typeFilter === 'credit' && !(r.deposit > 0)) return false
        if (query.trim()) {
          const q = query.toLowerCase()
          const blob = `${r.merchant ?? ''} ${r.narration ?? ''} ${r.refNo ?? ''} ${r.memo ?? ''} ${r.category ?? ''}`
            .toLowerCase()
          if (!blob.includes(q)) return false
        }
        return true
      })
      .sort((a, b) => transactionSortKey(b) - transactionSortKey(a))
  }, [ledgerRows, fromDate, toDate, typeFilter, query])

  const downloadPdf = useCallback(async () => {
    if (statementPeriodRows.length === 0) return
    setLoadError(null)
    setBusy(true)
    try {
      const generatedAt = new Date().toLocaleString('en-IN', { hour12: true })
      const blob = await buildStatementPdfBlob({
        fromDate,
        toDate,
        generatedAt,
        transactions: statementPeriodRows,
        allLedgerRows: sortChrono(ledgerRows),
      })
      const name = `Payment_statement_${fromDate}_to_${toDate}.pdf`
      downloadBlob(blob, name)
    } catch (e) {
      setLoadError(
        e && e.message ? e.message : 'Could not build the PDF in the browser.',
      )
    } finally {
      setBusy(false)
    }
  }, [fromDate, toDate, statementPeriodRows, ledgerRows])

  return (
    <section id="transactions" className="statement" aria-labelledby="statement-heading">
      <div className="layout-wide">
        <div className="statement__head">
          <div>
            <h2 id="statement-heading" className="section-title">
              Payment history & statement
            </h2>
          </div>
          <div className="statement__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={downloadPdf}
              disabled={busy || statementPeriodRows.length === 0}
            >
              {busy ? 'Generating PDF…' : 'Download statement (PDF)'}
            </button>
          </div>
        </div>

        {loadError && (
          <p className="statement__error" role="alert">
            {loadError}
          </p>
        )}

        <div className="statement__identity">
          <img
            src={hdfcLogo}
            alt=""
            className="statement__identity-logo"
            width={160}
            height={48}
            decoding="async"
          />
          <div className="statement__identity-text">
            <p className="statement__identity-bank">{BANK_NAME}</p>
            <p className="statement__identity-holder">{ACCOUNT_HOLDER_NAME}</p>
            <p className="statement__identity-type">{ACCOUNT_TYPE_LABEL}</p>
            <p className="statement__identity-ac">A/c no. {ACCOUNT_NUMBER_MASKED}</p>
          </div>
        </div>

        <div className="statement__filters">
          <label className="statement__field statement__field--grow">
            <span>Statement period</span>
            <select
              value={periodPreset}
              onChange={(e) => applyPreset(e.target.value)}
              aria-label="Statement period"
            >
              {STATEMENT_PERIOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="statement__field">
            <span>From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setRange((r) => ({ ...r, fromDate: e.target.value }))
                setPeriodPreset('custom')
              }}
            />
          </label>
          <label className="statement__field">
            <span>To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setRange((r) => ({ ...r, toDate: e.target.value }))
                setPeriodPreset('custom')
              }}
            />
          </label>
          <label className="statement__field statement__field--grow">
            <span>Search payee, UPI ref, or category</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Bmtc, Travel, UPI"
            />
          </label>
          <label className="statement__field">
            <span>Type</span>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="debit">Debits only</option>
              <option value="credit">Credits only</option>
            </select>
          </label>
        </div>

        <h3 className="statement__subheading">History</h3>
        <PaymentHistoryList transactions={filtered} />

        <p className="statement__footnote">
          <strong>{filtered.length}</strong> row(s) shown above for the selected dates
          {typeFilter === 'debit' ? ' (debits only)' : typeFilter === 'credit' ? ' (credits only)' : ''}
          {query.trim() ? ' matching your search' : ''}. The PDF statement includes{' '}
          <strong>{statementPeriodRows.length}</strong> transaction(s) for the full period (
          {fromDate} to {toDate}), regardless of search or type filters.
        </p>
      </div>
    </section>
  )
}
