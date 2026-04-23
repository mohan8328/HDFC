import {
  ACCOUNT_HOLDER_NAME,
  ACCOUNT_TYPE_LABEL,
  ACCOUNT_NUMBER_MASKED,
  AVAILABLE_BALANCE_INR,
} from '../data/accountInfo'
import { BalanceField } from './BalanceField'

export function HomeAccountSummary() {
  return (
    <section className="home-account layout-wide" aria-labelledby="home-account-heading">
      <h1 id="home-account-heading" className="home-account__title">
        My account
      </h1>
      <div className="home-account__card">
        <p className="home-account__holder">{ACCOUNT_HOLDER_NAME}</p>
        <p className="home-account__type">{ACCOUNT_TYPE_LABEL}</p>
        <p className="home-account__number">A/c no. {ACCOUNT_NUMBER_MASKED}</p>
        <BalanceField amount={AVAILABLE_BALANCE_INR} variant="home" label="Available balance" />
      </div>
    </section>
  )
}
