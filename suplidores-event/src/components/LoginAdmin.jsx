import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Verificar si ya hay una sesión activa
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.rol === 'admin') {
      // Si hay una sesión activa de admin, redirigir al dashboard
      const from = location.state?.from?.pathname || '/dashboardadmin';
      navigate(from, { replace: true });
    } else if (user) {
      // Si hay una sesión pero no es de admin, limpiarla
      localStorage.removeItem('user');
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/login_admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // Limpiar cualquier sesión existente
      localStorage.removeItem('user');

      // Guardar datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify({
        ...data.user,
        rol: 'admin' // Aseguramos que el rol sea admin
      }));

      // Redirigir al dashboard de administrador o a la página anterior si existe
      const from = location.state?.from?.pathname || '/dashboardadmin';
      navigate(from, { replace: true });

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center" style={{ position: 'fixed' }}>
      {/* Overlay oscuro sobre la imagen de fondo */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(../../img/imagen_fondo_login.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px) brightness(0.7)',
        }}
      />
      <div className="absolute inset-0 bg-black opacity-40 z-10" />
      <div className="relative z-20 w-full max-w-md px-2 sm:px-4 py-12 flex flex-col items-center justify-center" style={{ minHeight: 'unset' }}>
        <div className="bg-white bg-opacity-95 rounded-3xl shadow-2xl p-8 w-full flex flex-col items-center">
          {/* Espacio para el logo */}
          <div className="w-full flex justify-center items-center mb-2" style={{ minHeight: 64 }}>
            {/* Aquí puedes poner el logo */}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Acceso Administrativo</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">Ingresa tus credenciales de administrador</p>
          {error && (
            <div className="mb-4 p-3 bg-red-50 rounded-md border border-red-200 w-full">
              <p className="text-red-700 text-center">{error}</p>
            </div>
          )}
          <form className="space-y-5 w-full" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario Administrador</label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tu nombre de usuario"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tu contraseña"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;