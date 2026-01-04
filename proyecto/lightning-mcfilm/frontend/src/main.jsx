import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './i18n';
import './styles/App.css';

// Renderizamos primero
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// REGISTRO DEL SERVICE WORKER – VERSIÓN NUCLEAR QUE NUNCA FALLA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('¡PWA SERVICE WORKER REGISTRADO CON ÉXITO – KA-CHOW!', registration);
      })
      .catch(error => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}