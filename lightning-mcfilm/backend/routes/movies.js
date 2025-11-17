import express from 'express';
import axios from 'axios';
import Movie from '../models/Movie.js';

const router = express.Router();
const OMDB_URL = 'https://www.omdbapi.com/';

// Delay para respetar el límite de OMDb (1 petición/segundo en plan gratuito)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ========================
// BUSCAR PELÍCULAS
// ========================
router.get('/search', async (req, res) => {
  const { s, page = 1 } = req.query;

  if (!s) {
    return res.status(400).json({ error: 'Parámetro "s" es obligatorio' });
  }

  try {
    // 1. Primero buscar en caché (MongoDB)
    const cachedMovies = await Movie.find({
      Title: { $regex: s, $options: 'i' }
    }).limit(20);

    if (cachedMovies.length >= 5) {
      return res.json({
        movies: cachedMovies,
        source: 'cache',
        totalResults: cachedMovies.length
      });
    }

    // 2. Búsqueda básica en OMDb
    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) {
      console.error('Falta OMDB_API_KEY en .env');
      return res.status(500).json({ error: 'API key no configurada' });
    }

    const searchUrl = `${OMDB_URL}?apikey=${apiKey}&s=${encodeURIComponent(s)}&page=${page}`;
    console.log('Buscando en OMDb:', searchUrl);

    const response = await axios.get(searchUrl);

    if (response.data.Response === 'False') {
      return res.status(404).json({ error: response.data.Error });
    }

    const movies = response.data.Search || [];
    const enrichedMovies = [];

    // 3. Enriquecer con detalles + caché (solo si tiene póster válido)
    for (const m of movies.slice(0, 10)) {
      try {
        let movie = await Movie.findOne({ imdbID: m.imdbID });

        if (!movie) {
          await delay(1100); // Respeta rate limit

          const detailUrl = `${OMDB_URL}?apikey=${apiKey}&i=${m.imdbID}&plot=short`;
          console.log('Detalle:', detailUrl);

          const detailRes = await axios.get(detailUrl);

          if (detailRes.data.Response === 'True') {
            const fullMovie = detailRes.data;

            // SOLO CACHEAR SI TIENE PÓSTER VÁLIDO
            if (fullMovie.Poster && fullMovie.Poster !== 'N/A') {
              movie = fullMovie;

              await Movie.updateOne(
                { imdbID: movie.imdbID },
                { $set: { ...movie, cachedAt: new Date() } },
                { upsert: true }
              );
            } else {
              // Si no tiene póster → no lo guardamos en caché
              console.log(`Saltando ${fullMovie.Title} - sin póster válido`);
              movie = { ...m, Poster: null }; // Marcamos como sin póster
            }
          } else {
            movie = m;
          }
        }

        // Solo añadimos al resultado si tiene póster o es del caché antiguo
        if (movie.Poster && movie.Poster !== 'N/A') {
          enrichedMovies.push(movie);
        } else {
          // Opcional: añadir con fallback (pero no lo cacheamos)
          enrichedMovies.push({ ...movie, Poster: 'https://m.media-amazon.com/images/M/MV5BNGQyNjEzNzEtN2U0Yi00ZmI2LTlmMzYtYzEwMzU0M2UyNTVjXkEyXkFqcGdeQXVyNTk5NTQzNDI@._V1_.jpg' });
        }

      } catch (err) {
        console.error(`Error con ${m.imdbID}:`, err.message);
        enrichedMovies.push(m);
      }
    }

    res.json({
      movies: enrichedMovies,
      source: cachedMovies.length > 0 ? 'mixed' : 'api',
      totalResults: response.data.totalResults || enrichedMovies.length
    });

  } catch (error) {
    console.error('Error crítico en /search:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      details: error.message
    });
  }
});

// ========================
// RECIÉN AÑADIDAS
// ========================
router.get('/recent', async (req, res) => {
  try {
    const recent = await Movie.find()
      .sort({ cachedAt: -1 })
      .limit(12)
      .select('Title Year Poster imdbID');

    res.json({ movies: recent });
  } catch (err) {
    console.error('Error en /recent:', err);
    res.status(500).json({ error: 'Error al cargar recientes' });
  }
});

// ========================
// TODAS LAS PELÍCULAS
// ========================
router.get('/all', async (req, res) => {
  try {
    const movies = await Movie.find()
      .sort({ Title: 1 })
      .select('Title Year Poster imdbID');

    res.json({ movies });
  } catch (err) {
    console.error('Error en /all:', err);
    res.status(500).json({ error: 'Error al cargar catálogo' });
  }
});

export default router;