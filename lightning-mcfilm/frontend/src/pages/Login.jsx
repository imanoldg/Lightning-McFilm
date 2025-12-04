import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-8 w-80 border border-gray-300">
        <h2 className="text-center text-xl font-semibold mb-4">Iniciar Sesión</h2>
        <hr className="mb-6" />

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full border border-gray-400 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          {error && (
            <p className="text-red-600 text-center text-sm mb-4 bg-red-50 py-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-md font-semibold hover:bg-red-900 transition disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <p className="text-gray-600">¿No tienes cuenta?</p>
          <Link to="/register" className="text-red-500 hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;