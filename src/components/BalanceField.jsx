import { useState } from 'react'
import { formatRupee } from '../utils/statementLedger'

function maskNumericChars(formatted) {
  return formatted.replace(/[0-9]/g, '•')
}

/** Open eye — tap to reveal balance (masked state). */
function IconEyeOpen() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        fill="currentColor"
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
      />
    </svg>
  )
}

/** Slashed eye — tap to hide balance (visible state). */
function IconEyeOff() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      <path
        fill="currentColor"
        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l1.49 1.49A9.953 9.953 0 0 0 23 12c-1.73-4.39-6-7.5-11-7.5-1.43 0-2.8.26-4.07.74l1.99 1.99c.57-.22 1.18-.35 1.84-.35zm-1-5.17L3.5 4.5 2.1 3.09 3.51 1.68l17.81 17.81-1.41 1.41-2.22-2.22A9.87 9.87 0 0 1 12 17a9.87 9.87 0 0 1-6.99-2.88L1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l-2.98-2.98A4.98 4.98 0 0 1 7 12c0-1.15.39-2.2 1.04-3.04L3.5 4.5zM12 9c-1.1 0-2 .9-2 2 0 .35.09.68.25.97l2.24 2.24A2 2 0 0 0 12 9z"
      />
    </svg>
  )
}

/**
 * @param {object} props
 * @param {number} props.amount
 * @param {string} [props.label]
 * @param {'header' | 'home'} [props.variant]
 */
export function BalanceField({ amount, label = 'Available balance', variant = 'header' }) {
  const [revealed, setRevealed] = useState(false)
  const formatted = formatRupee(amount)
  const display = revealed ? formatted : maskNumericChars(formatted)

  return (
    <div className={`balance-field balance-field--${variant}`}>
      <span className="balance-field__label">{label}</span>
      <div className="balance-field__row">
        <span className="balance-field__value" aria-label={revealed ? `Balance ${formatted}` : 'Balance hidden'}>
          {display}
        </span>
        <button
          type="button"
          className="balance-field__eye"
          onClick={() => setRevealed((v) => !v)}
          aria-pressed={revealed}
          aria-label={revealed ? 'Hide balance' : 'Show balance'}
        >
          {revealed ? <IconEyeOff /> : <IconEyeOpen />}
        </button>
      </div>
    </div>
  )
}
