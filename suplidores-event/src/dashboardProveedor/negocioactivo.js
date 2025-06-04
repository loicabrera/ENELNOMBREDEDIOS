import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NegocioActivo = () => {
  const [activeBusiness, setActiveBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchActiveBusiness = async () => {
      if (!isAuthenticated || !user?.personaId) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://spectacular-recreation-production.up.railway.app/api/businesses/active/${user.personaId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error al obtener el negocio activo');
        }

        const data = await response.json();
        setActiveBusiness(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBusiness();
  }, [user, isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Error al cerrar sesión');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!activeBusiness) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay un negocio activo seleccionado.</p>
        <button
          onClick={() => navigate('/dashboard-proveedor/negocios')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Seleccionar Negocio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Negocio Activo</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{activeBusiness.name}</h3>
            <p className="text-gray-600 mt-1">{activeBusiness.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Dirección</h4>
              <p className="mt-1 text-gray-900">{activeBusiness.address}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Teléfono</h4>
              <p className="mt-1 text-gray-900">{activeBusiness.phone}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="mt-1 text-gray-900">{activeBusiness.email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Estado</h4>
              <p className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activeBusiness.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {activeBusiness.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Horario de Atención</h4>
            <div className="space-y-2">
              {activeBusiness.schedule?.map((day, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-900">{day.day}</span>
                  <span className="text-gray-600">{day.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegocioActivo;
