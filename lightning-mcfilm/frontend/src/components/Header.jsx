import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoHeader from '../assets/img/logo-header.png';

const Header = () => {
  const location = useLocation();
  const { user, setUser } = useAuth();

  const isActive = (path) =>
    location.pathname === path ? 'text-mc-orange font-bold' : 'text-white hover:text-mc-orange';

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setUser) setUser(null);
    window.location.replace('/login');
  };

  if (['/login', '/register', '/'].includes(location.pathname)) {
    return null;
  }

  return (
    <header className="bg-mc-red py-4 shadow-2xl fixed top-0 left-0 right-0 z-50">
      {/* Altura total ≈ 90-95px (antes eran 130px+) */}
      <div className="container mx-auto px-6 flex justify-between items-center">

        {/* LOGO MANTIENE SU TAMAÑO ORIGINAL – ÉPICO */}
        <Link to="/home">
          <img 
            src={logoHeader} 
            alt="Lightning McFilm" 
            className="w-24 h-20 object-contain drop-shadow-2xl" 
          />
        </Link>

        {/* NAVEGACIÓN */}
        <nav className="flex gap-10 items-center text-lg font-semibold">
          <Link to="/home" className={`${isActive('/home')} transition`}>Inicio</Link>
          <Link to="/search" className={`${isActive('/search')} transition`}>Buscar</Link>
          <Link to="/my-lists" className={`${isActive('/my-lists')} transition`}>Mis Listas</Link>
        </nav>

        {/* USUARIO + SALIR */}
        {user ? (
          <div className="flex items-center gap-5">
            <Link 
              to="/profile" 
              className="text-white hover:text-mc-orange font-medium hidden sm:block"
            >
              {user.name}
            </Link>

            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-white text-mc-red text-sm font-bold rounded-lg shadow-md hover:bg-gray-100 transition active:scale-95"
            >
              Salir
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