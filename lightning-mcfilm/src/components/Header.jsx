import { Link, useLocation } from 'react-router-dom';
import logoHeader from '../assets/img/logo-header.png';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'text-mc-orange font-bold' : 'text-white hover:text-mc-orange';

  return (
    <header className="bg-mc-red py-4 shadow-xl h-25">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/home" className="text-3xl font-bold text-mc-red drop-shadow-lg">
          <img src={logoHeader} alt="Lightning McFilm Logo" className='w-22 h-20' />
        </Link>

        <nav className="flex gap-10 items-center">
          <Link to="/home" className={`${isActive('/home')} text-xl transition`}>Inicio</Link>
          <Link to="/search" className={`${isActive('/search')} text-xl transition`}>Buscar</Link>
          <Link to="/my-lists" className={`${isActive('/my-lists')} text-xl transition`}>Mis Listas</Link>
        </nav>

        <div className="w-12 h-12 bg-mc-orange rounded-full flex items-center justify-center text-mc-dark font-bold text-xl">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;