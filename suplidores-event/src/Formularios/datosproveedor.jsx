import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar';

console.log('Loading DatosProveedor.jsx file'); // Added log

// Paleta de colores pastel
const colors = {
  darkTeal: '#012e33',
  lightPink: '#fbcbdb',
  pink: '#fbaccb',
  purple: '#cbb4db',
  sage: '#9CAF88',
  error: '#ff6b6b',
};

const DatosProveedor = () => {
  console.log('DatosProveedor mounted. location.state:', location.state);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [personaId, setPersonaId] = useState(null);

  // Definir los planes y sus montos
  const planes = {
    basico: {
      nombre: 'Plan Básico',
      monto: 2000
    },
    destacado: {
      nombre: 'Plan Destacado',
      monto: 4000
    },
    premium: {
      nombre: 'Plan Premium',
      monto: 8000
    }
  };

  // Verificar si tenemos el ID de la persona y el plan seleccionado
  useEffect(() => {
    // Usamos un pequeño delay para dar tiempo a que location.state se actualice
    const timer = setTimeout(() => {
      const id = location.state?.id_persona;

      // Intentar obtener el plan de location.state, o de localStorage como fallback
      const planFromState = location.state?.planFromState; // Leer el plan si se pasó en state
      const planFromStorage = localStorage.getItem('registrationPlan');
      const plan = planFromState || planFromStorage; // Usar state primero, luego storage

      console.log('DatosProveedor useEffect check:', { id, plan, state: location.state, planFromState, planFromStorage }); // Added log

      // Limpiar localStorage después de leer (independientemente de dónde se obtuvo)
      if (planFromStorage) {
          localStorage.removeItem('registrationPlan');
          console.log('Plan eliminado de localStorage.');
      }

      if (!id) {
        setError('No se encontró el ID de la persona. Por favor, registre sus datos personales primero.');
        navigate('/datospersonas');
      } else {
        setPersonaId(id);
      }

      // Validar el plan obtenido
      if (!plan || !planes[plan]) {
        setError('No se encontró el plan seleccionado o es inválido. Por favor, seleccione un plan válido.');
        navigate('/'); // Redirige a la página principal
      } else {
         // Aquí ya tenemos un ID de persona y un plan válido.
         // La lógica del formulario de proveedor puede continuar.
         console.log('ID de persona y plan válidos encontrados. Procediendo con formulario de proveedor.');
      }

    }, 100); // Pequeño delay de 100ms

    return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
  }, [location.state, navigate, planes]); // Añadimos planes a dependencias

  const [formData, setFormData] = useState({
    nombre_empresa: '',
    email_empresa: '',
    telefono_empresa: '',
    tipo_servicio: '',
    fecha_creacion: '',
    direccion: '',
    descripcion: '',
    redes_sociales: ''
  });

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
    if (!formData.nombre_empresa.trim()) {
      setError('El nombre de la empresa es requerido');
      return false;
    }
    if (!validarEmail(formData.email_empresa)) {
      setError('El email de la empresa no es válido');
      return false;
    }
    if (!validarTelefono(formData.telefono_empresa)) {
      setError('El teléfono debe tener el formato: 000-000-0000');
      return false;
    }
    if (!formData.tipo_servicio.trim()) {
      setError('El tipo de servicio es requerido');
      return false;
    }
    if (!formData.fecha_creacion) {
      setError('La fecha de creación es requerida');
      return false;
    }
    return true;
  };

  const insertarDatos = async () => {
    try {
      if (!personaId) {
        throw new Error('No se encontró el ID de la persona registrada');
      }

      console.log('Enviando datos al servidor:', {
        ...formData,
        p_e_r_s_o_n_a_id_persona: personaId
      });

      const response = await fetch('https://spectacular-recreation-production.up.railway.app/crear_proveedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          p_e_r_s_o_n_a_id_persona: personaId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el proveedor');
      }

      return true;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      setError(error.message);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const success = await insertarDatos();
      if (success) {
        const plan = location.state?.plan;
        const planInfo = planes[plan];

        // Redirigir a la página de pago con el monto correcto
        navigate('/pago', { 
          state: { 
            amount: planInfo.monto,
            planName: planInfo.nombre
          } 
        });
      }
    } catch (error) {
      console.error('Error en el envío:', error);
      setError('Error al procesar el formulario');
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor principal */}
      <div className="max-w-5xl mx-auto">
        <ProgressBar currentStep={2} />
        
        {/* Contenido principal */}
        <div className="px-4 md:px-6 pb-12">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Formulario - 2/3 del ancho en desktop */}
            <div className="md:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Datos del Proveedor</h2>
                
                {error && (
                  <div className="mb-6 p-3 bg-red-50 rounded-md border border-red-200">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <div className="mb-6 p-3 rounded-md text-center font-medium" style={{ background: colors.purple, color: colors.darkTeal }}>
                  Información de empresa: <span className="font-normal">Complete los datos de su negocio</span>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de la empresa:
                      </label>
                      <input 
                        type="text" 
                        name="nombre_empresa" 
                        value={formData.nombre_empresa} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nombre de su empresa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email de la empresa:
                      </label>
                      <input 
                        type="email" 
                        name="email_empresa" 
                        value={formData.email_empresa} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@empresa.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono de la empresa:
                      </label>
                      <input 
                        type="text" 
                        name="telefono_empresa" 
                        value={formData.telefono_empresa} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="000-000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de servicio:
                      </label>
                      <input 
                        type="text" 
                        name="tipo_servicio" 
                        value={formData.tipo_servicio} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Banquete, Decoración, Fotografía, Música, Coordinación..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de creación:
                      </label>
                      <input 
                        type="date" 
                        name="fecha_creacion" 
                        value={formData.fecha_creacion} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Redes sociales:
                      </label>
                      <input 
                        type="text" 
                        name="redes_sociales" 
                        value={formData.redes_sociales} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="LinkedIn, Instagram, Facebook..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección:
                    </label>
                    <input 
                      type="text" 
                      name="direccion" 
                      value={formData.direccion} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Dirección completa de la empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción:
                    </label>
                    <textarea 
                      name="descripcion" 
                      value={formData.descripcion} 
                      onChange={handleChange} 
                      required 
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describa brevemente su empresa y servicios..."
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50 text-[#012e33]"
                      style={{ background: colors.lightPink }}
                      onMouseOver={e => e.currentTarget.style.background = colors.pink}
                      onMouseOut={e => e.currentTarget.style.background = colors.lightPink}
                    >
                      {loading ? 'Procesando...' : 'Siguiente'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Panel informativo - 1/3 del ancho en desktop */}
            <div className="bg-gradient-to-br from-[#cbb4db] to-[#fbaccb] text-[#012e33] rounded-lg shadow-md overflow-hidden border border-[#cbb4db]">
              <div className="px-6 py-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.darkTeal }}>{proveedorInfo.titulo}</h3>
                <p className="mb-6 text-gray-800">{proveedorInfo.descripcion}</p>
                <h4 className="font-semibold mb-2 text-gray-800">Beneficios:</h4>
                <ul className="space-y-2 text-gray-800">
                  {proveedorInfo.beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-pink-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {beneficio}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-3 rounded-md" style={{ background: colors.purple }}>
                  <p className="text-sm text-gray-800">
                    Los datos de su empresa serán utilizados para crear su perfil de proveedor y mostrar sus servicios a clientes potenciales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatosProveedor;