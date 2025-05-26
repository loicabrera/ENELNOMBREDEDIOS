import React, { useEffect, useState } from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const Negocios = () => {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Aquí irá la lógica para cargar los negocios
    // Por ahora solo simulamos una carga
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#fbcbdb]">
        Cargando...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fbcbdb] py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-[#012e33]">Mis Negocios</h2>
          <button className="px-6 py-3 bg-[#012e33] text-white rounded-xl hover:bg-[#fbaccb] transition-colors duration-300 font-semibold flex items-center gap-2">
            <BuildingStorefrontIcon className="h-5 w-5" />
            Agregar Negocio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Aquí irán las tarjetas de los negocios */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#012e33]">Nombre del Negocio</h3>
              <span className="px-3 py-1 bg-[#cbb4db] text-[#012e33] rounded-full text-sm font-medium">
                Activo
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-[#012e33]"><strong>Dirección:</strong> Dirección del negocio</p>
              <p className="text-[#012e33]"><strong>Teléfono:</strong> (123) 456-7890</p>
              <p className="text-[#012e33]"><strong>Email:</strong> negocio@ejemplo.com</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-4 py-2 bg-[#012e33] text-white rounded-lg hover:bg-[#fbaccb] transition-colors duration-300">
                Editar
              </button>
              <button className="flex-1 px-4 py-2 border-2 border-[#012e33] text-[#012e33] rounded-lg hover:bg-[#fbcbdb] transition-colors duration-300">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Negocios; 