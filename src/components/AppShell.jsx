import { useState, useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'
import { MainNavigation } from './MainNavigation'
import { SiteFooter } from './SiteFooter'
import { ScrollToTop } from './ScrollToTop'

const MQ_NAV = '(max-width: 992px)'

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const lock = () => {
      if (window.matchMedia(MQ_NAV).matches && menuOpen) {
        document.body.classList.add('nav-menu-open')
      } else {
        document.body.classList.remove('nav-menu-open')
      }
    }
    lock()
    window.addEventListener('resize', lock)
    return () => {
      window.removeEventListener('resize', lock)
      document.body.classList.remove('nav-menu-open')
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, closeMenu])

  return (
    <div className="app">
      <ScrollToTop />
      <div className={`app__top${menuOpen ? ' app__top--nav-open' : ''}`}>
        <SiteHeader menuOpen={menuOpen} onToggleMenu={toggleMenu} />
        <MainNavigation menuOpen={menuOpen} onClose={closeMenu} />
      </div>
      {menuOpen && (
        <button
          type="button"
          className="nav-backdrop"
          tabIndex={-1}
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
