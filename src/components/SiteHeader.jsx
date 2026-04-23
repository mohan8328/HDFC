import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from './Logo'
import { BankBalance } from './BankBalance'

export function SiteHeader({ menuOpen, onToggleMenu }) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const onSearch = (e) => {
    e.preventDefault()
    const q = search.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <header className="site-header">
      <div className="layout-wide site-header__row">
        <div className="site-header__brand">
          <Logo />
          <button
            type="button"
            className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={onToggleMenu}
          >
            <span className="nav-toggle__lines" aria-hidden="true">
              <span className="nav-toggle__bar" />
              <span className="nav-toggle__bar" />
              <span className="nav-toggle__bar" />
            </span>
          </button>
        </div>
        <div className="site-header__actions">
          <form className="search-field" onSubmit={onSearch} role="search">
            <span className="sr-only">Search</span>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>
            <input
              type="search"
              name="q"
              placeholder="How can we help you?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search the site"
            />
          </form>
          <BankBalance />
          <div className="header-buttons">
            <Link to="/transactions" className="btn btn--outline">
              Transactions
            </Link>
            <Link to="/transactions" className="btn btn--primary">
              Statement (PDF)
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
