import { Link } from 'react-router-dom'

const products = [
  {
    title: 'Savings Account',
    text: 'Zero-balance options and doorstep banking for your convenience.',
    tag: 'Popular',
    to: '/accounts',
  },
  {
    title: 'Credit Cards',
    text: 'Rewards, travel miles, and cashback tailored to your lifestyle.',
    tag: 'Offers',
    to: '/cards',
  },
  {
    title: 'Home Loan',
    text: 'Attractive rates with flexible tenure and quick approvals.',
    tag: 'Featured',
    to: '/loans',
  },
]

export function ProductsStrip() {
  return (
    <section className="products" id="products" aria-labelledby="products-heading">
      <div className="layout-wide">
        <div className="products__head">
          <h2 id="products-heading" className="section-title">
            Popular products
          </h2>
          <Link to="/offers" className="link-more">
            View all products
          </Link>
        </div>
        <div className="products__row">
          {products.map((p) => (
            <article key={p.title} className="product-card">
              <span className="product-card__tag">{p.tag}</span>
              <h3 className="product-card__title">{p.title}</h3>
              <p className="product-card__text">{p.text}</p>
              <Link to={p.to} className="product-card__cta">
                Know more
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
