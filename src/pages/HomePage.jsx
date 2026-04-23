import { HomeAccountSummary } from '../components/HomeAccountSummary'
import { HomeLoanOffers } from '../components/HomeLoanOffers'

export function HomePage() {
  return (
    <div className="page-home">
      <HomeAccountSummary />
      <HomeLoanOffers />
    </div>
  )
}
