import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { SectionPage } from './pages/SectionPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { SearchPage } from './pages/SearchPage'
import './App.css'

const SECTION_IDS = [
  'accounts',
  'cards',
  'loans',
  'investments',
  'insurance',
  'forex',
  'pay',
  'smartbuy',
  'private-banking',
  'offers',
  'personal',
  'wholesale',
  'nri',
  'agri',
  'sme',
  'startup',
  'csr',
  'ways-to-bank',
  'discover',
  'group',
  'support',
  'about',
  'careers',
  'investors',
  'locate',
  'language',
  'privacy',
  'terms',
  'disclaimer',
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="search" element={<SearchPage />} />
          {SECTION_IDS.map((sectionId) => (
            <Route
              key={sectionId}
              path={sectionId}
              element={<SectionPage sectionId={sectionId} />}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
