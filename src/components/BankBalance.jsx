import { AVAILABLE_BALANCE_INR } from '../data/accountInfo'
import { BalanceField } from './BalanceField'

export function BankBalance() {
  return (
    <div className="bank-balance">
      <BalanceField amount={AVAILABLE_BALANCE_INR} variant="header" />
    </div>
  )
}
