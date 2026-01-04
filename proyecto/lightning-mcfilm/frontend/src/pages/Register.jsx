import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_conf: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_conf) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(form.username, form.email, form.password);
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
        <h2 className="text-center text-xl font-semibold mb-4">{t('register.title')}</h2>
        <hr className="mb-6" />

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t('register.name')}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="email"
            placeholder={t('register.email')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            placeholder={t('register.password')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            placeholder={t('register.password')}
            value={form.password_conf}
            onChange={(e) => setForm({ ...form, password_conf: e.target.value })}
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
            {loading ? t('register.loading') : t('register.register')}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <p className="text-gray-600">{t('register.haveAccount')}</p>
          <Link to="/login" className="text-red-500 hover:underline">
            {t('register.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;