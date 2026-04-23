import { useState } from 'react'
import { Link } from 'react-router-dom'

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="layout-wide hero__grid">
        <div className="hero__copy">
          <p className="hero__eyebrow">Personal Banking</p>
          <h1 id="hero-heading" className="hero__title">
            Banking that moves with you
          </h1>
          <p className="hero__lead">
            Save smarter, pay securely, and grow your money with products
            designed for your everyday needs.
          </p>
          <div className="hero__actions">
            <Link to="/accounts" className="btn btn--primary btn--lg">
              Explore Savings Accounts
            </Link>
            <Link to="/offers" className="btn btn--ghost btn--lg">
              View current offers
            </Link>
          </div>
          <div className="hero__dots" role="tablist" aria-label="Promotions">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                className={`hero__dot ${activeSlide === i ? 'is-active' : ''}`}
                aria-selected={activeSlide === i}
                aria-label={`Promo ${i + 1} of 3`}
                onClick={() => setActiveSlide(i)}
              />
            ))}
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card hero__card--1" />
          <div className="hero__card hero__card--2" />
          <div className="hero__glow" />
        </div>
      </div>
    </section>
  )
}
