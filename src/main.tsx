import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast';

document.body.classList.add('app-booted');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <App />
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </>
  </StrictMode>,
)
