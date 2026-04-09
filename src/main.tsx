import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Toaster } from 'react-hot-toast';
import { initGA } from './services/analytics';

document.body.classList.add('app-booted');
initGA();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <App />
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </>
  </StrictMode>,
);