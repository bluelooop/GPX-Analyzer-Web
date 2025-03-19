import React from 'react';
import ReactDOM from 'react-dom/client';
import Homepage from './pages/Homepage/Homepage.tsx';
import 'semantic-ui-css/semantic.min.css';

const appRoot = document.getElementById('app')!;

ReactDOM.createRoot(appRoot).render(
  <React.StrictMode>
    <Homepage />
  </React.StrictMode>,
);