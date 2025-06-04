import { BellIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        if (!isAuthenticated || !user || !user.provedorId) {
          console.log('Usuario no autenticado o sin provedorId en contexto.');
          setMensajes([]);
          setLoading(false);
          return;
        }

        const idProveedor = user.provedorId;

        const response = await fetch(`https://spectacular-recreation-production.up.railway.app/usuarios?provedor_negocio_id_provedor=${idProveedor}`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Error al obtener los mensajes');
        }
        const data = await response.json();
        setMensajes(data);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setLoading(false);
      }
    };
    fetchMensajes();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Cargando mensajes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Mensajes de Contacto</h2>
          <p className="text-gray-600">Mensajes recibidos de usuarios interesados</p>
        </div>
      </div>

      <div className="space-y-4">
        {mensajes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No hay mensajes nuevos
          </div>
        ) : (
          mensajes.map((mensaje) => (
            <div
              key={mensaje.id_user}
              className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <BellIcon className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      Mensaje de {mensaje.nombre}
                    </h3>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">{mensaje.comentario}</p>
                    <div className="text-xs text-gray-500">
                      <p>Email: {mensaje.email || 'No proporcionado'}</p>
                      <p>Teléfono: {mensaje.telefono}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications; 