import { useSearchParams, Link } from 'react-router-dom'
import { PageFeatureCards } from '../components/PageFeatureCards'

const SUGGESTED = [
  { title: 'Savings & accounts', text: 'Open or manage your account online.', to: '/accounts' },
  { title: 'Cards & payments', text: 'Credit, debit, and UPI in one place.', to: '/cards' },
  { title: 'Loans & EMI', text: 'Home, personal, and car loan options.', to: '/loans' },
]

export function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q')?.trim() || ''

  return (
    <div className="page-section">
      <div className="layout-wide page-section__inner">
        <p className="page-section__crumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          Search
        </p>
        <h1 className="page-section__title">Search</h1>
        {q ? (
          <p className="page-section__lead">
            You searched for: <strong>{q}</strong>. Refine your query or pick a service below.
          </p>
        ) : (
          <p className="page-section__lead">
            Enter a keyword in the search box in the header to look up products and help topics.
          </p>
        )}
        <p className="page-section__back">
          <Link to="/" className="link-more">
            ← Back to home
          </Link>
        </p>
      </div>
      <PageFeatureCards title="Popular services" items={SUGGESTED} />
    </div>
  )
}
