import { Link } from 'react-router-dom'
import { footerLinkToSlug } from '../content/sectionCopy'

const columns = [
  {
    title: 'Accounts',
    links: ['Savings Account', 'Current Account', 'Salary Account', 'Safe Deposit Locker'],
  },
  {
    title: 'Cards',
    links: ['Credit Cards', 'Debit Cards', 'Forex Cards', 'Commercial Cards'],
  },
  {
    title: 'Loans',
    links: ['Personal Loan', 'Home Loan', 'Car Loan', 'Gold Loan'],
  },
  {
    title: 'Support',
    links: ['Customer Care', 'Raise a Concern', 'FAQs', 'Grievance Redressal'],
  },
]

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="layout-wide site-footer__grid">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="site-footer__col-title">{col.title}</h3>
            <ul className="site-footer__list">
              {col.links.map((l) => (
                <li key={l}>
                  <Link to={`/${footerLinkToSlug(l)}`}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-footer__bottom">
        <div className="layout-wide site-footer__bottom-inner">
          <p>
            HDFC Bank is a leading private sector bank. Product names and layout are for
            presentation.
          </p>
          <nav className="site-footer__legal" aria-label="Legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
