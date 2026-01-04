import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { useTranslation } from 'react-i18next';
import { translateText } from '../utils/translate'; // ← AÑADE ESTO

const MovieDetail = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { imdbID } = useParams();
  const { user, toggleFavorite, toggleWatched, toggleWatchlist } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [translatedMovie, setTranslatedMovie] = useState(null);
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

        // Traducir título y sinopsis si estamos en español
        if (currentLang === 'es') {
          const translatedTitle = await translateText(movieData.Title, 'es');
          const translatedPlot = await translateText(movieData.Plot, 'es');
          setTranslatedMovie({
            ...movieData,
            Title: translatedTitle,
            Plot: translatedPlot
          });
        } else {
          setTranslatedMovie(movieData);
        }

        if (!user) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const listsRes = await fetch('http://localhost:4000/my-lists', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const lists = await listsRes.json();

        setIsFavorite(lists.favorites?.some(m => m.imdbID === imdbID));
        setIsWatched(lists.watched?.some(m => m.imdbID === imdbID));
        setIsPending(lists.watchlist?.some(m => m.imdbID === imdbID));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [imdbID, user, currentLang]); // ← AÑADIDO currentLang para re-traducir al cambiar idioma

  const handleToggle = async (type) => {
    if (!user) {
      alert(t('movieDetail.loginRequired'));
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
  if (!translatedMovie) return <div className="text-center py-20 text-3xl text-red-600">{t('movieDetail.notFound')}</div>;

  const displayMovie = translatedMovie;

  return (
    <div className="min-h-screen bg-gradient-to-b from-mc-light-blue to-white">
      <Header />

      <div className="container mx-auto px-6 py-12">
        <Link to="/home" className="inline-block mb-8 text-mc-orange hover:underline text-lg font-bold">
          ← {t('movieDetail.backToHome')}
        </Link>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <img 
              src={displayMovie.Poster} 
              alt={displayMovie.Title} 
              className="w-full rounded-2xl shadow-2xl border-8 border-mc-red" 
            />
          </div>

          <div className="md:col-span-2 space-y-8">
            {/* TÍTULO TRADUCIDO */}
            <h1 className="text-6xl font-bold text-mc-red">{displayMovie.Title}</h1>
            <p className="text-2xl text-gray-700">
              {displayMovie.Year} • {displayMovie.Runtime || 'N/A'} • {displayMovie.Genre || 'N/A'}
            </p>

            {displayMovie.imdbRating && (
              <div className="text-5xl font-bold text-mc-orange">
                {displayMovie.imdbRating}<span className="text-3xl text-gray-600">/10</span>
              </div>
            )}

            {/* BOTONES */}
            <div className="flex flex-wrap gap-6">
              <button onClick={() => handleToggle('watched')} className={`...`}>
                {isWatched ? t('movieDetail.watchedDone') : t('movieDetail.watched')}
              </button>
              <button onClick={() => handleToggle('favorite')} className={`...`}>
                {isFavorite ? t('movieDetail.favoriteDone') : t('movieDetail.favorite')}
              </button>
              <button onClick={() => handleToggle('pending')} className={`...`}>
                {isPending ? t('movieDetail.pendingDone') : t('movieDetail.pending')}
              </button>
            </div>

            {/* SINOPSIS TRADUCIDA */}
            <div>
              <h2 className="text-3xl font-bold text-mc-dark mb-4">{t('movieDetail.synopsis')}</h2>
              <p className="text-lg bg-white/90 p-8 rounded-2xl shadow-xl leading-relaxed">
                {displayMovie.Plot || t('movieDetail.noSynopsis')}
              </p>
            </div>

            {/* RESTO DE DETALLES (labels traducidos) */}
            <div className="grid grid-cols-2 gap-8 text-lg bg-white/90 p-8 rounded-2xl shadow-xl">
              <div><strong>{t('movieDetail.director')}:</strong> {displayMovie.Director || t('movieDetail.unknown')}</div>
              <div><strong>{t('movieDetail.cast')}:</strong> {displayMovie.Actors || t('movieDetail.unknown')}</div>
              <div><strong>{t('movieDetail.country')}:</strong> {displayMovie.Country || t('movieDetail.unknown')}</div>
              <div><strong>{t('movieDetail.language')}:</strong> {displayMovie.Language || t('movieDetail.unknown')}</div>
              <div><strong>{t('movieDetail.runtime')}:</strong> {displayMovie.Runtime || 'N/A'}</div>
              <div><strong>{t('movieDetail.genre')}:</strong> {displayMovie.Genre || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MovieDetail;