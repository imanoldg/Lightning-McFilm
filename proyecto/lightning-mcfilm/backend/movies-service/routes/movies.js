import express from 'express';
import axios from 'axios';
import Movie from '../models/Movie.js';

const router = express.Router();
const OMDB_URL = 'https://www.omdbapi.com/';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Póster por defecto
const DEFAULT_POSTER = 'https://m.media-amazon.com/images/M/MV5BNGQyNjEzNzEtN2U0Yi00ZmI2LTlmMzYtYzEwMzU0M2UyNTVjXkEyXkFqcGdeQXVyNTk5NTQzNDI@._V1_.jpg';

router.get('/search', async (req, res) => {
  const { s, page = 1 } = req.query;

  if (!s) return res.status(400).json({ error: 'Parámetro "s" es obligatorio' });

  try {
    console.log(`🔍 Búsqueda: "${s}"`);
    
    // 1. Buscar en caché primero
    const cachedMovies = await Movie.find({
      Title: { $regex: s, $options: 'i' }
    }).limit(20);

    if (cachedMovies.length >= 5) {
      console.log(`✅ Devolviendo ${cachedMovies.length} películas desde caché`);
      return res.json({
        movies: cachedMovies,
        source: 'cache',
        totalResults: cachedMovies.length
      });
    }

    // 2. Si no hay suficientes en caché, buscar en OMDB
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
      console.error('❌ Falta OMDB_API_KEY');
      return res.status(500).json({ error: 'Falta API key' });
    }

    const searchUrl = `${OMDB_URL}?apikey=${apiKey}&s=${encodeURIComponent(s)}&page=${page}`;
    console.log('📡 Consultando OMDB:', searchUrl);

    const response = await axios.get(searchUrl, { timeout: 5000 });
    
    if (response.data.Response === 'False') {
      console.log('⚠️ OMDB no encontró resultados:', response.data.Error);
      return res.status(404).json({ error: response.data.Error });
    }

    const movies = response.data.Search || [];
    console.log(`📦 OMDB devolvió ${movies.length} películas`);
    
    const enrichedMovies = [];

    // 3. Procesar solo las primeras 5 películas para evitar timeouts
    for (const m of movies.slice(0, 5)) {
      try {
        // Buscar en caché primero
        let movie = await Movie.findOne({ imdbID: m.imdbID });

        if (!movie) {
          console.log(`⏳ Obteniendo detalles de: ${m.Title}`);
          await delay(1100); // Rate limit OMDB

          const detailUrl = `${OMDB_URL}?apikey=${apiKey}&i=${m.imdbID}&plot=short`;
          const detailRes = await axios.get(detailUrl, { timeout: 5000 });

          if (detailRes.data.Response === 'True') {
            const full = detailRes.data;
            const finalPoster = (full.Poster && full.Poster !== 'N/A') ? full.Poster : DEFAULT_POSTER;
            
            movie = { ...full, Poster: finalPoster };

            // Guardar en caché
            await Movie.updateOne(
              { imdbID: movie.imdbID },
              { $set: { ...movie, cachedAt: new Date() } },
              { upsert: true }
            );
            console.log(`✅ Guardada en caché: ${movie.Title}`);
          } else {
            movie = { ...m, Poster: DEFAULT_POSTER };
            await Movie.updateOne(
              { imdbID: m.imdbID },
              { $set: { ...movie, cachedAt: new Date() } },
              { upsert: true }
            );
          }
        } else {
          console.log(`✅ Desde caché: ${movie.Title}`);
        }

        enrichedMovies.push(movie);
      } catch (err) {
        console.error(`❌ Error con ${m.imdbID}:`, err.message);
        enrichedMovies.push({ ...m, Poster: DEFAULT_POSTER });
      }
    }

    console.log(`✅ Devolviendo ${enrichedMovies.length} películas enriquecidas`);
    
    res.json({
      movies: enrichedMovies,
      source: cachedMovies.length > 0 ? 'mixed' : 'api',
      totalResults: response.data.totalResults || enrichedMovies.length
    });

  } catch (error) {
    console.error('❌ Error en /search:', error.message);
    if (error.code === 'ECONNABORTED') {
      res.status(504).json({ 
        error: 'Timeout al consultar OMDB', 
        details: 'La API tardó demasiado en responder' 
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor', 
        details: error.message 
      });
    }
  }
});

// ==================== DETALLE POR imdbID ====================
router.get('/detail/:imdbID', async (req, res) => {
  const { imdbID } = req.params;

  try {
    // 1. Primero buscamos en MongoDB (caché)
    let movie = await Movie.findOne({ imdbID });

    // Si está en caché → devolvemos directamente
    if (movie) {
      console.log(`Detalle desde caché: ${movie.Title}`);
      return res.json(movie);
    }

    // 2. Si no está, la buscamos en OMDB y la guardamos
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Falta OMDB API key' });

    await delay(1100); // rate limit
    const detailUrl = `${OMDB_URL}?apikey=${apiKey}&i=${imdbID}&plot=short`;
    const response = await axios.get(detailUrl);

    if (response.data.Response === 'False') {
      return res.status(404).json({ error: 'Película no encontrada en OMDB' });
    }

    const fullMovie = response.data;
    const finalPoster = (fullMovie.Poster && fullMovie.Poster !== 'N/A') 
      ? fullMovie.Poster 
      : DEFAULT_POSTER;

    const movieToSave = { ...fullMovie, Poster: finalPoster };

    // Guardamos en caché
    await Movie.updateOne(
      { imdbID },
      { $set: { ...movieToSave, cachedAt: new Date() } },
      { upsert: true }
    );

    console.log(`Detalle desde OMDB + guardado: ${movieToSave.Title}`);
    res.json(movieToSave);

  } catch (error) {
    console.error('Error en /detail/:imdbID:', error.message);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ========================
// ENDPOINTS DE CATÁLOGO
// ========================
router.get('/recent', async (req, res) => {
  try {
    console.log('📋 Obteniendo películas recientes');
    const recent = await Movie.find()
      .sort({ cachedAt: -1 })
      .limit(12)
      .select('Title Year Poster imdbID');
    res.json({ movies: recent });
  } catch (err) {
    console.error('❌ Error en /recent:', err);
    res.status(500).json({ error: 'Error en /recent' });
  }
});

router.get('/all', async (req, res) => {
  try {
    console.log('📋 Obteniendo todas las películas');
    const movies = await Movie.find()
      .sort({ Title: 1 })
      .select('Title Year Poster imdbID');
    res.json({ movies });
  } catch (err) {
    console.error('❌ Error en /all:', err);
    res.status(500).json({ error: 'Error en /all' });
  }
});

export default router;