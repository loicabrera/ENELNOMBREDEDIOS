import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar';

// Paleta de colores pastel
const colors = {
  darkTeal: '#012e33',
  lightPink: '#fbcbdb',
  pink: '#fbaccb',
  purple: '#cbb4db',
  sage: '#9CAF88',
};

const DatosPersonas = () => {
  const { plan } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    email: '',
    planSeleccionado: plan || 'destacado'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos ingresados:', formData);
    navigate('/registro/evento', { state: { formData } });
  };

  // Información de los planes según el documento proporcionado
  const planInfo = {
    destacado: {
      titulo: "Plan Destacado",
      descripcion: "Obtenga mayor visibilidad para sus servicios y productos",
      beneficios: [
        "Publicaciones destacadas en las búsquedas",
        "Mayor número de productos/servicios para publicar",
        "Acceso a estadísticas de visualización",
        "Prioridad en los resultados de búsqueda"
      ]
    }
  };

  const planActual = planInfo[formData.planSeleccionado] || planInfo.destacado;

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${colors.lightPink} 60%, ${colors.purple} 100%)` }}>
      {/* Navbar superior */}
      <nav className="w-full shadow-md sticky top-0 z-20" style={{ background: colors.darkTeal }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-tight" style={{ color: colors.lightPink }}>
            EN EL NOMBRE DE DIOS
          </span>
          <span className="text-sm font-medium" style={{ color: colors.pink }}>
            Registro de Usuario
          </span>
        </div>
      </nav>

      {/* Contenedor principal */}
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[90vh]">
        {/* ProgressBar */}
        <div className="w-full mt-8 mb-2">
          <ProgressBar currentStep={0} />
        </div>
        {/* Contenido principal */}
        <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center px-2 md:px-0">
          {/* Formulario */}
          <div className="md:w-2/3 w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-[#cbb4db]" style={{ boxShadow: `0 4px 24px 0 ${colors.purple}33` }}>
            <div className="px-8 py-10">
              <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.darkTeal }}>Datos Personales</h2>
              <div className="mb-6 p-3 rounded-md border text-center" style={{ background: colors.lightPink, borderColor: colors.purple, color: colors.darkTeal }}>
                <span className="font-semibold">Plan seleccionado:</span> {planActual.titulo}
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                      Nombre:
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                      style={{ borderColor: colors.purple, background: colors.lightPink }}
                      placeholder="Ingrese su nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                      Apellido:
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                      style={{ borderColor: colors.purple, background: colors.lightPink }}
                      placeholder="Ingrese su apellido"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                    Teléfono:
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: colors.purple, background: colors.lightPink }}
                    placeholder="Ej: +34 600 123 456"
                  />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: colors.purple, background: colors.lightPink }}
                    placeholder="Ingrese su dirección completa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                    Correo electrónico:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: colors.purple, background: colors.lightPink }}
                    placeholder="ejemplo@correo.com"
                  />
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
              <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: colors.darkTeal }}>{planActual.titulo}</h3>
              <p className="mb-6 text-white text-center">{planActual.descripcion}</p>
              <h4 className="font-semibold mb-2 text-white text-center">Beneficios:</h4>
              <ul className="space-y-2 text-white">
                {planActual.beneficios.map((beneficio, index) => (
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
                  Al completar el formulario, podrá acceder a todas las funcionalidades de su plan de membresía y comenzar a gestionar sus productos o servicios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosPersonas;