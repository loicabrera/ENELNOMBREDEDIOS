import { 
  CheckCircleIcon,
  CreditCardIcon,
  CalendarIcon,
  ArrowPathIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useActiveBusiness } from '../context/ActiveBusinessContext.jsx';

const Membership = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const [showPlanChangeModal, setShowPlanChangeModal] = useState(false);
  const [planChangeDetails, setPlanChangeDetails] = useState(null);
  const [pendingPlanChange, setPendingPlanChange] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const { activeBusiness } = useActiveBusiness();

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        if (!isAuthenticated || !activeBusiness?.id) {
          setLoading(false);
          setError('Selecciona un negocio en la sección "Negocios" para ver la membresía.');
          return;
        }
        const proveedorId = activeBusiness.id;

        const membresiaResponse = await fetch(`https://spectacular-recreation-production.up.railway.app/membresia/${proveedorId}`, { credentials: 'include' });
        const membresiaData = await membresiaResponse.json();
        setCurrentPlan(membresiaData);

        fetch(`https://spectacular-recreation-production.up.railway.app/pagos/${proveedorId}`)
          .then(res => {
            if (!res.ok) {
              throw new Error('Error al obtener el historial de pagos');
            }
            return res.json();
          })
          .then(pagosData => {
            if (Array.isArray(pagosData)) {
              setPaymentHistory(pagosData);
            } else {
              console.error('Formato de datos de pagos inválido:', pagosData);
              setPaymentHistory([]);
            }
            setLoading(false);
          })
          .catch(err => {
            console.error('Error al obtener el historial de pagos:', err);
            setPaymentHistory([]);
            setLoading(false);
          });
      } catch (err) {
        console.error('Error al obtener datos de membresía:', err);
        setError('Error al obtener la información de la membresía');
        setLoading(false);
      }
    };

    fetchMembershipData();
  }, [navigate, isAuthenticated, user, activeBusiness]);

  const availablePlans = [
    {
      id: 1,
      name: 'Plan Básico',
      price: 'RD$2,000',
      period: 'mensual',
      features: [
        '3 publicaciones de servicios',
        '3 publicaciones de productos',
        'Hasta 8 fotos por servicio y producto',
        'Estadísticas básicas',
        'Soporte por email'
      ]
    },
    {
      id: 2,
      name: 'Plan Destacado',
      price: 'RD$4,000',
      period: 'mensual',
      features: [
        '6 publicaciones de servicios',
        '7 publicaciones de productos',
        'Hasta 15 fotos por servicio y producto',
        'Posición destacada en resultados de búsqueda por 7 días',
        '25% más de visibilidad que el plan básico',
        'Soporte prioritario'
      ]
    },
    {
      id: 3,
      name: 'Plan Premium',
      price: 'RD$8,000',
      period: 'mensual',
      features: [
        'Publicaciones ilimitadas de servicios y productos',
        'Hasta 25 fotos por servicio y producto',
        'Aparición en portada por 15 días',
        'Destacado permanente',
        'Posición premium en resultados de búsqueda',
        'Badge verificado en el perfil',
        'Estadísticas avanzadas de visitas y contactos',
        'Soporte 24/7'
      ]
    }
  ];

  const getStatusBadge = (estado) => {
    if (!estado) return null;
    switch (estado) {
      case 'activa':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Activa
          </span>
        );
      case 'por vencer':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            Por vencer
          </span>
        );
      case 'vencida':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Vencida
          </span>
        );
      default:
        return null;
    }
  };

  const handleRenewal = async () => {
    try {
      const proveedorId = currentPlan?.id_provedor || activeBusiness?.id;
      const membresiaBaseId = currentPlan?.MEMBRESIA_id_memebresia;
      const membresiaId = currentPlan?.id_prov_membresia || currentPlan?.id_membresia;
      const personaId = user?.personaId;
      const monto = currentPlan?.precio;
      const tipoPago = pendingPlanChange ? 'cambio_plan' : 'renovacion';
      
      if (!proveedorId || !membresiaId || !personaId || !monto || !membresiaBaseId) {
        setError('No se encontró la información necesaria para renovar la membresía.');
        return;
      }

      const paymentData = {
        monto: monto,
        fecha_pago: new Date().toISOString(),
        monto_pago: monto,
        MEMBRESIA_id_membresia: membresiaBaseId,
        provedor_negocio_id_provedor: proveedorId,
        PERSONA_id_persona: personaId,
        tipo_pago: tipoPago,
        estado: 'completado',
        esRegistroInicial: false
      };

      if (tipoPago === 'cambio_plan' && pendingPlanChange) {
        paymentData.plan_anterior = currentPlan?.nombre_pla;
        paymentData.plan_nuevo = pendingPlanChange.planName;
        paymentData.diferencia_precio = pendingPlanChange.amount;
      }

      const response = await fetch('https://spectacular-recreation-production.up.railway.app/registrar_pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Error al registrar el pago');
        return;
      }

      if (tipoPago === 'cambio_plan' && pendingPlanChange) {
        const planResponse = await fetch('https://spectacular-recreation-production.up.railway.app/cambiar_plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            proveedorId,
            planId: pendingPlanChange.newPlanId,
            currentPlanId: pendingPlanChange.currentPlanId,
            type: 'upgrade'
          }),
          credentials: 'include'
        });

        if (!planResponse.ok) {
          const errorData = await planResponse.json();
          setError(errorData.error || 'Error al cambiar el plan');
          return;
        }

        setPendingPlanChange(null);
      }

      setShowRenewalModal(false);
      
      const membresiaResponse = await fetch(`https://spectacular-recreation-production.up.railway.app/membresia/${proveedorId}`, { credentials: 'include' });
      const membresiaData = await membresiaResponse.json();
      setCurrentPlan(membresiaData);

      const pagosResponse = await fetch(`https://spectacular-recreation-production.up.railway.app/pagos/${proveedorId}`, { credentials: 'include' });
      const pagosData = await pagosResponse.json();
      setPaymentHistory(pagosData);

      setAlerta({ tipo: 'success', mensaje: tipoPago === 'cambio_plan' ? '¡Plan cambiado exitosamente!' : '¡Membresía renovada exitosamente!' });
    } catch (err) {
      setError(err.message || 'Error al procesar el pago');
    }
  };

  const handlePlanChange = async (newPlan) => {
    try {
      const currentPlanPrice = parseFloat(currentPlan.precio);
      const newPlanPrice = parseFloat(newPlan.price.replace('RD$', '').replace(',', ''));
      
      const planChangeInfo = {
        currentPlan: currentPlan,
        newPlan: newPlan,
        priceDifference: newPlanPrice - currentPlanPrice,
        requiresPayment: newPlanPrice > currentPlanPrice
      };

      setPlanChangeDetails(planChangeInfo);
      setShowPlanSelector(false);
      setShowPlanChangeModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmPlanChange = async () => {
    try {
      const proveedorId = activeBusiness?.id;

      if (!proveedorId) {
        setError('Error: No se pudo obtener la información del proveedor. Por favor, inicie sesión nuevamente.');
        setLoading(false);
        return;
      }
        
      if (planChangeDetails.requiresPayment) {
        const paymentData = {
          amount: planChangeDetails.priceDifference,
          planName: planChangeDetails.newPlan.name,
          type: 'plan_change',
          currentPlanId: planChangeDetails.currentPlan.id_prov_membresia,
          newPlanId: planChangeDetails.newPlan.id,
          proveedorId: proveedorId
        };
        setPendingPlanChange(paymentData);
        
        navigate('/pago-cambio-plan', { state: paymentData });
      } else {
        const response = await axios.post('https://spectacular-recreation-production.up.railway.app/cambiar_plan', {
          proveedorId,
          planId: planChangeDetails.newPlan.id,
          currentPlanId: planChangeDetails.currentPlan.id_prov_membresia,
          type: 'downgrade'
        }, { credentials: 'include' });
        
        if (response.data.success) {
          const membresiaResponse = await axios.get(`https://spectacular-recreation-production.up.railway.app/membresia/${proveedorId}`, { credentials: 'include' });
          setCurrentPlan(membresiaResponse.data);
          setShowPlanChangeModal(false);
          setAlerta({
            tipo: 'success',
            mensaje: 'Plan cambiado exitosamente. El nuevo precio se aplicará en tu próxima renovación.'
          });
        }
      }
    } catch (err) {
      setError(err.message);
      setAlerta({
        tipo: 'error',
        mensaje: 'Error al cambiar el plan'
      });
    }
  };

  const handleChangeEstado = async (nuevoEstado) => {
    try {
      const idMembresia = currentPlan?.id_prov_membresia;
      if (!idMembresia) return;
      await axios.put(`https://spectacular-recreation-production.up.railway.app/api/membresias/${idMembresia}/estado`, { estado: nuevoEstado });
      setAlerta({
        tipo: 'success',
        mensaje: `Membresía ${nuevoEstado === 'activa' ? 'activada' : 'inactivada'} correctamente` 
      });
      const membresiaResponse = await axios.get(`https://spectacular-recreation-production.up.railway.app/membresia/${currentPlan.id_provedor}`);
      setCurrentPlan(membresiaResponse.data);
    } catch (err) {
      setAlerta({ tipo: 'error', mensaje: 'Error al cambiar el estado de la membresía' });
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completado':
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Completado
          </span>
        );
      case 'pendiente':
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            Pendiente
          </span>
        );
      case 'fallido':
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Fallido
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status || 'Desconocido'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {alerta && (
        <div className={`p-4 mb-4 rounded ${alerta.tipo === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{alerta.mensaje}</div>
      )}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Plan Actual</h2>
            <p className="text-gray-600">Gestiona tu membresía y pagos</p>
          </div>
          {getStatusBadge(currentPlan?.estado)}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900">{currentPlan?.nombre_pla}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-blue-900">RD${currentPlan?.precio}</span>
              <span className="text-blue-600">/{currentPlan?.period}</span>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-blue-900 mb-2">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>Días restantes: {currentPlan?.dias_restantes}</span>
              </div>
              <div className="flex items-center text-blue-900">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span>Renovación automática: {currentPlan?.auto_renewal ? 'Activada' : 'Desactivada'}</span>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {currentPlan?.beneficios?.split(',').map((feature, index) => (
                <li key={index} className="flex items-center text-blue-900">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  {feature.trim()}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>Fecha de Inicio: {new Date(currentPlan?.fecha_inicio).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>Fecha de Vencimiento: {new Date(currentPlan?.fecha_fin).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowRenewalModal(true)}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Renovar Membresía
              </button>
              <button 
                onClick={() => setShowPlanSelector(true)}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                <CreditCardIcon className="w-5 h-5 mr-2" />
                Cambiar Plan
              </button>
              {currentPlan?.estado === 'activa' ? (
                <button
                  type="button"
                  onClick={() => handleChangeEstado('inactiva')}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <XCircleIcon className="w-5 h-5 mr-2" />
                  Inactivar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleChangeEstado('activa')}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Activar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Historial de Pagos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory && paymentHistory.length > 0 ? (
                paymentHistory.map((payment) => (
                  <tr key={payment.id_pago}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.fecha_pago).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      INV-{payment.id_pago.toString().padStart(6, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.nombre_pla || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.tipo_pago === 'cambio_plan' ? 'Cambio de Plan' : 'Renovación'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      RD${payment.monto || payment.monto_pago || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(payment.estado)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay historial de pagos disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showRenewalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Renovar Membresía</h3>
            <p className="text-gray-600 mb-4">
              ¿Deseas renovar tu membresía actual por otro período?
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Plan:</span>
                <span className="font-semibold">{currentPlan?.nombre_pla}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Precio:</span>
                <span className="font-semibold">RD${currentPlan?.precio}/{currentPlan?.period}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Nueva fecha de vencimiento:</span>
                <span className="font-semibold">
                  {new Date(new Date(currentPlan?.fecha_fin).setDate(new Date(currentPlan?.fecha_fin).getDate() + 30)).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button 
                onClick={() => setShowRenewalModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleRenewal}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirmar Renovación
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlanSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 overflow-y-auto">
          <div className="w-full min-h-screen sm:min-h-0 sm:h-auto bg-white sm:rounded-lg p-4 sm:p-6 max-w-6xl mx-auto my-0 sm:my-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Selecciona un nuevo plan</h3>
              <button
                onClick={() => setShowPlanSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {availablePlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`border ${currentPlan?.id_membresia === plan.id ? 'border-2 border-blue-600' : 'border-gray-200'} rounded-lg p-4 relative flex flex-col h-full`}
                >
                  {currentPlan?.id_membresia === plan.id && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg text-sm">
                      Actual
                    </div>
                  )}
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold">{plan.name}</h4>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-600 text-sm">
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    className={`w-full mt-3 px-4 py-2 rounded-lg ${
                      currentPlan?.id_membresia === plan.id
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={() => {
                      handlePlanChange(plan);
                      setShowPlanSelector(false);
                    }}
                    disabled={currentPlan?.id_membresia === plan.id}
                  >
                    {currentPlan?.id_membresia === plan.id ? 'Plan Actual' : 'Seleccionar'}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowPlanSelector(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlanChangeModal && planChangeDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 overflow-y-auto">
          <div className="w-full min-h-screen sm:min-h-0 sm:h-auto bg-white sm:rounded-lg p-4 sm:p-6 max-w-2xl mx-auto my-0 sm:my-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Confirmar cambio de plan</h3>
              <button
                onClick={() => setShowPlanChangeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Detalles del cambio</h4>
                <div className="space-y-2">
                  <p>Plan actual: <span className="font-medium">{planChangeDetails.currentPlan.nombre_pla}</span></p>
                  <p>Nuevo plan: <span className="font-medium">{planChangeDetails.newPlan.name}</span></p>
                  <p>Diferencia de precio: <span className="font-medium">RD${Math.abs(planChangeDetails.priceDifference).toLocaleString()}</span></p>
                </div>
              </div>

              {planChangeDetails.requiresPayment ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Pago requerido</h4>
                  <p className="text-blue-700">
                    Para cambiar a este plan, necesitas pagar la diferencia de RD${planChangeDetails.priceDifference.toLocaleString()}.
                    Serás redirigido al formulario de pago seguro.
                  </p>
                  <p className="text-blue-700 mt-2">
                    El cambio de plan se aplicará inmediatamente después del pago exitoso.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Información importante</h4>
                  <p className="text-yellow-700">
                    Al cambiar a un plan de menor costo, no se realizará ningún reembolso.
                    El nuevo precio se aplicará en tu próxima renovación mensual.
                  </p>
                  <p className="text-yellow-700 mt-2">
                    Tu plan actual seguirá activo hasta la fecha de renovación.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowPlanChangeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmPlanChange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {planChangeDetails.requiresPayment ? 'Proceder al pago' : 'Confirmar cambio'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Membership; 