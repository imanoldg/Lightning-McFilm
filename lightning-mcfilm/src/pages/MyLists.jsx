import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const MyLists = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulamos carga de favoritos del usuario (luego será desde el backend con JWT)
  useEffect(() => {
    // Aquí iría la llamada real: fetch('/api/user/favorites', { headers: { Authorization: token } })
    // Por ahora, cargamos algunas películas de ejemplo (puedes borrar esto cuando tengas backend)
    const mockFavorites = [
      { imdbID: "tt0317219", Title: "Cars", Year: "2006", Poster: "https://m.media-amazon.com/images/M/MV5BMTY2NzYxNTRjM15BMl5BanBnXkFtZTcwMjI0MTA0MQ@@._V1_.jpg", Genre: "Animación, Aventura", Runtime: "117 min" },
      { imdbID: "tt121 NEW6475", Title: "Cars 2", Year: "2011", Poster: "https://m.media-amazon.com/images/M/MV5BMTQzODAyNTM0MF5BMl5BanBnXkFtZTcwODA3NDg1NA@@._V1_.jpg", Genre: "Animación, Acción", Runtime: "106 min" },
      { imdbID: "tt2948372", Title: "Soul", Year: "2020", Poster: "https://m.media-amazon.com/images/M/MV5BZGE1MDg5M2MtNTkyZS00MTQ5LTg4N2ItZTcyNWQ2Y2Q1NmRhXkEyXkFqcGdeQXVyNjI3MjcwMDM@._V1_.jpg", Genre: "Animación, Drama", Runtime: "100 min" },
      { imdbID: "tt1979376", Title: "Toy Story 4", Year: "2019", Poster: "https://m.media-amazon.com/images/M/MV5BMTYzMDM4NzkxOV5BMl5BanBnXkFtZTgwNzM1Mzg2NzM@._V1_.jpg", Genre: "Animación, Comedia", Runtime: "100 min" },
    ];

    setFavorites(mockFavorites);
    setLoading(false);
  }, []);

  const removeFromFavorites = (imdbID) => {
    setFavorites(favorites.filter(m => m.imdbID !== imdbID));
    // Aquí iría: fetch(`/api/user/favorites/${imdbID}`, { method: 'DELETE' })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mc-light-blue via-white to-mc-light-blue">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Título principal */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-mc-red drop-shadow-2xl mb-4">
            Mis Listas
          </h1>
          <p className="text-2xl text-mc-dark">
            Tus películas favoritas en un solo lugar
          </p>
        </div>

        {/* Contador */}
        <div className="text-center mb-10">
          <span className="inline-block bg-mc-orange text-white text-xl font-bold px-8 py-4 rounded-full shadow-xl">
            {favorites.length} película{favorites.length !== 1 ? 's' : ''} en tu lista
          </span>
        </div>

        {/* Lista de películas */}
        {loading ? (
          <p className="text-center text-3xl text-mc-orange animate-pulse">Cargando tus favoritos...</p>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl text-gray-600 mb-6">¡Tu lista está vacía!</p>
            <Link
              to="/search"
              className="inline-block px-10 py-5 bg-mc-red text-white text-xl font-bold rounded-full hover:bg-mc-red/90 transition shadow-xl"
            >
              Buscar películas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {favorites.map((movie) => (
              <div
                key={movie.imdbID}
                className="group relative bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-mc-red hover:border-mc-orange transition transform hover:scale-105"
              >
                <Link to={`/movie/${movie.imdbID}`}>
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-10 group-hover:translate-y-0 transition">
                    <h3 className="text-2xl font-bold mb-2">{movie.Title}</h3>
                    <p className="text-sm opacity-90">{movie.Year} • {movie.Genre}</p>
                  </div>
                </Link>

                {/* Botón eliminar */}
                <button
                  onClick={() => removeFromFavorites(movie.imdbID)}
                  className="absolute top-4 right-4 bg-mc-red text-white p-3 rounded-full shadow-xl hover:bg-red-700 transition transform hover:scale-110"
                  title="Quitar de favoritos"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyLists;