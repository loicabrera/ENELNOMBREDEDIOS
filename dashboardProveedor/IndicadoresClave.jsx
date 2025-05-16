// src/dashboardProveedor/components/IndicadoresClave.jsx

import React from "react";

const IndicadoresClave = ({ proveedor }) => {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      <div className="bg-purple-100 text-purple-800 rounded-lg px-6 py-4 shadow text-center min-w-[140px]">
        <div className="text-2xl font-bold">{proveedor.publicacionesActivas}</div>
        <div className="text-sm">Publicaciones Activas</div>
      </div>
      <div className="bg-pink-100 text-pink-800 rounded-lg px-6 py-4 shadow text-center min-w-[140px]">
        <div className="text-2xl font-bold">{proveedor.mensajesRecientes}</div>
        <div className="text-sm">Mensajes Recientes</div>
      </div>
      <div className="bg-sage-100 text-green-900 rounded-lg px-6 py-4 shadow text-center min-w-[140px]">
        <div className="text-2xl font-bold">{proveedor.publicacionesPendientes}</div>
        <div className="text-sm">Pendientes de Aprobación</div>
      </div>
    </div>
  );
};

export default IndicadoresClave;
  