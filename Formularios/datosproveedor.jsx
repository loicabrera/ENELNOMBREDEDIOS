import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar';

// Paleta de colores pastel
const colors = {
  darkTeal: '#012e33',
  lightPink: '#fbcbdb',
  pink: '#fbaccb',
  purple: '#cbb4db',
  sage: '#9CAF88',
};

const DatosProveedor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ...location.state?.formData,
    nombre_empresa: '',
    email_empresa: '',
    telefono_empresa: '',
    tipo_servicio: '',
    fecha_creacion: '',
    direccion: '',
    descripcion: '',
    redes_sociales: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del proveedor:', formData);
    navigate('/registro/confirmacion', { state: { formData } });
  };

  // Información sobre el registro del proveedor
  const proveedorInfo = {
    titulo: "Registro de Proveedor",
    descripcion: "Complete los datos de su empresa o servicio",
    beneficios: [
      "Mayor visibilidad para su negocio",
      "Conexión con potenciales clientes",
      "Gestión centralizada de servicios",
      "Presencia digital profesional"
    ]
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center justify-center px-2 md:px-0 py-10 mx-auto">
        <div className="w-full mt-8 mb-2">
          <ProgressBar currentStep={1} />
        </div>
        {/* Formulario */}
        <div className="md:w-2/3 w-full rounded-2xl shadow-xl overflow-hidden border border-[#cbb4db] mx-auto" style={{ boxShadow: `0 4px 24px 0 ${colors.purple}33`, background: colors.purple }}>
          <div className="px-8 py-10">
            <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.darkTeal }}>Datos del Proveedor</h2>
            <div className="mb-6 p-3 rounded-md border text-center" style={{ background: colors.lightPink, borderColor: colors.purple, color: colors.darkTeal }}>
              <span className="font-semibold">Información de empresa:</span> Complete los datos de su negocio
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                    Nombre de la empresa:
                  </label>
                  <input
                    type="text"
                    name="nombre_empresa"
                    value={formData.nombre_empresa}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: colors.purple }}
                    placeholder="Nombre de su empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                    Email de la empresa:
                  </label>
                  <input
                    type="email"
                    name="email_empresa"
                    value={formData.email_empresa}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: colors.purple }}
                    placeholder="email@empresa.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                    Teléfono de la empresa:
                  </label>
                  <input
                    type="text"
                    name="telefono_empresa"
                    value={formData.telefono_empresa}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: colors.purple }}
                    placeholder="Ej: +34 900 123 456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                    Tipo de servicio:
                  </label>
                  <input
                    type="text"
                    name="tipo_servicio"
                    value={formData.tipo_servicio}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: colors.purple }}
                    placeholder="Ej: Consultoría, Retail, Servicios"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                    Fecha de creación:
                  </label>
                  <input
                    type="date"
                    name="fecha_creacion"
                    value={formData.fecha_creacion}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: colors.purple }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                    Redes sociales:
                  </label>
                  <input
                    type="text"
                    name="redes_sociales"
                    value={formData.redes_sociales}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: colors.purple }}
                    placeholder="LinkedIn, Instagram, Facebook..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                  Dirección:
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white"
                  style={{ borderColor: colors.purple }}
                  placeholder="Dirección completa de la empresa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                  Descripción:
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white"
                  style={{ borderColor: colors.purple }}
                  placeholder="Describa brevemente su empresa y servicios..."
                ></textarea>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-md font-medium transition duration-300 text-white shadow-md"
                  style={{ background: colors.pink, boxShadow: `0 2px 8px 0 ${colors.purple}33` }}
                >
                  Siguiente
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Panel informativo */}
        <div className="md:w-1/3 w-full rounded-2xl shadow-xl overflow-hidden border flex flex-col items-center justify-center" style={{ background: colors.sage, borderColor: colors.purple, boxShadow: `0 4px 24px 0 ${colors.sage}33` }}>
          <div className="px-8 py-10 w-full">
            <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: colors.darkTeal }}>{proveedorInfo.titulo}</h3>
            <p className="mb-6 text-white text-center">{proveedorInfo.descripcion}</p>
            <h4 className="font-semibold mb-2 text-white text-center">Beneficios:</h4>
            <ul className="space-y-2 text-white">
              {proveedorInfo.beneficios.map((beneficio, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-pink-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {beneficio}
                </li>
              ))}
            </ul>
            <div className="mt-6 p-3 rounded-md text-center" style={{ background: colors.purple }}>
              <p className="text-sm text-white">
                Los datos de su empresa serán utilizados para crear su perfil de proveedor y mostrar sus servicios a clientes potenciales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosProveedor; 