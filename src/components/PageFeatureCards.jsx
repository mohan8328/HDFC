import { Link } from 'react-router-dom'

/**
 * @param {{ title: string, text: string, to: string }[]} items
 */
export function PageFeatureCards({ title = 'You may also like', items }) {
  if (!items?.length) return null
  return (
    <div className="page-feature-cards layout-wide">
      <h2 className="page-feature-cards__heading">{title}</h2>
      <ul className="page-feature-cards__grid">
        {items.map((c) => (
          <li key={c.to + c.title}>
            <Link to={c.to} className="page-feature-cards__card">
              <span className="page-feature-cards__card-title">{c.title}</span>
              <span className="page-feature-cards__card-text">{c.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
