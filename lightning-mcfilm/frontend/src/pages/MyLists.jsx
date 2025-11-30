import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const MyLists = () => {
  const [lists, setLists] = useState({
    favorites: [],
    watched: [],
    pending: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:4000/my-lists', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setLists({
            favorites: data.favorites || [],
            watched: data.watched || [],
            pending: data.watchlist || []
          });
        } else {
          console.error('Error al cargar listas:', res.status);
        }
      } catch (err) {
        console.error('Error de red:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const removeFromList = (imdbID, listType) => {
    setLists(prev => ({
      ...prev,
      [listType]: prev[listType].filter(m => m.imdbID !== imdbID)
    }));
  };

  const renderSection = (title, key, countColor) => (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="mb-6">
        <span className={`inline-block px-5 py-2 rounded-full text-white font-bold text-lg ${countColor}`}>
          {lists[key].length} película{lists[key].length !== 1 ? 's' : ''}
        </span>
      </div>

      {lists[key].length === 0 ? (
        <p className="text-gray-500 italic text-lg">Aún no has añadido nada aquí</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {lists[key].map(movie => (
            <div key={movie.imdbID} className="group relative">
              <Link to={`/movie/${movie.imdbID}`}>
                <div className="aspect-w-2 aspect-h-3 bg-gray-200 border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
                  <img
                    src={movie.poster || movie.Poster || 'https://via.placeholder.com/300x450?text=Sin+Póster'}
                    alt={movie.title || movie.Title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <button
                onClick={() => removeFromList(movie.imdbID, key)}
                className="absolute top-2 right-2 bg-white text-mc-red rounded-full w-9 h-9 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition text-xl font-bold hover:bg-gray-100"
                title="Quitar de la lista"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-mc-light-blue flex items-center justify-center">
        <p className="text-4xl font-bold text-mc-red animate-pulse">Cargando tus listas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mc-light-blue">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-center text-mc-red mb-12 drop-shadow-lg">
          Mis Listas de Películas
        </h1>

        {/* Favoritas */}
        {renderSection('Favoritas', 'favorites', 'bg-mc-red')}

        {/* Vistas */}
        {renderSection('Vistas', 'watched', 'bg-mc-orange')}

        {/* Pendientes */}
        {renderSection('Pendientes', 'pending', 'bg-gray-700')}

        {/* Botón crear nueva lista */}
        <div className="text-center mt-20">
          <button className="inline-flex items-center gap-3 px-10 py-5 bg-white text-mc-red font-bold text-2xl rounded-full shadow-2xl hover:shadow-red-600/50 hover:bg-gray-50 transition transform hover:scale-105">
            + Crear Nueva Lista
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyLists;