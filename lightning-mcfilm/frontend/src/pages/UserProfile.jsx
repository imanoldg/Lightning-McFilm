import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState({ favorites: [], watched: [],});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:4000/my-lists', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLists({
            favorites: data.favorites || [],
            watched: data.watched || [],
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-4xl font-bold text-mc-red">Cargando perfil...</p>
      </div>
    );
  }

  const totalMovies = lists.favorites.length + lists.watched.length;
  const totalLists = 2;

  const recentWatched = [...lists.watched].reverse().slice(0, 10);
  const recentFavorites = [...lists.favorites].reverse().slice(0, 10);

  const renderPosters = (movies) => {
    if (movies.length === 0) {
      return <p className="text-gray-500 col-span-full text-center py-12 text-xl">Aún no has añadido películas</p>;
    }

    return movies.map(movie => (
      <Link key={movie.imdbID} to={`/movie/${movie.imdbID}`} className="group block">
        <div className="bg-gray-300 border-2 border-gray-400 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
          <img
            src={movie.poster || movie.Poster || 'https://via.placeholder.com/200x300?text=Póster'}
            alt={movie.title || movie.Title}
            className="w-full h-80 object-cover group-hover:scale-105 transition"
          />
        </div>
      </Link>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {/* CABECERA DEL PERFIL */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-10">
            {/* AVATAR */}
            <div className="w-36 h-36 bg-mc-red rounded-full flex items-center justify-center shadow-2xl border-8 border-white">
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>

            {/* INFO */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-5xl font-bold text-gray-900 mb-3">{user.name}</h1>
              <p className="text-2xl text-gray-600 mb-8">
                @{user.name.toLowerCase().replace(/\s/g, '')} • Miembro desde 2024
              </p>

              {/* ESTADÍSTICAS */}
              <div className="flex justify-center sm:justify-start gap-16">
                <div className="text-center">
                  <p className="text-5xl font-bold text-mc-red">{totalMovies}</p>
                  <p className="text-xl text-gray-700">Películas</p>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-bold text-mc-orange">{totalLists}</p>
                  <p className="text-xl text-gray-700">Listas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PELÍCULAS VISTAS RECIENTEMENTE */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Películas Vistas Recientemente</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {renderPosters(recentWatched)}
          </div>
        </section>

        {/* PELÍCULAS FAVORITAS */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Películas Favoritas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {renderPosters(recentFavorites)}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;