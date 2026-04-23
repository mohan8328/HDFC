import { NavLink, Link } from 'react-router-dom'
import { MAIN_NAV, TOP_RIBBON_LEFT, TOP_RIBBON_RIGHT, UTILITY_LINKS } from '../navConfig'

export function MainNavigation({ menuOpen, onClose }) {
  return (
    <nav
      id="main-nav"
      className={`main-nav ${menuOpen ? 'is-open' : ''}`}
      aria-label="Primary"
    >
      <div className="main-nav__mobile-bar">
        <span className="main-nav__mobile-title">Menu</span>
        <button
          type="button"
          className="main-nav__close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="layout-wide main-nav__inner">
        <ul className="main-nav__list">
          {MAIN_NAV.map(({ label, to }) => (
            <li key={to} className="main-nav__item">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `main-nav__link${isActive ? ' is-active' : ''}`
                }
                onClick={onClose}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="main-nav__cta">
          <NavLink to="/accounts" className="main-nav__cta-link" onClick={onClose}>
            Open Savings Account
          </NavLink>
          <NavLink to="/cards" className="main-nav__cta-link" onClick={onClose}>
            Apply for Credit Card
          </NavLink>
        </div>

        <div className="main-nav__help">
          <h3 className="main-nav__help-heading">Help</h3>

          <div className="main-nav__help-block">
            <p className="main-nav__help-label">Banking segments</p>
            <nav className="main-nav__help-links" aria-label="Banking segments">
              {TOP_RIBBON_LEFT.map(({ label, to }) => (
                <Link key={to} to={to} className="main-nav__help-link" onClick={onClose}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="main-nav__help-block">
            <p className="main-nav__help-label">More</p>
            <nav className="main-nav__help-links" aria-label="More from HDFC">
              {TOP_RIBBON_RIGHT.map(({ label, to }) => (
                <Link key={to} to={to} className="main-nav__help-link" onClick={onClose}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="main-nav__help-block">
            <p className="main-nav__help-label">Contact</p>
            <p className="main-nav__help-phone">
              <a href="tel:18001600" className="main-nav__help-phone-link" onClick={onClose}>
                1800 1600
              </a>
              <span className="main-nav__help-phone-sep"> / </span>
              <a href="tel:18002600" className="main-nav__help-phone-link" onClick={onClose}>
                1800 2600
              </a>
            </p>
          </div>

          <div className="main-nav__help-block">
            <p className="main-nav__help-label">Site links</p>
            <nav className="main-nav__help-links" aria-label="Site links">
              {UTILITY_LINKS.map(({ label, to }) => (
                <Link key={to} to={to} className="main-nav__help-link" onClick={onClose}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </nav>
  )
}
