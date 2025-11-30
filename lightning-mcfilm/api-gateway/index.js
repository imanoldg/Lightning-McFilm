const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = 4000;

// Middlewares globales
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
    checks.movieService = '❌ OFFLINE';
  }
  
  try {
    await axios.get('http://localhost:8000/', { timeout: 2000 });
    checks.userService = '✅ ONLINE';
  } catch (err) {
    checks.userService = '❌ OFFLINE';
  }
  
  res.json({
    gateway: '✅ FUNCIONANDO (PROXY MANUAL)',
    time: new Date().toISOString(),
    services: checks
  });
});

// === PELÍCULAS - PROXY MANUAL ===
// Captura cualquier ruta que empiece con /api/movies
app.use('/api/movies', async (req, res) => {
  const path = req.url; // /search?s=cars
  const targetUrl = `http://localhost:5000/api/movies${path}`;
  
  console.log('🎬 [IN]  Gateway recibe:', req.method, req.originalUrl);
  console.log('🎬 [OUT] Enviando a:', targetUrl);
  
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json'
      },
      timeout: 30000
    });
    
    console.log('🎬 [RES] Status:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('❌ [MOVIES] Error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(504).json({ 
        error: 'Movie Service no responde',
        details: error.message 
      });
    }
  }
});

// === AUTH - PROXY MANUAL ===
app.use('/api/auth', async (req, res) => {
  const path = req.url; // /register o /login
  const targetUrl = `http://localhost:8000${path}`;
  
  console.log('🔐 [IN]  Gateway recibe:', req.method, req.originalUrl);
  console.log('🔐 [BODY]', JSON.stringify(req.body));
  console.log('🔐 [OUT] Enviando a:', targetUrl);
  
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('🔐 [RES] Status:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('❌ [AUTH] Error:', error.message);
    if (error.response) {
      console.error('❌ [AUTH] Response status:', error.response.status);
      console.error('❌ [AUTH] Response data:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(504).json({ 
        error: 'User Service no responde',
        details: error.message 
      });
    }
  }
});

// === FAVORITOS - PROXY MANUAL ===
app.use('/api/favorites', async (req, res) => {
  const path = req.url; // puede ser vacío o con subrutas
  const targetUrl = `http://localhost:8000/favorites${path}`;
  
  console.log('⭐ [IN]  Gateway recibe:', req.method, req.originalUrl);
  console.log('⭐ [OUT] Enviando a:', targetUrl);
  
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('⭐ [RES] Status:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('❌ [FAVORITES] Error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(504).json({ 
        error: 'User Service no responde',
        details: error.message 
      });
    }
  }
});

// === 404 Handler ===
app.use((req, res) => {
  console.log('❌ 404 - Ruta no encontrada:', req.method, req.url);
  res.status(404).json({ 
    error: 'Ruta no encontrada', 
    url: req.url,
    hint: 'Rutas disponibles: /api/health, /api/movies/*, /api/auth/*, /api/favorites/*'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 GATEWAY CORRIENDO EN http://localhost:${PORT}`);
  console.log('✅ Usando PROXY MANUAL (más confiable que http-proxy-middleware)\n');
  console.log('📋 Endpoints disponibles:');
  console.log('  ✅ http://localhost:4000/api/health');
  console.log('  🎬 http://localhost:4000/api/movies/search?s=cars');
  console.log('  🔐 http://localhost:4000/api/auth/register');
  console.log('  🔐 http://localhost:4000/api/auth/login');
  console.log('  ⭐ http://localhost:4000/api/favorites\n');
});