import React, { useEffect, useState } from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import { FaStore, FaCalendarAlt, FaClock, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Negocios = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBusiness, setActiveBusiness] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!isAuthenticated || !user?.personaId) {
        navigate('/login');
        return;
      }

      try {
        // Llama al nuevo endpoint que devuelve todos los negocios de la persona
        const response = await fetch(`https://spectacular-recreation-production.up.railway.app/api/persona/${user.personaId}/negocios`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error al obtener negocios');
        }

        const data = await response.json(); // Esperamos un array de negocios
        
        // La respuesta debe ser un array de negocios
        if (Array.isArray(data)) {
          // Mapear los nombres de las propiedades del backend a los nombres esperados por el frontend
          const mappedBusinesses = data.map(business => ({
            id: business.id_provedor, // Mapear id_provedor a id
            name: business.nombre_empresa, // Mapear nombre_empresa a name
            email: business.email_empresa, // Mapear email_empresa a email
            phone: business.telefono_empresa, // Mapear telefono_empresa a phone
            address: business.direccion, // Mapear direccion a address
            description: business.descripcion, // Mapear descripcion
            socialMedia: business.redes_sociales, // Mapear redes_sociales
            serviceType: business.tipo_servicio, // Mapear tipo_servicio
            // Nota: `schedule` no existe en la tabla actual, se mantendrá undefined o se manejará por separado si es necesario.
            schedule: [] // O manejar según la estructura real si existe en otra tabla
          }));

          setBusinesses(mappedBusinesses); 
           // Establecer el primer negocio mapeado como activo si la lista no está vacía
          if (mappedBusinesses.length > 0) {
            setActiveBusiness(mappedBusinesses[0]);
          } else {
            setActiveBusiness(null);
          }
        } else {
           // Si por alguna razón no es un array (ej: error en backend, o respuesta vacía pero no array)
          console.error('La respuesta del backend no es un array:', data);
          setBusinesses([]);
          setActiveBusiness(null);
          setError('Formato de datos de negocios incorrecto recibido.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [user, isAuthenticated, navigate]);

  const handleBusinessSelect = (business) => {
    setActiveBusiness(business);
  };

  const handleAgregarNegocio = () => {
    if (!isAuthenticated || !user || !user.personaId) {
      navigate('/login');
      return;
    }
    // Redirigir al formulario de datos proveedor
    navigate('/datosproveedor2', {
      state: {
        id_persona: user.personaId,
        plan: 'basico',
        isNewBusiness: true
      }
    });
  };

  const handleVerDetalles = (negocio) => {
    navigate('/dashboard-proveedor');
  };

  const handleEliminarNegocio = async (idNegocio) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este negocio? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`https://spectacular-recreation-production.up.railway.app/proveedores/${idNegocio}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setBusinesses(businesses.filter(n => n.id !== idNegocio));
        alert('Negocio eliminado correctamente');
      } else {
        alert('Error al eliminar el negocio');
      }
    } catch (error) {
      alert('Error al eliminar el negocio');
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Negocios</h2>
        {businesses.length === 0 ? (
          <p className="text-gray-500">No tienes negocios registrados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map((business) => (
              <div
                key={business.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  activeBusiness?.id === business.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleBusinessSelect(business)}
              >
                <h3 className="font-medium text-gray-900">{business.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{business.description}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {business.address}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeBusiness && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Negocio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{activeBusiness.name}</h3>
              <p className="text-gray-600 mt-2">{activeBusiness.description}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {activeBusiness.address}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {activeBusiness.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {activeBusiness.email}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Horario de Atención</h3>
              <div className="space-y-2">
                {activeBusiness.schedule?.map((day, index) => (
                  <div key={index} className="flex justify-between text-gray-600">
                    <span>{day.day}</span>
                    <span>{day.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Negocios; 