import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// When a newly deployed service worker takes control, reload once so an
// installed iPhone PWA immediately renders the new bundle. IndexedDB and the
// user's cloud-backed learning records are untouched by this page reload.
if ('serviceWorker' in navigator) {
  const hadControllerAtStartup = Boolean(navigator.serviceWorker.controller);
  let reloadingForUpdate = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadControllerAtStartup || reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
