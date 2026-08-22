import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Disparition de l'écran de chargement initial
const loader = document.getElementById('initial-loader');
if (loader) {
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 500); // Supprime l'élément du DOM après l'animation de fondu
}