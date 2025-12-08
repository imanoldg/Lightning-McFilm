import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SearchResults = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [genreFilter, setGenreFilter] = useState('Todos');
  const [yearFilter, setYearFilter] = useState('Todos');
  const [ratingFilter, setRatingFilter] = useState('Todos');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/movies/search?s=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.movies || []);
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <section className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
      <form onSubmit={handleSearch} className="relative mb-10">
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-mc-orange text-2xl">
          🔍
        </div>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-16 pr-6 py-5 text-lg rounded-full border-2 border-gray-300 focus:border-mc-orange focus:outline-none shadow-lg transition"
        />
      </form>

      <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-700">
        <span className="font-semibold">{t('search.filters.title')}</span>
        
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="px-5 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:border-mc-orange"
        >
          <option>{t('search.filters.genre')}</option>
          <option>Acción</option>
          <option>Aventura</option>
          <option>Comedia</option>
          <option>Drama</option>
          <option>Terror</option>
          <option>Animación</option>
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-5 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:border-mc-orange"
        >
          <option>{t('search.filters.year')}</option>
          <option>2024</option>
          <option>2023</option>
          <option>2020-2024</option>
          <option>2010-2019</option>
          <option>Anterior a 2010</option>
        </select>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-5 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:border-mc-orange"
        >
          <option>{t('search.filters.rating')}</option>
          <option>8.0 o más</option>
          <option>7.0 o más</option>
          <option>6.0 o más</option>
        </select>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-mc-red pb-2 inline-block">
        {t('search.results.title')}
      </h3>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-2xl text-mc-orange font-bold animate-pulse">
            {t('search.results.searching')}
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">
            {query ? t('search.results.noResultsFound') : t('search.results.startTyping')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((movie) => (
            <Link
              key={movie.imdbID}
              to={`/movie/${movie.imdbID}`}
              className="block hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex gap-8 bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-mc-orange transition">
                <div className="w-40 h-60 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border-4 border-white">
                  <img
                    src={movie.Poster || 'https://m.media-amazon.com/images/M/MV5BNGQyNjEzNzEtN2U0Yi00ZmI2LTlmMzYtYzEwMzU0M2UyNTVjXkEyXkFqcGdeQXVyNTk5NTQzNDI@._V1_.jpg'}
                    alt={movie.Title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-mc-dark mb-2">
                    {movie.Title || 'Título desconocido'}
                  </h4>
                  <p className="text-lg text-gray-600 mb-3">
                    {movie.Year || 'Año'} • {movie.Genre || 'Género'} • {movie.Runtime || 'Duración'}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {movie.Plot || 'Breve descripción de la película que aparece en los resultados de búsqueda...'}
                  </p>
                  {movie.imdbRating && (
                    <div className="mt-4 inline-block bg-mc-orange text-white px-4 py-2 rounded-full font-bold">
                      IMDb: {movie.imdbRating}/10
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults;