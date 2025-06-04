import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginProveedor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Verificar si ya hay una sesión activa (NOTA: Esta lógica necesita ser actualizada para usar JWT cookies en lugar de localStorage)
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('user'));
    // if (user && user.rol === 'proveedor') {
    //   // Si hay una sesión activa de proveedor, redirigir al dashboard
    //   const from = location.state?.from?.pathname || '/dashboard-proveedor';
    //   // Reemplazar la entrada actual en el historial
    //   window.history.replaceState(null, '', from);
    //   navigate(from, { replace: true });
    // } else if (user) {
    //   // Si hay una sesión pero no es de proveedor, limpiarla
    //   localStorage.removeItem('user');
    //   localStorage.removeItem('negocio_activo');
    // }
    // TODO: Implementar verificación de autenticación basada en JWT (ej. llamando a una ruta segura en el backend)
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
      const response = await fetch('https://spectacular-recreation-production.up.railway.app/login_proveedor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      // Aunque la respuesta del backend ahora solo devuelve { message: 'Login exitoso' }, 
      // la cookie HttpOnly con el JWT se habrá guardado automáticamente por el navegador.
      // No necesitamos leer el cuerpo de la respuesta para obtener el ID del proveedor aquí.
      const data = await response.json(); // Leer la respuesta para verificar si hay errores en el cuerpo

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // *** ELIMINAR ALMACENAMIENTO DE DATOS SENSIBLES EN localStorage ***
      localStorage.removeItem('user');
      localStorage.removeItem('negocio_activo');
      // data.user y el ID sensible ya NO se guardan aquí.

      // Redirigir al dashboard del proveedor
      navigate('/dashboard-proveedor', { replace: true });

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
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