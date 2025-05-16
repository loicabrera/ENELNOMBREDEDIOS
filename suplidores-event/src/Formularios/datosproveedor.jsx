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
  error: '#ff6b6b',
};

const DatosProveedor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verificar si tenemos el ID de la persona
  React.useEffect(() => {
    const personaId = location.state?.formData?.id_persona;
    if (!personaId) {
      setError('No se encontró el ID de la persona. Por favor, registre sus datos personales primero.');
      // Opcional: redirigir a la página de datos personales
      // navigate('/registro/persona');
    }
  }, [location.state]);

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
      // Obtener el ID de la persona del estado de navegación
      const personaId = location.state?.formData?.id_persona;
      if (!personaId) {
        throw new Error('No se encontró el ID de la persona registrada');
      }

      console.log('Enviando datos al servidor:', {
        ...formData,
        p_e_r_s_o_n_a_id_persona: personaId
      });

      const response = await fetch('http://localhost:3000/crear_proveedores', {
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
    setError(null);
    setLoading(true);

    try {
      if (!validarFormulario()) {
        setLoading(false);
        return;
      }

      const success = await insertarDatos();
      if (success) {
        navigate('/registro/confirmacion', { state: { formData } });
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
        <ProgressBar currentStep={1} />
        
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

                <div className="mb-6 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-blue-700">
                    <span className="font-semibold">Información de empresa:</span> Complete los datos de su negocio
                  </p>
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
                        placeholder="Ej: Consultoría, Retail, Servicios"
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
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out disabled:opacity-50"
                    >
                      {loading ? 'Procesando...' : 'Siguiente'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Panel informativo - 1/3 del ancho en desktop */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-6">
                <h3 className="text-xl font-bold mb-4">{proveedorInfo.titulo}</h3>
                <p className="mb-6 text-blue-100">{proveedorInfo.descripcion}</p>
                
                <h4 className="font-semibold text-white mb-2">Beneficios:</h4>
                <ul className="space-y-2 text-blue-100">
                  {proveedorInfo.beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-blue-200 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {beneficio}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 p-3 bg-blue-600 rounded-md">
                  <p className="text-sm text-blue-100">
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