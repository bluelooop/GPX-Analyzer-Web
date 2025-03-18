import React from 'react';
import ReactDOM from 'react-dom/client';
import Homepage from './pages/Homepage/Homepage.tsx';


const appRoot = document.getElementById('app')!;

ReactDOM.createRoot(appRoot).render(
  <React.StrictMode>
    <Homepage />
  </React.StrictMode>,
);