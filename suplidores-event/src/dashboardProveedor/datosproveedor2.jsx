import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [personaId, setPersonaId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [proveedorCreado, setProveedorCreado] = useState(null);
  const [providerData, setProviderData] = useState(null);
  const [mainBusinessPlanDetails, setMainBusinessPlanDetails] = useState(null);

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

  // Verificar si tenemos el ID de la persona y el plan seleccionado (o si es flujo agregar nuevo negocio)
  useEffect(() => {
    console.log('DatosProveedor2 useEffect: Iniciando validación de estado.');
    console.log('DatosProveedor2 useEffect: location.state:', location.state);
    console.log('DatosProveedor2 useEffect: planes object:', planes);

    const id = location.state?.id_persona;
    const plan = location.state?.plan;
    const isAddingNewBusiness = location.state?.isAddingNewBusiness;
    
    if (!id) {
      console.error('No se encontró el ID de la persona en el estado. Redirigiendo.');
      setError('No se encontró el ID de la persona. Por favor, registre sus datos personales primero.');
      navigate('/datospersonas');
      return; // Salir temprano si falta el ID de persona
    } else {
      setPersonaId(id);
    }

    // Validar el plan SOLO si NO es el flujo de agregar un nuevo negocio adicional
    if (!isAddingNewBusiness) {
      console.log('Flujo de registro inicial o desconocido: Validando plan.');
      if (!planes || !plan || !planes[plan]) {
         console.error('Datos de plan faltantes o inválidos en el estado. Redirigiendo.', { plan, planes });
        setError('No se encontró el plan seleccionado. Por favor, seleccione un plan válido.');
        navigate('/');
        return; // Salir temprano si falta el plan
      }
    } else {
        console.log('Flujo de agregar nuevo negocio: Omitiendo validación de plan del state.');
    }

    // Refuerzo: Si NO es el flujo de registro inicial, asegúrate de que el modal no se muestre
    if (!location.state?.fromRegistro) {
      setShowConfirmation(false);
      setProveedorCreado(null);
    }
  }, [location.state, navigate, planes]);

  // Nuevo useEffect para obtener los detalles del plan del negocio principal si se agrega uno nuevo
  useEffect(() => {
    const fetchMainBusinessPlan = async () => {
       console.log('fetchMainBusinessPlan useEffect: Iniciando.');
       // Solo ejecutar si está autenticado, es un proveedor, es el flujo de agregar nuevo negocio, y tenemos el provedorId
      if (isAuthenticated && user?.provedorId && location.state?.isAddingNewBusiness) {
         console.log('fetchMainBusinessPlan useEffect: Fetching membresia para provedorId:', user.provedorId);
        try {
          const response = await fetch(`https://spectacular-recreation-production.up.railway.app/membresia/${user.provedorId}`, {
            credentials: 'include'
          });

          if (!response.ok) {
             // Si no hay membresía activa para el proveedor principal (ej: acaba de registrarse y no pagó?),
             // podrías redirigir a seleccionar plan o mostrar un error.
             // Por ahora, solo logueamos y no establecemos planDetails, lo que podría causar un error más adelante en handleSubmit si no se maneja.
             console.warn('No se encontró membresía activa para el provedor principal o error al obtenerla.', response.status);
             // Podrías manejar este caso redirigiendo o mostrando un mensaje.
             // navigate('/dashboard-proveedor/agregar-negocio/seleccionar-plan', { state: { id_persona: user.personaId, isAddingNewBusiness: true, error: 'Necesitas una membresía activa para agregar otro negocio.' }});
             return; 
          }

          const data = await response.json();
          console.log('Detalles de membresía del provedor principal recibidos:', data);
          // Asumiendo que la respuesta contiene nombre_pla y precio
          if (data?.nombre_pla && data?.precio) {
            setMainBusinessPlanDetails({ name: data.nombre_pla, amount: data.precio });
             console.log('Detalles del plan principal establecidos.', { name: data.nombre_pla, amount: data.precio });
          } else {
              console.warn('La respuesta de membresía no contiene nombre_pla o precio esperados.', data);
               // Manejar caso donde la membresía no tiene los campos esperados
               // Podrías redirigir o mostrar un error.
               // navigate('/dashboard-proveedor/agregar-negocio/seleccionar-plan', { state: { id_persona: user.personaId, isAddingNewBusiness: true, error: 'Error al obtener detalles del plan principal.' }});
          }

        } catch (err) {
          console.error('Error al obtener membresía del provedor principal:', err);
          setError('Error al obtener los detalles de tu plan principal.');
           // Podrías redirigir o mostrar un error.
           // navigate('/dashboard-proveedor/agregar-negocio/seleccionar-plan', { state: { id_persona: user.personaId, isAddingNewBusiness: true, error: 'Error en la red al obtener detalles del plan principal.' }});
        } finally {
            // Aunque no seteamos loading aquí, podrías necesitar manejar un estado de loading separado para esta llamada.
        }
      } else {
         console.log('fetchMainBusinessPlan useEffect: Condiciones no cumplidas.', { isAuthenticated, user: user?.provedorId, isAddingNewBusiness: location.state?.isAddingNewBusiness });
      }
    };

    fetchMainBusinessPlan();
  }, [isAuthenticated, user?.provedorId, location.state?.isAddingNewBusiness, navigate]); // Dependencias relevantes

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!isAuthenticated || !user?.personaId) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`https://spectacular-recreation-production.up.railway.app/api/providers/${user.personaId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error al obtener datos del proveedor');
        }

        const data = await response.json();
        setProviderData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [user, isAuthenticated, navigate]);

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
    if (!formData.direccion || !formData.direccion.trim()) {
      setError('La dirección es requerida');
      return false;
    }
    if (!formData.descripcion || !formData.descripcion.trim()) {
      setError('La descripción es requerida');
      return false;
    }
    if (!formData.redes_sociales || !formData.redes_sociales.trim()) {
      setError('Las redes sociales son requeridas');
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

      if (data.proveedor && data.proveedor.id_provedor) {
        // localStorage.setItem('provedor_negocio_id_proveedor', data.proveedor.id_provedor);
      }

      return data.proveedor;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      setError(error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!validarFormulario()) {
        setLoading(false);
        return;
      }

      const nuevoProveedor = await insertarDatos();

      if (nuevoProveedor && nuevoProveedor.id_provedor) {
        const plan = location.state?.plan;
        const planInfo = planes[plan];
        const isAddingNewBusiness = location.state?.isAddingNewBusiness;

        // Determinar los detalles del plan y el provedorId objetivo para el pago
        let paymentAmount = null;
        let paymentPlanName = null;
        let targetProveedorId = null;

        if (isAddingNewBusiness) {
           // Flujo de agregar nuevo negocio: usar detalles del plan principal y el ID del nuevo negocio
           console.log('handleSubmit: Flujo agregar nuevo negocio. Usando detalles del plan principal.');
           if (!mainBusinessPlanDetails) {
              // Esto no debería ocurrir si el fetchMainBusinessPlan tuvo éxito, pero lo manejamos por seguridad.
               console.error('handleSubmit: Detalles del plan principal no disponibles.');
               setError('No se pudieron obtener los detalles de tu plan principal para el pago.');
               setLoading(false);
               // Podrías redirigir de vuelta a Mis Negocios o a la selección de plan si decides reintroducirla como fallback.
               // navigate('/dashboard-proveedor/negocios');
               return;
           }
           paymentAmount = mainBusinessPlanDetails.amount;
           paymentPlanName = mainBusinessPlanDetails.name;
           targetProveedorId = nuevoProveedor.id_provedor; // El ID del NUEVO negocio creado
           console.log('handleSubmit: Datos para pago de nuevo negocio:', { paymentAmount, paymentPlanName, targetProveedorId });

        } else if (location.state?.fromRegistro) {
           // Flujo de registro inicial: usar detalles del plan del state y *asociar al primer negocio encontrado para la persona* en el backend /api/pago (manejo en backend)
           console.log('handleSubmit: Flujo de registro inicial. Usando detalles del plan del state.');
           if (!planInfo) {
                console.error('handleSubmit: PlanInfo no disponible para registro inicial.', { plan, planes });
                 setError('Error interno: Información del plan no disponible.');
                 setLoading(false);
                 // navigate('/'); // Redirigir si falta información crítica
                 return;
           }
           paymentAmount = planInfo.monto; // Usar el monto del state (originalmente pasado desde la selección de plan de registro)
           paymentPlanName = planInfo.nombre;
           // En este flujo, no pasamos provedorId al /api/pago, el backend lo busca por personaId.
           targetProveedorId = undefined; // No pasar provedorId explícitamente en este flujo
            console.log('handleSubmit: Datos para pago de registro inicial:', { paymentAmount, paymentPlanName, targetProveedorId });

        } else {
           // Caso inesperado
           console.warn('handleSubmit: Flujo desconocido. Redirigiendo.', location.state);
           setError('Error interno: Flujo de formulario desconocido.');
           setLoading(false);
           // navigate('/dashboard-proveedor/negocios');
           return;
        }

        // Verificar que tenemos datos de pago válidos antes de redirigir
        if (paymentAmount === null || paymentPlanName === null) {
             console.error('handleSubmit: Datos de pago nulos antes de redirigir.', { paymentAmount, paymentPlanName });
             setError('Error interno: No se pudieron determinar los detalles del pago.');
             setLoading(false);
             // navigate('/dashboard-proveedor/negocios');
             return;
        }

        // Construir el objeto paymentData para la navegación
        const paymentData = {
             amount: paymentAmount,
             planName: paymentPlanName,
             isNewBusiness: isAddingNewBusiness, // Pasar la bandera original
             businessName: nuevoProveedor.nombre_empresa,
             // Solo incluir proveedorId si se determinó (para el flujo de agregar nuevo negocio)
             ...(targetProveedorId && { proveedorId: targetProveedorId }),
             personaId: personaId // Asegúrate de que personaId está disponible
        };

        console.log('Redirigiendo a pago con datos:', paymentData);
        navigate('/pago-nuevo-negocio', { 
          state: paymentData
        });

      } else if (nuevoProveedor === null) {
         // insertarDatos falló y retornó null (ya maneja el setError interno)
         // No hacemos nada aquí, el error ya está seteado y loading es false.
      } else {
         // Esto podría ocurrir si insertarDatos tuvo éxito pero no devolvió el objeto proveedor como esperaba.
         console.error('insertarDatos tuvo éxito pero no retornó el objeto proveedor.', nuevoProveedor);
         setError('Error interno al obtener los datos del negocio creado.');
      }

    } catch (error) {
      console.error('Error en el envío del formulario:', error);
      setError('Error al procesar el formulario');
    } finally {
      setLoading(false);
    }
  };

  // Nuevo formulario para agregar negocio adicional
  const handleSubmitAdditionalBusiness = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!validarFormulario()) {
        setLoading(false);
        return;
      }

      const success = await insertarDatos();
      if (success) {
        const plan = location.state?.plan;
        const planInfo = planes[plan];
        // Siempre ir al pago sin mostrar el modal
        const paymentData = {
          amount: planInfo.monto,
          planName: planInfo.nombre,
          isNewBusiness: true,
          businessName: formData.nombre_empresa,
          proveedorId: localStorage.getItem('provedor_negocio_id_provedor')
        };
        console.log('Redirigiendo con datos:', paymentData);
        navigate('/pago-nuevo-negocio', { 
          state: paymentData
        });
      }
    } catch (error) {
      console.error('Error en el envío:', error);
      setError('Error al procesar el formulario');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = () => {
    const plan = location.state?.plan;
    const planInfo = planes[plan];
    navigate('/pago-nuevo-negocio', { 
      state: { 
        amount: planInfo.monto,
        planName: planInfo.nombre,
        isNewBusiness: true,
        businessName: formData.nombre_empresa,
        proveedorId: localStorage.getItem('provedor_negocio_id_provedor')
      } 
    });
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?.personaId) return;

    try {
      const response = await fetch(`https://spectacular-recreation-production.up.railway.app/api/providers/${user.personaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al actualizar datos');
      }

      const updatedData = await response.json();
      setProviderData(updatedData);
      alert('Datos actualizados correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!providerData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No se encontraron datos del proveedor.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botón de volver */}
      <div className="max-w-5xl mx-auto pt-6 px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#012e33] hover:text-[#fbaccb] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>
      </div>

      {/* Contenedor principal */}
      <div className="max-w-5xl mx-auto">
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
                
                {location.state?.fromRegistro ? (
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
                ) : (
                  <form onSubmit={handleSubmitAdditionalBusiness} className="space-y-6">
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
                )}
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

      {/* Modal de confirmación */}
      {showConfirmation && proveedorCreado && location.state?.fromRegistro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#012e33] mb-4">Confirmar Pago</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Estás a punto de realizar el pago para activar tu nuevo negocio:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-[#012e33]">{proveedorCreado.nombre_empresa}</p>
                <p className="text-gray-600">Plan: {proveedorCreado.plan.nombre}</p>
                <p className="text-gray-600">Monto: ${proveedorCreado.plan.monto}</p>
              </div>
              <p className="text-sm text-gray-600">
                Al completar el pago, podrás gestionar este negocio desde tu panel de control.
              </p>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 border-2 border-[#012e33] text-[#012e33] rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="flex-1 px-4 py-2 bg-[#012e33] text-white rounded-lg hover:bg-[#fbaccb]"
                >
                  Proceder al Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatosProveedor;