import React, { useState, useEffect } from 'react';

const Membresias = () => {
  const [membresias, setMembresias] = useState({ activas: [], proximasVencer: [], vencidas: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMembresia, setSelectedMembresia] = useState(null);
  const [razonInactivacion, setRazonInactivacion] = useState('');

  useEffect(() => {
    fetch('https://spectacular-recreation-production.up.railway.app/api/membresias/admin')
      .then(res => res.json())
      .then(data => {
        setMembresias(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInactivarClick = (membresia) => {
    setSelectedMembresia(membresia);
    setShowModal(true);
  };

  const handleConfirmarInactivacion = async () => {
    if (!razonInactivacion.trim()) {
      alert('Por favor, ingrese una razón para la inactivación');
      return;
    }

    try {
      const res = await fetch(`https://spectacular-recreation-production.up.railway.app/api/membresias/${selectedMembresia.id_prov_membresia}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          estado: 'inactiva',
          razon: razonInactivacion
        })
      });
      
      if (!res.ok) throw new Error('Error al cambiar el estado');
      
      // Actualizar la lista de membresías
      const updatedData = await fetch('https://spectacular-recreation-production.up.railway.app/api/membresias/admin').then(res => res.json());
      setMembresias(updatedData);
      
      // Cerrar el modal y limpiar el estado
      setShowModal(false);
      setSelectedMembresia(null);
      setRazonInactivacion('');
    } catch (error) {
      alert('No se pudo cambiar el estado de la membresía');
    }
  };

  const cambiarEstadoMembresia = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`https://spectacular-recreation-production.up.railway.app/api/membresias/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (!res.ok) throw new Error('Error al cambiar el estado');
      
      // Actualizar la lista de membresías
      const updatedData = await fetch('https://spectacular-recreation-production.up.railway.app/api/membresias/admin').then(res => res.json());
      setMembresias(updatedData);
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
          {membresia.razon_inactivacion && (
            <p className="text-sm text-red-600 mt-2">
              Razón de inactivación: {membresia.razon_inactivacion}
            </p>
          )}
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
          onClick={() => handleInactivarClick(membresia)}
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
    <div className="ml-54 p-0">
      <h1 className="text-2xl font-bold text-gray-900 mt-10 ml-28">Gestión de Membresías</h1>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar Inactivación</h3>
            <p className="mb-4">¿Está seguro que desea inactivar la membresía de {selectedMembresia?.nombre_empresa}?</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón de inactivación:
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={razonInactivacion}
                onChange={(e) => setRazonInactivacion(e.target.value)}
                placeholder="Ingrese la razón de la inactivación..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedMembresia(null);
                  setRazonInactivacion('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarInactivacion}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 ml-10">Membresías Activas</h2>
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