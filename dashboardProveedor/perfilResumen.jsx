// src/dashboardProveedor/PerfilResumen.jsx

import React from "react";

const PerfilResumen = ({ proveedor }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border border-gray-200">
      <h2 className="text-lg font-bold mb-2">Perfil del Proveedor</h2>
      <div><b>Nombre:</b> {proveedor.nombre}</div>
      <div><b>Tipo de Servicio:</b> {proveedor.tipoServicio}</div>
      <div><b>Plan:</b> {proveedor.plan}</div>
      <div><b>Estado de Cuenta:</b> {proveedor.estadoCuenta}</div>
      <div><b>Vencimiento Membresía:</b> {proveedor.vencimientoMembresia}</div>
    </div>
  );
};

export default PerfilResumen;
  