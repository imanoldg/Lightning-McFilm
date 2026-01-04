import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next'; // ← AÑADIDO
import logoHeader from '../assets/img/logo-header.png';

const Header = () => {
  const location = useLocation();
  const { user, setUser } = useAuth();
  const { t, i18n } = useTranslation(); // ← AÑADIDO

  const isActive = (path) =>
    location.pathname === path ? 'text-mc-orange font-bold' : 'text-white hover:text-mc-orange';

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setUser) setUser(null);
    window.location.replace('/login');
  };

  // Cambiar idioma
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  if (['/login', '/register', '/'].includes(location.pathname)) {
    return null;
  }

  return (
    <header className="bg-mc-red py-4 shadow-2xl fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/home">
          <img 
            src={logoHeader} 
            alt="Lightning McFilm" 
            className="w-24 h-20 object-contain drop-shadow-2xl" 
          />
        </Link>

        {/* NAVEGACIÓN TRADUCIDA */}
        <nav className="flex gap-10 items-center text-lg font-semibold">
          <Link to="/home" className={`${isActive('/home')} transition`}>
            {t('header.home')}
          </Link>
          <Link to="/search" className={`${isActive('/search')} transition`}>
            {t('header.search')}
          </Link>
          <Link to="/my-lists" className={`${isActive('/my-lists')} transition`}>
            {t('header.lists')}
          </Link>
        </nav>

        {/* USUARIO + IDIOMA + SALIR */}
        {user ? (
          <div className="flex items-center gap-6">

            {/* NOMBRE */}
            <Link to="/profile" className="text-white hover:text-mc-orange font-medium hidden sm:block">
              {user.name}
            </Link>

            {/* BOTÓN DE IDIOMA DISCRETO Y BRUTAL */}
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={() => changeLanguage('es')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                  i18n.language === 'es' 
                    ? 'bg-white text-mc-red shadow-md' 
                    : 'text-white hover:text-mc-orange'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                  i18n.language === 'en' 
                    ? 'bg-white text-mc-red shadow-md' 
                    : 'text-white hover:text-mc-orange'
                }`}
              >
                EN
              </button>
            </div>

            {/* BOTÓN SALIR TRADUCIDO */}
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-white text-mc-red text-sm font-bold rounded-lg shadow-md hover:bg-gray-100 transition active:scale-95"
            >
              {t('header.logout')}
            </button>
          </div>
        ) : (
          <div className="w-12 h-12 bg-mc-orange rounded-full flex items-center justify-center text-mc-dark font-bold text-xl shadow-lg">
            U
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;