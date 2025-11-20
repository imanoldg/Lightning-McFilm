import express from 'express';
import axios from 'axios';
import Movie from '../models/Movie.js';

const router = express.Router();
const OMDB_URL = 'https://www.omdbapi.com/';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Póster por defecto (el de Cars, queda precioso en Lightning McFilm)
const DEFAULT_POSTER = 'https://m.media-amazon.com/images/M/MV5BNGQyNjEzNzEtN2U0Yi00ZmI2LTlmMzYtYzEwMzU0M2UyNTVjXkEyXkFqcGdeQXVyNTk5NTQzNDI@._V1_.jpg';

router.get('/search', async (req, res) => {
  const { s, page = 1 } = req.query;

  if (!s) return res.status(400).json({ error: 'Parámetro "s" es obligatorio' });

  try {
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

    const apiKey = process.env.OMDB_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Falta API key' });

    const searchUrl = `${OMDB_URL}?apikey=${apiKey}&s=${encodeURIComponent(s)}&page=${page}`;
    console.log('Buscando:', searchUrl);

    const response = await axios.get(searchUrl);
    if (response.data.Response === 'False') {
      return res.status(404).json({ error: response.data.Error });
    }

    const movies = response.data.Search || [];
    const enrichedMovies = [];

    for (const m of movies.slice(0, 10)) {
      try {
        let movie = await Movie.findOne({ imdbID: m.imdbID });

        if (!movie) {
          await delay(1100);

          const detailUrl = `${OMDB_URL}?apikey=${apiKey}&i=${m.imdbID}&plot=short`;
          const detailRes = await axios.get(detailUrl);

          if (detailRes.data.Response === 'True') {
            const full = detailRes.data;

            // Siempre guardamos, pero con póster por defecto si no tiene
            const finalPoster = (full.Poster && full.Poster !== 'N/A') ? full.Poster : DEFAULT_POSTER;

            movie = { ...full, Poster: finalPoster };

            await Movie.updateOne(
              { imdbID: movie.imdbID },
              { $set: { ...movie, cachedAt: new Date() } },
              { upsert: true }
            );
          } else {
            movie = { ...m, Poster: DEFAULT_POSTER };
            await Movie.updateOne(
              { imdbID: m.imdbID },
              { $set: { ...movie, cachedAt: new Date() } },
              { upsert: true }
            );
          }
        }

        enrichedMovies.push(movie);
      } catch (err) {
        console.error(`Error con ${m.imdbID}:`, err.message);
        enrichedMovies.push({ ...m, Poster: DEFAULT_POSTER });
      }
    }

    res.json({
      movies: enrichedMovies,
      source: cachedMovies.length > 0 ? 'mixed' : 'api',
      totalResults: response.data.totalResults || enrichedMovies.length
    });

  } catch (error) {
    console.error('Error en /search:', error.message);
    res.status(500).json({ error: 'Error del servidor', details: error.message });
  }
});

// ========================
// ENDPOINTS DE CATÁLOGO
// ========================
router.get('/recent', async (req, res) => {
  try {
    const recent = await Movie.find()
      .sort({ cachedAt: -1 })
      .limit(12)
      .select('Title Year Poster imdbID');
    res.json({ movies: recent });
  } catch (err) {
    res.status(500).json({ error: 'Error en /recent' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const movies = await Movie.find()
      .sort({ Title: 1 })
      .select('Title Year Poster imdbID');
    res.json({ movies });
  } catch (err) {
    res.status(500).json({ error: 'Error en /all' });
  }
});

export default router;