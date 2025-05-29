import React, { useState, useEffect } from 'react';

const Membresias = () => {
  const [membresias, setMembresias] = useState({ activas: [], proximasVencer: [], vencidas: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/membresias/admin')
      .then(res => res.json())
      .then(data => {
        setMembresias(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const [selectedProvider, setSelectedProvider] = useState(null);

  const cambiarEstadoMembresia = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:3000/api/membresias/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (!res.ok) throw new Error('Error al cambiar el estado');
      window.location.reload(); // Refresca para ver el cambio
    } catch (error) {
      alert('No se pudo cambiar el estado de la membresía');
    }
  };

  const MembresiaCard = ({ membresia, tipo }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{membresia.nombre_empresa}</h3>
          <p className="text-sm text-gray-600">
            {membresia.nombre} {membresia.apellido}
          </p>
          <p className="text-sm text-gray-600">Plan: {membresia.nombre_pla}</p>
          <p className="text-sm text-gray-600">
            Fecha inicio: {new Date(membresia.fecha_inicio).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Fecha fin: {new Date(membresia.fecha_fin).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            tipo === 'activa' ? 'bg-green-100 text-green-800' :
            tipo === 'proxima' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {tipo === 'activa' ? 'Activa' :
             tipo === 'proxima' ? 'Próxima a vencer' :
             'Vencida'}
          </span>
        </div>
      </div>
      {tipo === 'activa' && (
        <button
          onClick={() => cambiarEstadoMembresia(membresia.id_prov_membresia, 'inactiva')}
          className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Inactivar
        </button>
      )}
      {tipo === 'vencida' && (
        <button
          onClick={() => cambiarEstadoMembresia(membresia.id_prov_membresia, 'activa')}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Activar
        </button>
      )}
    </div>
  );

  return (
    <div className="ml-64 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Membresías</h1>

      {selectedProvider && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Credenciales generadas</h3>
          <p className="text-sm text-blue-800">
            Usuario: {selectedProvider.credentials.username}
          </p>
          <p className="text-sm text-blue-800">
            Contraseña: {selectedProvider.credentials.password}
          </p>
          <p className="text-sm text-blue-800">
            Email: {selectedProvider.credentials.email}
          </p>
          <button
            onClick={() => setSelectedProvider(null)}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Membresías Activas</h2>
          {membresias.activas.map((membresia) => (
            <MembresiaCard key={membresia.id_prov_membresia} membresia={membresia} tipo="activa" />
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas a Vencer</h2>
          {membresias.proximasVencer.map((membresia) => (
            <MembresiaCard key={membresia.id_prov_membresia} membresia={membresia} tipo="proxima" />
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vencidas</h2>
          {membresias.vencidas.map((membresia) => (
            <MembresiaCard key={membresia.id_prov_membresia} membresia={membresia} tipo="vencida" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Membresias;