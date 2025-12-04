import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
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

// TRUCO FINAL: Forzamos el beforeinstallprompt para que aparezca el botón
// TRUCO FINAL: Botón de instalación DISCRETO pero BRUTAL
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('EVENTO beforeinstallprompt DISPARADO – YA ES INSTALABLE!');
  e.preventDefault();
  deferredPrompt = e;

  // BOTÓN DISCRETO (pequeño, redondo, con rayo)
  const btn = document.createElement('button');
  btn.innerHTML = `Instalar`; // Texto pequeño
  btn.title = "Instalar Lightning McFilm en tu dispositivo";
  btn.style.position = 'fixed';
  btn.style.bottom = '20px';
  btn.style.right = '20px';
  btn.style.zIndex = '9999';
  btn.style.width = '56px';
  btn.style.height = '56px';
  btn.style.background = '#FF0000';
  btn.style.color = 'white';
  btn.style.border = '3px solid white';
  btn.style.borderRadius = '50%';
  btn.style.fontSize = '24px';
  btn.style.fontWeight = 'bold';
  btn.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
  btn.style.cursor = 'pointer';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.transition = 'all 0.3s ease';
  
  // Hover sutil
  btn.onmouseover = () => {
    btn.style.transform = 'scale(1.1)';
    btn.style.background = '#CC0000';
  };
  btn.onmouseout = () => {
    btn.style.transform = 'scale(1)';
    btn.style.background = '#FF0000';
  };

  btn.onclick = () => {
    btn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
    });
  };

  document.body.appendChild(btn);
});