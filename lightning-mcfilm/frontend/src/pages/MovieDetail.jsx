import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const MovieDetail = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/movies/search?s=${imdbID}`)
      .then(r => r.json())
      .then(data => {
        const found = data.movies.find(m => m.imdbID === imdbID);
        setMovie(found || data.movies[0]);
        setLoading(false);
      });
  }, [imdbID]);

  if (loading) return <div className="text-center py-20 text-3xl">Cargando...</div>;

  if (!movie) return <div className="text-center py-20 text-2xl text-red-500">Película no encontrada</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-mc-light-blue to-white">
      <Header />

      <div className="container mx-auto px-6 py-12">
        <Link to="/search" className="inline-block mb-8 text-mc-orange hover:underline text-lg">
          ← Volver a búsqueda
        </Link>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Póster grande */}
          <div className="md:col-span-1">
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full rounded-2xl shadow-2xl border-8 border-mc-red"
            />
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-5xl font-bold text-mc-red mb-4">{movie.Title}</h1>
            <p className="text-2xl text-gray-700 mb-6">
              {movie.Year} • {movie.Runtime} • {movie.Genre}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-bold text-mc-orange">{movie.imdbRating || 'N/A'}</span>
              <span className="text-gray-600">/10</span>
              <button className="ml-8 px-8 py-4 bg-mc-red text-white rounded-full font-bold hover:bg-mc-red/90 transition">
                + Añadir a Mis Listas
              </button>
            </div>

            <h2 className="text-3xl font-bold text-mc-dark mb-4">Sinopsis</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {movie.Plot || 'No hay sinopsis disponible.'}
            </p>

            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <strong>Director:</strong> {movie.Director || 'Desconocido'}
              </div>
              <div>
                <strong>Reparto:</strong> {movie.Actors || 'Desconocido'}
              </div>
              <div>
                <strong>País:</strong> {movie.Country || 'Desconocido'}
              </div>
              <div>
                <strong>Idioma:</strong> {movie.Language || 'Desconocido'}
              </div>
            </div>

            {movie.Ratings && (
              <div className="mt-10">
                <h3 className="text-2xl font-bold mb-4">Valoraciones</h3>
                {movie.Ratings.map(r => (
                  <div key={r.Source} className="bg-gray-100 p-4 rounded-lg mb-3">
                    <strong>{r.Source}:</strong> {r.Value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetail;