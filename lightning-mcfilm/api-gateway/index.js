const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = 4000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// === HEALTH CHECK ===
app.get('/api/health', async (req, res) => {
  const checks = {};
  
  try {
    await axios.get('http://localhost:5000/', { timeout: 2000 });
    checks.movieService = '✅ ONLINE';
  } catch (err) {
    checks.movieService = `❌ OFFLINE - ${err.message}`;
  }
  
  try {
    await axios.get('http://localhost:8000/docs', { timeout: 2000 });
    checks.userService = '✅ ONLINE';
  } catch (err) {
    checks.userService = `❌ OFFLINE - ${err.message}`;
  }
  
  res.json({
    gateway: '✅ FUNCIONANDO',
    time: new Date().toISOString(),
    services: checks
  });
});

// === PELÍCULAS - SOLUCIÓN CON CONTEXTO ===
// Simplemente '/api/movies' captura todo lo que empiece con eso
app.use(
  '/api/movies',
  createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    ws: true,
    // La clave: AÑADIR /api/movies al path porque Express ya lo quitó
    pathRewrite: function (path, req) {
      const newPath = '/api/movies' + path; // /search -> /api/movies/search
      console.log('🎬 [REWRITE] Original:', path, '-> Nuevo:', newPath);
      return newPath;
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log('🎬 [IN]  Gateway recibe:', req.method, req.url);
      console.log('🎬 [OUT] Proxy envía a:', proxyReq.path);
      console.log('🎬 [HOST] Target:', proxyReq.getHeader('host'));
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('🎬 [RES] Status del Movie Service:', proxyRes.statusCode);
    },
    onError: (err, req, res) => {
      console.error('❌ [MOVIES] Error en proxy:', err.message);
      console.error('❌ [MOVIES] Stack:', err.stack);
      if (!res.headersSent) {
        res.status(504).json({ 
          error: 'Movie Service no responde', 
          details: err.message 
        });
      }
    }
  })
);

// === AUTH ===
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000,
    pathRewrite: { '^/api/auth': '' }, // /api/auth/register -> /register
    onProxyReq: (proxyReq, req, res) => {
      console.log('🔐 [IN]  Gateway recibe:', req.method, req.url);
      console.log('🔐 [OUT] Proxy envía a:', proxyReq.path);
      
      // Re-enviar el body si existe
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log('🔐 [RES] Status del User Service:', proxyRes.statusCode);
    },
    onError: (err, req, res) => {
      console.error('❌ [AUTH] Error:', err.message);
      if (!res.headersSent) {
        res.status(504).json({ 
          error: 'User Service no responde', 
          details: err.message 
        });
      }
    }
  })
);

// === FAVORITOS ===
app.use(
  '/api/favorites',
  createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    pathRewrite: { '^/api/favorites': '/favorites' },
    onProxyReq: (proxyReq, req, res) => {
      console.log('⭐ [IN]  Gateway recibe:', req.method, req.url);
      console.log('⭐ [OUT] Proxy envía a:', proxyReq.path);
    },
    onError: (err, req, res) => {
      console.error('❌ [FAVORITES] Error:', err.message);
      if (!res.headersSent) {
        res.status(504).json({ 
          error: 'User Service no responde', 
          details: err.message 
        });
      }
    }
  })
);

// === 404 Handler ===
app.use((req, res) => {
  console.log('❌ 404 - Ruta no encontrada:', req.method, req.url);
  res.status(404).json({ 
    error: 'Ruta no encontrada', 
    url: req.url 
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 GATEWAY CORRIENDO EN http://localhost:${PORT}\n`);
  console.log('📋 Prueba estos comandos:\n');
  console.log('PowerShell:');
  console.log('  Invoke-WebRequest "http://localhost:4000/api/movies/search?s=cars" | Select-Object StatusCode,Content\n');
  console.log('CMD/Bash:');
  console.log('  curl "http://localhost:4000/api/movies/search?s=cars"\n');
});