import React from 'react';
import logo from '../assets/img/logo.jpg';


const Login = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white shadow-md rounded-xl p-8 w-80 border border-gray-300">
            <h2 className="text-center text-xl font-semibold mb-4">Iniciar Sesión</h2>
            <hr className="mb-6" />
    
            {/* Logo circular */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full border border-gray-400 flex items-center justify-center overflow-hidden">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
    
            {/* Inputs */}
            <input
              type="text"
              id="username"
              placeholder="Username/Email"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
    
            {/* Botón */}
            <button className="w-full bg-gray-800 text-white py-2 rounded-md font-semibold hover:bg-red-900 transition">
              Entrar
            </button>
    
            {/* Texto inferior */}
            <div className="text-center mt-6 text-sm">
              <p className="text-gray-600">¿No tienes cuenta?</p>
              <a href="#" className="text-red-500 hover:underline">
                Regístrate aquí
              </a>
            </div>
          </div>
        </div>
      );
}

export default Login