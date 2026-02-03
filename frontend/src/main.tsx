import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AbonoPage from './AbonoPagina.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AbonoPage />
  </StrictMode>,
)
