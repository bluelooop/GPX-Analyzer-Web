import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router.tsx';
import 'semantic-ui-css/semantic.min.css';

const appRoot = document.getElementById('app')!;

ReactDOM.createRoot(appRoot).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
