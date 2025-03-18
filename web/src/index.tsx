import React from 'react';
import ReactDOM from 'react-dom/client';
import Homepage from './Homepage.tsx';


const appRoot = document.getElementById('app')!;

ReactDOM.createRoot(appRoot).render(
  <React.StrictMode>
    <Homepage />
  </React.StrictMode>,
);