const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

// Middlewares globales
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// ====================
// SWAGGER
// ====================
try {
  const swaggerPath = path.join(__dirname, 'swagger', 'swagger.yaml');
  const fileContents = fs.readFileSync(swaggerPath, 'utf8');
  const swaggerDocument = yaml.load(fileContents);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/swagger.yaml', (req, res) => res.sendFile(swaggerPath));

  console.log('Swagger montado → http://localhost:4000/docs');
} catch (e) {
  console.error('Error cargando Swagger:', e.message);
}

// ====================
// HEALTH CHECK
// ====================
app.get('/api/health', async (req, res) => {
  const checks = {};
  
  try {
    await axios.get('http://localhost:5000/', { timeout: 2000 });
    checks.movieService = 'ONLINE';
  } catch {
    checks.movieService = 'OFFLINE';
  }
  
  try {
    await axios.get('http://localhost:8000/', { timeout: 2000 });
    checks.userService = 'ONLINE';
  } catch {
    checks.userService = 'OFFLINE';
  }
  
  res.json({
    gateway: 'FUNCIONANDO - KA-CHOW!',
    time: new Date().toISOString(),
    services: checks
  });
});

// ====================
// MOVIE SERVICE - PROXY MANUAL
// ====================
app.use('/api/movies', async (req, res) => {
  const targetUrl = `http://localhost:5000${req.originalUrl}`;
  
  console.log('[IN]  Movies →', req.method, req.originalUrl);
  console.log('[OUT] →', targetUrl);

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(504).json({ error: 'Movie Service no responde' });
    }
  }
});

// ====================
// AUTH SERVICE - PROXY COMPLETO (login, logout, listas, etc.)
// ====================
app.use([
  '/api/auth',
  '/logout',
  '/favorites',
  '/watched',
  '/watchlist',
  '/my-lists'
], async (req, res) => {
  // Reconstruye la ruta real sin el prefijo que usamos para capturar
  let cleanPath = req.originalUrl;

  if (req.originalUrl.startsWith('/api/auth')) {
    cleanPath = req.originalUrl.replace('/api/auth', '');
  } else if (['/logout', '/favorites', '/watched', '/watchlist', '/my-lists'].some(p => req.originalUrl.startsWith(p))) {
    cleanPath = req.originalUrl;
  }

  const targetUrl = `http://localhost:8000${cleanPath || '/'}`;

  console.log('AUTH [IN]  →', req.method, req.originalUrl);
  console.log('AUTH [OUT] →', targetUrl);
  if (req.headers.authorization) {
    console.log('TOKEN ENVIADO →', req.headers.authorization.substring(0, 30) + '...');
  }

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        // ESTO ES CLAVE: REENVIAR EL TOKEN
        'Authorization': req.headers.authorization || ''
      },
      timeout: 30000
    });

    console.log('AUTH [RES] Status:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('AUTH ERROR:', error.message);
    if (error.response) {
      console.error('AUTH RESPONSE:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(504).json({ error: 'User Service no responde' });
    }
  }
});

// ====================
// 404
// ====================
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    disponible: ['/api/health', '/api/movies/*', '/api/auth/*', '/logout', '/my-lists']
  });
});

// ====================
// ARRANQUE
// ====================
app.listen(PORT, () => {
  console.log(`\n LIGHTNING MCFILM GATEWAY CORRIENDO EN http://localhost:${PORT}`);
  console.log(` Swagger → http://localhost:4000/docs`);
  console.log(` Logout → POST http://localhost:4000/logout`);
  console.log(` Mis listas → GET http://localhost:4000/my-lists\n`);
});