// src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const colors = {
    sage: "#9CAF88",
    purple: "#cbb4db",
    pink: "#fbaccb",
    lightPink: "#fbcbdb",
    darkTeal: "#012e33",
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje('');

    try {
      const res = await axios.post('/api/login', {
        username,
        password,
      });

      localStorage.setItem('token', res.data.token);
      setMensaje('Login exitoso');
      navigate('/dashboardproveedor');
    } catch (err) {
      setMensaje(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center min-h-screen min-w-full p-4">
      {/* Imagen de fondo */}
      <img 
        src="https://www.funtastyc.es/blog/wp-content/uploads/2020/08/organizar-eventos.jpg" 
        alt="Fondo evento elegante" 
        className="absolute inset-0 w-full h-full object-fill object-center z-0" 
        style={{ filter: 'blur(1px) brightness(0.7)' }}
      />
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="w-full max-w-md animate-fade-in relative z-20">
        <form 
          onSubmit={handleLogin} 
          className="backdrop-blur-lg bg-white border border-white/40 rounded-2xl shadow-2xl p-8 md:p-10 space-y-7 relative"
        >
          {/* Logo o icono */}
          <div className="flex justify-center mb-2">
            <img src="/img/logo circulo.png" alt="Logo" className="h-14 w-14 rounded-full  bg-white object-contain" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#012e33] mb-2 tracking-tight drop-shadow-sm">
            Iniciar Sesión
          </h2>
          <p className="text-center text-gray-500 text-sm mb-4">Accede a tu cuenta de proveedor</p>

          <div className="space-y-5">
            <div className="flex items-center bg-white/70 rounded-lg border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#94c8d6] focus-within:border-[#94c8d6] transition-all duration-200">
              <span className="pl-3 text-gray-400 flex items-center">
                <User size={20} />
              </span>
              <input
                id="username"
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="flex-1 bg-transparent border-none outline-none py-3 pl-3 pr-4 rounded-lg placeholder-gray-400 text-gray-900 text-base"
              />
            </div>

            <div className="flex items-center bg-white/70 rounded-lg border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#94c8d6] focus-within:border-[#94c8d6] transition-all duration-200">
              <span className="pl-3 text-gray-400 flex items-center">
                <Lock size={20} />
              </span>
              <input
                id="password"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 bg-transparent border-none outline-none py-3 pl-3 pr-4 rounded-lg placeholder-gray-400 text-gray-900 text-base"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#012e33] to-[#94c8d6] text-white rounded-lg font-semibold text-lg shadow-md 
                     hover:from-[#023c43] hover:to-[#7bb7c7] focus:outline-none focus:ring-2 focus:ring-[#012e33] focus:ring-offset-2 
                     transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
                     transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
          </button>

          {mensaje && (
            <p className={`text-center text-sm font-medium ${
              mensaje.includes('exitoso') ? 'text-green-600' : 'text-red-600'
            }`}>
              {mensaje}
            </p>
          )}

        </form>
      </div>
      {/* Animación fade-in */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Login;
