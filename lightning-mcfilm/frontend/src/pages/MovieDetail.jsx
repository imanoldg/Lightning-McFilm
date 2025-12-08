import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useTranslation } from 'react-i18next';

const MovieDetail = () => {
  const { t } = useTranslation();
  const { imdbID } = useParams();
  const { user, toggleFavorite, toggleWatched, toggleWatchlist } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const movieRes = await fetch(`http://localhost:4000/api/movies/detail/${imdbID}`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        if (!user) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const listsRes = await fetch('http://localhost:8000/my-lists', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const lists = await listsRes.json();

        const fav = lists.favorites?.some(m => m.imdbID === imdbID);
        const wat = lists.watched?.some(m => m.imdbID === imdbID);
        const pen = lists.watchlist?.some(m => m.imdbID === imdbID);

        setIsFavorite(fav);
        setIsWatched(wat);
        setIsPending(pen);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [imdbID, user]);

  const handleToggle = async (type) => {
    if (!user) {
      alert('Tienes que estar logueado, ka-chow!');
      return;
    }

    let success = false;
    if (type === 'favorite') success = await toggleFavorite(movie);
    if (type === 'watched') success = await toggleWatched(movie);
    if (type === 'pending') success = await toggleWatchlist(movie);

    if (success) {
      if (type === 'favorite') setIsFavorite(!isFavorite);
      if (type === 'watched') setIsWatched(!isWatched);
      if (type === 'pending') setIsPending(!isPending);
    }
  };

  if (loading) return <div className="text-center py-20 text-4xl">{t('movieDetail.loading')}</div>;
  if (!movie) return <div className="text-center py-20 text-3xl text-red-600">{t('movieDetail.notFound')}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-mc-light-blue to-white">
      <Header />

      <div className="container mx-auto px-6 py-12">
        <Link to="/home" className="inline-block mb-8 text-mc-orange hover:underline text-lg font-bold">
          ← {t('home.title')}
        </Link>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <img src={movie.Poster} alt={movie.Title} className="w-full rounded-2xl shadow-2xl border-8 border-mc-red" />
          </div>

          <div className="md:col-span-2 space-y-8">
            <h1 className="text-6xl font-bold text-mc-red">{movie.Title}</h1>
            <p className="text-2xl text-gray-700">{movie.Year} • {movie.Runtime} • {movie.Genre}</p>

            {movie.imdbRating && (
              <div className="text-5xl font-bold text-mc-orange">
                {movie.imdbRating}<span className="text-3xl text-gray-600">/10</span>
              </div>
            )}

            <div className="flex flex-wrap gap-6">
              <button
                onClick={() => handleToggle('watched')}
                className={`flex items-center gap-3 px-10 py-6 rounded-2xl text-2xl font-bold transition-all shadow-2xl ${
                  isWatched 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-green-700 border-4 border-green-600 hover:bg-green-50'
                }`}
              >
                {isWatched ? t('movieDetail.watchedDone') : t('movieDetail.watched')}
              </button>

              <button
                onClick={() => handleToggle('favorite')}
                className={`flex items-center gap-3 px-10 py-6 rounded-2xl text-2xl font-bold transition-all shadow-2xl ${
                  isFavorite 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-white text-yellow-700 border-4 border-yellow-500 hover:bg-yellow-50'
                }`}
              >
                {isFavorite ? t('movieDetail.favoriteDone') : t('movieDetail.favorite')}
              </button>

              <button
                onClick={() => handleToggle('pending')}
                className={`flex items-center gap-3 px-10 py-6 rounded-2xl text-2xl font-bold transition-all shadow-2xl ${
                  isPending 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-white text-orange-700 border-4 border-orange-600 hover:bg-orange-50'
                }`}
              >
                {isPending ? t('movieDetail.pendingDone') : t('movieDetail.pending')}
              </button>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-mc-dark mb-4">{t('movieDetail.synopsis')}</h2>
              <p className="text-lg bg-white/90 p-8 rounded-2xl shadow-xl leading-relaxed">
                {movie.Plot || t('movieDetail.noSynopsis', { defaultValue: 'Sin sinopsis disponible.' })}
              </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetail;