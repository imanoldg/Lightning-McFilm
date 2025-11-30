import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider: Inicializando...');
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('✅ Sesión restaurada:', parsedUser);
      } catch (err) {
        console.error('❌ Error parseando usuario:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('ℹ️ No hay sesión guardada');
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔑 Intentando login:', { email });
      
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('📡 Respuesta login:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ Error en login:', errorData);
        throw new Error(errorData.detail || 'Email o contraseña incorrectos');
      }

      const data = await res.json();
      console.log('✅ Login exitoso:', data);

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      return data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('📝 Intentando registro:', { name, email });
      
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      console.log('📡 Respuesta registro:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ Error en registro:', errorData);
        throw new Error(errorData.detail || 'Error al registrarse');
      }

      const data = await res.json();
      console.log('✅ Registro exitoso:', data);

      // Login automático tras registro
      console.log('🔄 Haciendo login automático...');
      await login(email, password);
      
      return data;
    } catch (error) {
      console.error('❌ Error en register:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('👋 Cerrando sesión...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  
const toggleFavorite = async (movie) => {
  const token = localStorage.getItem('token');
  console.log('TOKEN que envío:', token); // ← AÑADE ESTO

  if (!token) {
    alert('No hay token, inicia sesión');
    return false;
  }

  const res = await fetch('http://localhost:8000/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      imdbID: movie.imdbID || movie.imdbID,
      title: movie.Title || movie.title,
      year: movie.Year || movie.year,
      poster: movie.Poster || movie.poster
    })
  });

  console.log('Respuesta del backend:', res.status); // ← AÑADE ESTO
  return res.ok;
};

const toggleWatched = async (movie) => {
  const token = localStorage.getItem('token');
  console.log('TOKEN watched:', token);

  if (!token) return false;

  const res = await fetch('http://localhost:8000/watched', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster
    })
  });

  console.log('Watched status:', res.status);
  return res.ok;
};

const toggleWatchlist = async (movie) => {
  const token = localStorage.getItem('token');
  console.log('TOKEN watchlist:', token);

  if (!token) return false;

  const res = await fetch('http://localhost:8000/watchlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'urauthorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster
    })
  });

  console.log('Watchlist status:', res.status);
  return res.ok;
};

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, toggleFavorite, toggleWatched, toggleWatchlist }}>
      {children}
    </AuthContext.Provider>
  );
};