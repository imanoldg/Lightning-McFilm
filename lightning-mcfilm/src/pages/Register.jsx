import React from "react";

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-8 w-80 border border-gray-300">
        <h2 className="text-center text-xl font-semibold mb-4">
          Registro
        </h2>
        <hr className="mb-6" />

        {/* Inputs */}
        <input
          type="text"
          id="username"
          placeholder="Usuario"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <input
          type="text"
          id="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <input
          type="password"
          id="password"
          placeholder="Contraseña"
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <input
          type="password"
          id="password_conf"
          placeholder="Confirmar Contraseña"
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />

        {/* Botón */}
        <button className="w-full bg-gray-800 text-white py-2 rounded-md font-semibold hover:bg-red-900 transition">
          Crear Cuenta
        </button>

        {/* Texto inferior */}
        <div className="text-center mt-6 text-sm">
          <p className="text-gray-600">¿Ya tienes cuenta?</p>
          <a href="#" className="text-red-500 hover:underline">
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
