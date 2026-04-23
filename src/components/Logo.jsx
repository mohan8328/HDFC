import { Link } from 'react-router-dom'
import logoImg from '../assets/hdfc-bank-logo.png'

export function Logo() {
  return (
    <Link to="/" className="logo-mark" aria-label="HDFC Bank — Home">
      <img
        src={logoImg}
        alt=""
        className="logo-img"
        width={200}
        height={64}
        decoding="async"
      />
    </Link>
  )
}
