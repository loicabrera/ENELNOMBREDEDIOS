import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useActiveBusiness } from '../context/ActiveBusinessContext';

const LoginProveedor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { login, loading: authLoading, isAuthenticated: isAuthContextAuthenticated } = useAuth();
  const { clearActiveBusiness } = useActiveBusiness();

  useEffect(() => {
    console.log('LoginProveedor useEffect: Estado actual de AuthContext - authLoading:', authLoading, 'isAuthenticated:', isAuthContextAuthenticated);
    if (!authLoading && isAuthContextAuthenticated) {
       console.log('LoginProveedor useEffect: AuthContext ya autenticado y no cargando, redirigiendo...');
       const from = location.state?.from?.pathname || '/dashboard-proveedor';
       navigate(from, { replace: true });
    } else if (!authLoading && !isAuthContextAuthenticated) {
       console.log('LoginProveedor useEffect: AuthContext terminó de cargar y NO autenticado.');
       setLoading(false); 
    }
  }, [authLoading, isAuthContextAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  console.log('Renderizando LoginProveedor y definiendo handleSubmit.');
  const handleSubmit = async (e) => {
    console.log('handleSubmit llamado.');
    e.preventDefault();
    setLoading(true);
    setError(null);
    clearActiveBusiness();

    try {
      await login(formData.username, formData.password);

    } catch (error) {
      console.error('Error en handleSubmit de LoginProveedor:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar sesión como proveedor
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuario"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginProveedor; 