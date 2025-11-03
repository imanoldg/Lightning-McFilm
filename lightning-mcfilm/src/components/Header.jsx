import React from 'react';
import "../styles/App.css";
import logoHeader from "../assets/img/logo-header.png";

const Header = () => {
  return (
    <header className="bg-mc-red text-white flex items-center justify-between h-16 px-6 py-3 shadow-md">
      {/* Logo como imagen */}
      <img src={logoHeader} alt="Lightning McFilm" className=" w-22 h-20" /> {/* Ajusta 'h-8' para el tamaño deseado */}

      {/* Navigation Links */}
      <nav className="flex space-x-8">
        <a href="#" className="hover:text-mc-orange transition-colors">Inicio</a>
        <a href="#" className="hover:text-mc-orange transition-colors">Buscar</a>
        <a href="#" className="hover:text-mc-orange transition-colors">Mis Listas</a>
      </nav>

      {/* Profile Icon */}
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
        <div className="w-5 h-5 bg-mc-dark rounded-full"></div> {/* Simple silhouette placeholder */}
      </div>
    </header>
  );
};

export default Header;