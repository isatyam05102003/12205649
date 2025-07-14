// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LinkProvider } from './LinkContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    <LinkProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LinkProvider>
  </React.StrictMode>
);
