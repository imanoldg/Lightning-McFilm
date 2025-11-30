import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const Home = () => {
  const [recentMovies, setRecentMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);
  const [errorRecent, setErrorRecent] = useState(null);
  const [errorAll, setErrorAll] = useState(null);

  // Cargar películas recién añadidas
  const loadRecentMovies = async () => {
    try {
      console.log('🎬 Cargando películas recientes...');
      const res = await fetch('http://localhost:4000/api/movies/recent');
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('✅ Películas recientes cargadas:', data);
      setRecentMovies(data.movies || []);
    } catch (err) {
      console.error('❌ Error cargando recientes:', err);
      setErrorRecent(err.message);
    } finally {
      setLoadingRecent(false);
    }
  };

  // Cargar TODAS las películas del caché (MongoDB)
  const loadAllMovies = async () => {
    try {
      console.log('🎬 Cargando todas las películas...');
      const res = await fetch('http://localhost:4000/api/movies/all');
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('✅ Todas las películas cargadas:', data);
      setAllMovies(data.movies || []);
    } catch (err) {
      console.error('❌ Error cargando todas las películas:', err);
      setErrorAll(err.message);
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Componente Home montado');
    loadRecentMovies();
    loadAllMovies();
  }, []);

  // Películas populares fijas (siempre rápidas y bonitas)
  const popularMovies = [
    { Title: "Cars", Year: "2006", imdbID: "tt0317219", Poster: "https://m.media-amazon.com/images/M/MV5BMTY2NzYxNTRjM15BMl5BanBnXkFtZTcwMjI0MTA0MQ@@._V1_.jpg" },
    { Title: "Cars 2", Year: "2011", imdbID: "tt1216475", Poster: "https://m.media-amazon.com/images/M/MV5BMTQzODAyNTM0MF5BMl5BanBnXkFtZTcwODA3NDg1NA@@._V1_.jpg" },
    { Title: "Cars 3", Year: "2017", imdbID: "tt3606752", Poster: "https://m.media-amazon.com/images/M/MV5BMTc0NDM5Nzk3M15BMl5BanBnXkFtZTgwNTk0MzY4MjI@._V1_.jpg" },
    { Title: "Toy Story 4", Year: "2019", imdbID: "tt1979376", Poster: "https://m.media-amazon.com/images/M/MV5BMTYzMDM4NzkxOV5BMl5BanBnXkFtZTgwNzM1Mzg2NzM@._V1_.jpg" },
    { Title: "Soul", Year: "2020", imdbID: "tt2948372", Poster: "https://m.media-amazon.com/images/M/MV5BZGE1MDg5M2MtNTkyZS00MTQ5LTg4N2ItZTcyNWQ2Y2Q1NmRhXkEyXkFqcGdeQXVyNjI3MjcwMDM@._V1_.jpg" },
    { Title: "Inside Out 2", Year: "2024", imdbID: "tt22022452", Poster: "https://m.media-amazon.com/images/M/MV5BYTc3MDc0MjAtMmM1NC00ZGM5LWIxOWEtYjYxZjY2ODI4N2RkXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg" },
  ];

  return (
    <div className="min-h-screen bg-mc-light-blue">
      <Header />

      <main className="container mx-auto px-4 py-12">

        {/* Título principal */}
        <h1 className="text-6xl font-bold text-center text-mc-red mb-16 drop-shadow-2xl">
          Lightning McFilm
        </h1>

        {/* Películas populares */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center text-mc-orange mb-10 drop-shadow-lg">
            Películas populares del momento
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {popularMovies.map((movie) => (
              <div key={movie.imdbID} className="group cursor-pointer transform hover:scale-105 transition duration-300">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-mc-orange">
                  <img src={movie.Poster} alt={movie.Title} className="w-full h-80 object-cover" />
                  <div className="p-3 bg-mc-red text-white text-center font-bold text-sm">
                    {movie.Title} ({movie.Year})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recién añadidas */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center text-mc-red mb-10 drop-shadow-lg">
            Recién añadidas al catálogo
          </h2>
          {loadingRecent ? (
            <p className="text-center text-2xl text-mc-dark">Cargando novedades...</p>
          ) : errorRecent ? (
            <div className="text-center">
              <p className="text-xl text-red-600 mb-4">Error: {errorRecent}</p>
              <button 
                onClick={loadRecentMovies}
                className="px-6 py-3 bg-mc-red text-white rounded-lg hover:bg-mc-red/90"
              >
                Reintentar
              </button>
            </div>
          ) : recentMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {recentMovies.map((movie) => (
                <div key={movie.imdbID} className="group cursor-pointer transform hover:scale-105 transition">
                  <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-mc-red">
                    <img src={movie.Poster || 'https://via.placeholder.com/300x450?text=No+Poster'} alt={movie.Title} className="w-full h-80 object-cover" />
                    <div className="p-3 bg-mc-dark text-white text-center font-bold text-sm">
                      {movie.Title} ({movie.Year})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xl text-mc-gray">Aún no hay películas nuevas</p>
          )}
        </section>

        {/* TODAS LAS PELÍCULAS */}
        <section>
          <h2 className="text-4xl font-bold text-center text-mc-orange mb-10 drop-shadow-lg">
            Todas las películas del catálogo
          </h2>
          {loadingAll ? (
            <p className="text-center text-2xl text-mc-dark">Cargando todo el catálogo...</p>
          ) : errorAll ? (
            <div className="text-center">
              <p className="text-xl text-red-600 mb-4">Error: {errorAll}</p>
              <button 
                onClick={loadAllMovies}
                className="px-6 py-3 bg-mc-red text-white rounded-lg hover:bg-mc-red/90"
              >
                Reintentar
              </button>
            </div>
          ) : allMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {allMovies.map((movie) => (
                <div key={movie.imdbID} className="group cursor-pointer transform hover:scale-105 transition">
                  <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-4 border-mc-gray">
                    <img src={movie.Poster || 'https://via.placeholder.com/300x450?text=No+Poster'} alt={movie.Title} className="w-full h-80 object-cover" />
                    <div className="p-3 bg-mc-red text-white text-center font-bold text-sm">
                      {movie.Title} ({movie.Year})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xl text-mc-gray">El catálogo está vacío por ahora</p>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;