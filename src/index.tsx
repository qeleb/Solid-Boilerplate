import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from '@/App';

// Enable Mock Server
if (import.meta.env.DEV && new URLSearchParams(location.search).has('mock'))
  (await import('@/services/mock/mockServer')).createMockServer();

ReactDOM.createRoot(document.querySelector('body')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
