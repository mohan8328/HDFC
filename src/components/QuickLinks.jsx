import { Link } from 'react-router-dom'

const tiles = [
  {
    title: 'Pay Credit Card Bill',
    desc: 'Instant payment',
    icon: 'card',
    to: '/cards',
  },
  {
    title: 'Funds Transfer',
    desc: 'IMPS, NEFT, RTGS',
    icon: 'transfer',
    to: '/pay',
  },
  {
    title: 'Recharge & Pay Bills',
    desc: 'Mobile, DTH, utilities',
    icon: 'bolt',
    to: '/pay',
  },
  {
    title: 'Open FD / RD',
    desc: 'Competitive rates',
    icon: 'pig',
    to: '/investments',
  },
  {
    title: 'Apply for Loan',
    desc: 'Home, personal, car',
    icon: 'home',
    to: '/loans',
  },
  {
    title: 'Book Tickets',
    desc: 'Flights, buses, trains',
    icon: 'ticket',
    to: '/smartbuy',
  },
]

function TileIcon({ name }) {
  switch (name) {
    case 'card':
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
          />
        </svg>
      )
    case 'transfer':
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 17.01V11h-2v7.01h-3L15 22l4-4.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"
          />
        </svg>
      )
    case 'bolt':
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path fill="currentColor" d="M7 2v11h3v9l7-12h-4l4-8z" />
        </svg>
      )
    case 'pig':
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path
            fill="currentColor"
            d="M19.83 7.5l-2.27-2.27A2 2 0 0016.35 4H14V2h-4v2H7.65a2 2 0 00-1.41.59L4 7.5c-.78.78-.78 2.05 0 2.83L7.5 13.5c.78.78 2.05.78 2.83 0l.88-.88A5.98 5.98 0 0018 15v2c0 1.1-.9 2-2 2h-1v2h4c2.21 0 4-1.79 4-4v-3.17c0-.53-.21-1.04-.59-1.41l-2.58-2.58z"
          />
        </svg>
      )
    case 'home':
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"
          />
        </svg>
      )
    case 'ticket':
      return (
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
          <path
            fill="currentColor"
            d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-2 .89-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-8.5 4.5h-3v-3h3v3z"
          />
        </svg>
      )
    default:
      return null
  }
}

export function QuickLinks() {
  return (
    <section className="quick" aria-labelledby="quick-heading">
      <div className="layout-wide">
        <h2 id="quick-heading" className="section-title">
          Ways to bank with us
        </h2>
        <ul className="quick__grid">
          {tiles.map((t) => (
            <li key={t.title}>
              <Link to={t.to} className="quick__tile">
                <span className="quick__icon">
                  <TileIcon name={t.icon} />
                </span>
                <span className="quick__title">{t.title}</span>
                <span className="quick__desc">{t.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
