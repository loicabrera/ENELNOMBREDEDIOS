import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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

// Información de los planes
const planInfo = {
  basico: {
    titulo: "Plan Básico",
    descripcion: "Ideal para comenzar a promocionar tus servicios",
    beneficios: [
      "3 publicaciones de servicios",
      "3 publicaciones de productos",
      "Hasta 8 fotos por publicación",
      "Duración de 30 días"
    ]
  },
  destacado: {
    titulo: "Plan Destacado",
    descripcion: "Obtén mayor visibilidad para tus servicios",
    beneficios: [
      "6 publicaciones de servicios",
      "7 publicaciones de productos",
      "Hasta 15 fotos por publicación",
      "Posición destacada por 7 días",
      "Duración de 60 días"
    ]
  },
  premium: {
    titulo: "Plan Premium",
    descripcion: "Máxima visibilidad para tu negocio",
    beneficios: [
      "Publicaciones ilimitadas",
      "Hasta 25 fotos por publicación",
      "Aparición en portada por 15 días",
      "Posición premium en búsquedas",
      "Badge verificado",
      "Duración de 90 días"
    ]
  }
};

const DatosPersonas = () => {
  const location = useLocation();
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
    planSeleccionado: location.state?.plan || 'basico'
  });

  const planActual = planInfo[formData.planSeleccionado] || planInfo.basico;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://spectacular-recreation-production.up.railway.app/crear_persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la persona');
      }

      // Redirigir al formulario de proveedor
      console.log('Redirigiendo a /datosproveedor con state:', { id_persona: data.persona.id_persona, plan: location.state.plan });
      navigate('/datosproveedor', {
        state: {
          id_persona: data.persona.id_persona,
          plan: location.state.plan
        }
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f3e8ff] to-[#e0e7ff] flex flex-col justify-center">
      {/* Contenedor principal */}
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[80vh] py-12 md:ml-8">
        {/* Título principal */}
        <h1 className="text-4xl font-extrabold mb-2 text-center" style={{ color: colors.darkTeal, letterSpacing: 1 }}>Registro de Usuario</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Completa tus datos personales para comenzar a disfrutar de nuestros servicios</p>
        {/* ProgressBar */}
        <div className="w-full mt-2 mb-4">
          <ProgressBar currentStep={0} />
        </div>
        {/* Contenido principal */}
        <div className="w-full flex flex-col md:flex-row gap-10 items-start justify-center px-2 md:px-0">
          {/* Formulario */}
          <div className="md:w-2/3 w-full rounded-3xl shadow-2xl overflow-hidden border border-[#cbb4db] bg-white/90 backdrop-blur-md" style={{ boxShadow: `0 8px 32px 0 ${colors.purple}33` }}>
            <div className="px-10 py-12">
              <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.darkTeal }}>Datos Personales</h2>
              {error && (
                <div className="mb-4 p-3 rounded-md text-white text-center" style={{ background: colors.error }}>
                  {error}
                </div>
              )}
              <div className="mb-6 p-3 rounded-md border text-center" style={{ background: colors.lightPink, borderColor: colors.purple, color: colors.darkTeal }}>
                <span className="font-semibold">Plan seleccionado:</span> {planActual.titulo}
              </div>
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: colors.darkTeal }}>
                      Nombre:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbb4db] bg-white shadow-sm transition"
                        style={{ borderColor: colors.purple, background: colors.lightPink }}
                        placeholder="Ingrese su nombre"
                      />
                      <span className="absolute right-3 top-2.5 text-[#cbb4db]">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: colors.darkTeal }}>
                      Apellido:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbb4db] bg-white shadow-sm transition"
                        style={{ borderColor: colors.purple, background: colors.lightPink }}
                        placeholder="Ingrese su apellido"
                      />
                      <span className="absolute right-3 top-2.5 text-[#cbb4db]">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1" style={{ color: colors.darkTeal }}>
                      Cédula:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbb4db] bg-white shadow-sm transition"
                        style={{ borderColor: colors.purple, background: colors.lightPink }}
                        placeholder="000-0000000-0"
                        maxLength={13}
                      />
                      <span className="absolute right-3 top-2.5 text-[#cbb4db]">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: colors.darkTeal }}>
                    Teléfono:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbb4db] bg-white shadow-sm transition"
                      style={{ borderColor: colors.purple, background: colors.lightPink }}
                      placeholder="000-000-0000"
                    />
                    <span className="absolute right-3 top-2.5 text-[#cbb4db]">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.72 3.06a2 2 0 0 1-.45 2.11L8.09 11.91a16 16 0 0 0 6 6l2.02-2.02a2 2 0 0 1 2.11-.45c.99.35 2.01.59 3.06.72A2 2 0 0 1 22 16.92z"/></svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: colors.darkTeal }}>
                    Dirección:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbb4db] bg-white shadow-sm transition"
                      style={{ borderColor: colors.purple, background: '#fff' }}
                      placeholder="Ingrese su dirección completa"
                    />
                    <span className="absolute right-3 top-2.5 text-[#cbb4db]">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: colors.darkTeal }}>
                    Correo electrónico:
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cbb4db] bg-white shadow-sm transition"
                      style={{ borderColor: colors.purple, background: colors.lightPink }}
                      placeholder="ejemplo@correo.com"
                    />
                    <span className="absolute right-3 top-2.5 text-[#cbb4db]">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" fill="none"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl font-semibold transition duration-300 text-white shadow-lg disabled:opacity-50 bg-[#cbb4db] hover:bg-[#b49acb] hover:scale-[1.02] active:scale-100"
                    style={{ background: colors.purple, boxShadow: `0 2px 8px 0 ${colors.purple}33` }}
                  >
                    {loading ? 'Procesando...' : 'Siguiente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Panel informativo */}
          <div className="md:w-1/3 w-full rounded-3xl shadow-2xl overflow-hidden border flex flex-col items-center justify-center bg-gradient-to-br from-[#9CAF88]/90 to-[#cbb4db]/80 border-[#cbb4db]" style={{ boxShadow: `0 8px 32px 0 ${colors.sage}33` }}>
            <div className="px-8 py-10 w-full">
              <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: colors.darkTeal }}>{planActual.titulo}</h3>
              <p className="mb-6 text-gray-800 text-center">{planActual.descripcion}</p>
              <h4 className="font-semibold mb-2 text-gray-800 text-center">Beneficios:</h4>
              <ul className="space-y-2 text-gray-800">
                {planActual.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-pink-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {beneficio}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-3 rounded-md text-center bg-[#cbb4db]/80">
                <p className="text-sm text-gray-800">
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
