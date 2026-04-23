import { Link } from 'react-router-dom'

const OFFERS = [
  {
    title: 'Home loan',
    text: 'Attractive interest rates, balance transfer, and quick sanctions on select projects.',
  },
  {
    title: 'Personal loan',
    text: 'Pre-approved offers for salaried customers with minimal documentation.',
  },
  {
    title: 'Car loan',
    text: 'Finance up to 100% of on-road price on eligible models with flexible tenure.',
  },
]

export function HomeLoanOffers() {
  return (
    <section className="home-loans layout-wide" aria-labelledby="home-loans-heading">
      <h2 id="home-loans-heading" className="section-title home-loans__title">
        Loan offers for you
      </h2>
      <ul className="home-loans__grid">
        {OFFERS.map((o) => (
          <li key={o.title}>
            <article className="home-loan-card">
              <h3 className="home-loan-card__title">{o.title}</h3>
              <p className="home-loan-card__text">{o.text}</p>
              <Link to="/loans" className="home-loan-card__cta">
                Know more
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
