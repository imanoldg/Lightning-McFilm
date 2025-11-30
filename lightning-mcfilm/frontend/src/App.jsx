import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import MyLists from './pages/MyLists.jsx';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute:', { user, loading });

  if (loading) {
    console.log('⏳ Cargando autenticación...');
    return <div className="flex items-center justify-center min-h-screen"><p>Cargando...</p></div>;
  }
  
  if (!user) {
    console.log('❌ No autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Usuario autenticado, mostrando contenido');
  return children;
};

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('📍 Navegando a:', location.pathname);
    console.log('👤 Usuario actual:', user);
  }, [location.pathname, user]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      
      <Route path="/search" element={
        <ProtectedRoute>
          <Search />
        </ProtectedRoute>
      } />
      
      <Route path="/movie/:imdbID" element={
        <ProtectedRoute>
          <MovieDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/my-lists" element={
        <ProtectedRoute>
          <MyLists />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  console.log('🚀 App iniciada');
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;