import { Link } from 'react-router-dom'
import { getSectionCopy } from '../content/sectionCopy'

export function SectionPage({ sectionId }) {
  const { title, lead, cards, bullets } = getSectionCopy(sectionId)

  return (
    <div className="page-section">
      <div className="layout-wide">
        <div className="page-section__inner">
          <p className="page-section__crumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true"> / </span>
            {title}
          </p>
          <h1 className="page-section__title">{title}</h1>
          <p className="page-section__lead">{lead}</p>
        </div>

        {cards && cards.length > 0 && (
          <ul className="section-page__cards">
            {cards.map((c) => (
              <li key={c.title}>
                <article className="section-page__card">
                  <h2 className="section-page__card-title">{c.title}</h2>
                  <p className="section-page__card-text">{c.text}</p>
                </article>
              </li>
            ))}
          </ul>
        )}

        {bullets && bullets.length > 0 && (
          <div className="page-section__inner">
            <ul className="page-section__bullets">
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="page-section__inner">
          <p className="page-section__back">
            <Link to="/" className="link-more">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
