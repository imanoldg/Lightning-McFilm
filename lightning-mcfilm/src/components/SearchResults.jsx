import React, { useState } from 'react';

const SearchResults = () => {
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
      const res = await fetch(`http://localhost:5000/api/movies/search?s=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.movies || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <section className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
      {/* Barra de búsqueda grande */}
      <form onSubmit={handleSearch} className="relative mb-8">
        <input
          type="text"
          placeholder="Buscar películas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-14 py-5 text-lg rounded-full border-2 border-gray-300 focus:border-mc-orange focus:outline-none shadow-inner"
        />
        <button
          type="submit"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-mc-orange text-2xl"
        >
        </button>
      </form>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="text-gray-700 font-medium">Filtros:</span>
        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="px-4 py-2 rounded-full border border-gray-300">
          <option>Género</option>
          <option>Acción</option>
          <option>Comedia</option>
          <option>Drama</option>
        </select>
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="px-4 py-2 rounded-full border border-gray-300">
          <option>Año</option>
          <option>2024</option>
          <option>2023</option>
          <option>2020-2024</option>
        </select>
        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="px-4 py-2 rounded-full border border-gray-300">
          <option>Valoración</option>
          <option>8.0+</option>
          <option>7.0+</option>
        </select>
      </div>

      {/* Resultados */}
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Resultados</h3>

      {loading ? (
        <p className="text-center text-mc-orange text-xl">Buscando a toda velocidad...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">Escribe algo para buscar películas</p>
      ) : (
        <div className="space-y-6">
          {results.map((movie) => (
            <div key={movie.imdbID} className="flex gap-6 bg-gray-50 rounded-xl p-6 hover:shadow-xl transition cursor-pointer">
              <div className="w-32 h-48 bg-gray-200 border-2 border-dashed rounded-xl flex-shrink-0">
                <img
                  src={movie.Poster || 'https://via.placeholder.com/300x450?text=Poster'}
                  alt={movie.Title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900">{movie.Title || 'Título de la Película'}</h4>
                <p className="text-gray-600 mt-1">
                  {movie.Year} • {movie.Genre || 'Acción, Aventura'} • {movie.Runtime || '2h 15min'}
                </p>
                <p className="text-gray-700 mt-3">
                  {movie.Plot || 'Breve descripción de la película que aparece en los resultados de búsqueda...'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults;