import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import MyLists from './pages/MyLists.jsx';
import UserProfile from './pages/UserProfile.jsx';
import './styles/App.css'; // ← sigue importado, todo se aplica

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-black text-white text-2xl">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppContent() {
  const location = useLocation();

  // Añadimos una clase solo cuando NO estamos en login/register
  const isMainPage = !['/login', '/register', '/'].includes(location.pathname);

  return (
    <div className={isMainPage ? 'main-app' : 'auth-app'}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/movie/:imdbID" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
        <Route path="/my-lists" element={<ProtectedRoute><MyLists /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;