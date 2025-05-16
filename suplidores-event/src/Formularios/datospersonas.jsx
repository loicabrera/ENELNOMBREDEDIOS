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
  error: '#ff6b6b',
};

const DatosPersonas = () => {
  const { plan } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    direccion: '',
    email: '',
    planSeleccionado: plan || 'destacado'
  });

  // Función para validar el formato de la cédula (000-0000000-0)
  const validarCedula = (cedula) => {
    const regex = /^\d{3}-\d{7}-\d{1}$/;
    return regex.test(cedula);
  };

  // Función para validar el formato del teléfono (000-000-0000)
  const validarTelefono = (telefono) => {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(telefono);
  };

  // Función para validar el email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Limpiar error cuando el usuario modifica algún campo
  };

  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.apellido.trim()) {
      setError('El apellido es requerido');
      return false;
    }
    if (!validarCedula(formData.cedula)) {
      setError('La cédula debe tener el formato: 000-0000000-0');
      return false;
    }
    if (!validarTelefono(formData.telefono)) {
      setError('El teléfono debe tener el formato: 000-000-0000');
      return false;
    }
    if (!validarEmail(formData.email)) {
      setError('El email no es válido');
      return false;
    }
    return true;
  };

  const insertarPersona = async () => {
    try {
      const response = await fetch('http://localhost:3000/crear_persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          cedula: formData.cedula,
          telefono: formData.telefono,
          email: formData.email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la persona');
      }

      return true;
    } catch (error) {
      console.error('Error al crear persona:', error);
      setError(error.message);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!validarFormulario()) {
        setLoading(false);
        return;
      }

      const success = await insertarPersona();
      if (success) {
        navigate('/registro/evento', { state: { formData } });
      }
    } catch (error) {
      console.error('Error en el envío:', error);
      setError('Error al procesar el formulario');
    } finally {
      setLoading(false);
    }
  };

  // Información de los planes
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
    <div className="min-h-screen bg-white">
      {/* Contenedor principal */}
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[90vh]">
        {/* ProgressBar */}
        <div className="w-full mt-8 mb-2">
          <ProgressBar currentStep={0} />
        </div>
        {/* Contenido principal */}
        <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center px-2 md:px-0">
          {/* Formulario */}
          <div className="md:w-2/3 w-full rounded-2xl shadow-xl overflow-hidden border border-[#cbb4db]" style={{ boxShadow: `0 4px 24px 0 ${colors.purple}33`, background: colors.purple }}>
            <div className="px-8 py-10">
              <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: colors.darkTeal }}>Datos Personales</h2>
              {error && (
                <div className="mb-4 p-3 rounded-md text-white text-center" style={{ background: colors.error }}>
                  {error}
                </div>
              )}
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.darkTeal }}>
                      Cédula:
                    </label>
                    <input
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                      style={{ borderColor: colors.purple, background: colors.lightPink }}
                      placeholder="000-0000000-0"
                      maxLength={13}
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
                    placeholder="000-000-0000"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white"
                    style={{ borderColor: colors.purple }}
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
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-md font-medium transition duration-300 text-white shadow-md disabled:opacity-50"
                    style={{ background: colors.pink, boxShadow: `0 2px 8px 0 ${colors.purple}33` }}
                  >
                    {loading ? 'Procesando...' : 'Siguiente'}
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
