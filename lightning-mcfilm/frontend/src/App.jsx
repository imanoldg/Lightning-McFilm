import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Search from'./pages/Search.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import MyLists from './pages/MyLists.jsx';

function App() {
  // Simulamos si está logeado (más tarde lo haremos con JWT o contexto)
  const isLoggedIn = true; // Cambia a false para probar login

  return (
    <Routes>
      {/* Si no está logeado → redirige a login */}
      <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
      <Route path="/search" element={isLoggedIn ? <Search /> : <Navigate to="/login" />} />
      <Route path="/movie/:imdbID" element={isLoggedIn ? <MovieDetail /> : <Navigate to="/login" />} />
      <Route path="/my-lists" element={isLoggedIn ? <MyLists /> : <Navigate to="/login" />} />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;