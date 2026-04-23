import { Link } from 'react-router-dom'
import { TransactionsStatement } from '../components/TransactionsStatement'
import { PageFeatureCards } from '../components/PageFeatureCards'

const RELATED = [
  { title: 'Pay & transfer', text: 'UPI, NEFT, IMPS, and bill pay.', to: '/pay' },
  { title: 'Cards', text: 'Card payment, limit, and hotlisting.', to: '/cards' },
  { title: 'Loans', text: 'EMI, prepayment, and statement.', to: '/loans' },
]

export function TransactionsPage() {
  return (
    <div className="page-wrap">
      <div className="layout-wide page-wrap__head">
        <p className="page-section__crumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          Transactions
        </p>
      </div>
      <PageFeatureCards title="Quick services" items={RELATED} />
      <TransactionsStatement />
    </div>
  )
}
