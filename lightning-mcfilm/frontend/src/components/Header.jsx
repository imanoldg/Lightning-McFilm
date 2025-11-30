import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoHeader from '../assets/img/logo-header.png';

const Header = () => {
  const location = useLocation();
  const { user, setUser } = useAuth();

  const isActive = (path) => 
    location.pathname === path ? 'text-mc-orange font-bold' : 'text-white hover:text-mc-orange';

  const handleLogout = () => {
    // 1. Borramos TODO
    localStorage.removeItem('token');
    if (setUser) setUser(null);

    // 2. REDIRECCIÓN FORZADA QUE NUNCA FALLA
    // Forzamos recarga completa + cambio de ruta
    window.location.replace('/login');
    // window.location.replace() = no permite volver atrás con el botón del navegador
  };

  // Si estamos en login o register → NO MOSTRAMOS EL HEADER COMPLETO
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
    return null; // o puedes devolver solo el logo si quieres
  }

  return (
    <header className="bg-mc-red py-6 shadow-2xl fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/home">
          <img src={logoHeader} alt="Lightning McFilm" className="w-24 h-20 object-contain drop-shadow-2xl" />
        </Link>

        <nav className="flex gap-12 items-center text-xl">
          <Link to="/home" className={`${isActive('/home')} transition font-semibold`}>Inicio</Link>
          <Link to="/search" className={`${isActive('/search')} transition font-semibold`}>Buscar</Link>
          <Link to="/my-lists" className={`${isActive('/my-lists')} transition font-semibold`}>Mis Listas</Link>
        </nav>

        {user ? (
          <div className="flex items-center gap-5">
            <span className="text-white font-medium text-lg hidden sm:block">{user.name}</span>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-white text-mc-red text-sm font-bold rounded-lg shadow-md hover:bg-gray-100 transition-all active:scale-95"
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