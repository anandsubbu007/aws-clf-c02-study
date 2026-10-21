import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import { ProgressProvider } from './lib/progress';
import './styles/app.css';

// HashRouter keeps every route working on GitHub Pages and other static hosts without server rewrites.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </ProgressProvider>
  </StrictMode>,
);
