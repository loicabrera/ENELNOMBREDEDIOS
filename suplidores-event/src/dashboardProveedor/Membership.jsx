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

const Membership = () => {
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const proveedorId = localStorage.getItem('provedor_negocio_id_provedor');
        if (!proveedorId) {
          throw new Error('No se encontró el ID del proveedor');
        }

        // Obtener la membresía actual del proveedor
        const membresiaResponse = await axios.get(`http://localhost:3000/membresia/${proveedorId}`);
        setCurrentPlan(membresiaResponse.data);

        // Obtener el historial de pagos
        const pagosResponse = await axios.get(`http://localhost:3000/pagos/${proveedorId}`);
        setPaymentHistory(pagosResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipData();
  }, []);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Activo
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Expirado
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            Pendiente
          </span>
        );
      default:
        return null;
    }
  };

  const handleRenewal = async () => {
    try {
      const proveedorId = localStorage.getItem('provedor_negocio_id_provedor');
      const response = await axios.post('http://localhost:3000/renovar_membresia', {
        proveedorId,
        planId: currentPlan.id_membresia
      });
      
      if (response.data.success) {
        setShowRenewalModal(false);
        // Actualizar los datos de la membresía
        const membresiaResponse = await axios.get(`http://localhost:3000/membresia/${proveedorId}`);
        setCurrentPlan(membresiaResponse.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePlanChange = async (newPlan) => {
    try {
      const proveedorId = localStorage.getItem('provedor_negocio_id_provedor');
      const response = await axios.post('http://localhost:3000/cambiar_plan', {
        proveedorId,
        planId: newPlan.id
      });
      
      if (response.data.success) {
        // Actualizar los datos de la membresía
        const membresiaResponse = await axios.get(`http://localhost:3000/membresia/${proveedorId}`);
        setCurrentPlan(membresiaResponse.data);
      }
    } catch (err) {
      setError(err.message);
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
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Plan Actual</h2>
            <p className="text-gray-600">Gestiona tu membresía y pagos</p>
          </div>
          {getStatusBadge(currentPlan?.status)}
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
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
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
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id_pago}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.fecha_pago).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    INV-{payment.id_pago.toString().padStart(6, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Renovación {currentPlan?.nombre_pla}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    RD${payment.monto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <CreditCardIcon className="w-5 h-5 mr-2 text-gray-400" />
                      Tarjeta de Crédito
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renewal Modal */}
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

      {/* Modal de selección de planes */}
      {showPlanSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Selecciona un nuevo plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`border ${currentPlan?.id_membresia === plan.id ? 'border-2 border-blue-600' : 'border-gray-200'} rounded-lg p-6 relative`}
                >
                  {currentPlan?.id_membresia === plan.id && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg text-sm">
                      Actual
                    </div>
                  )}
                  <h4 className="text-lg font-semibold">{plan.name}</h4>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`w-full mt-4 px-4 py-2 rounded-lg ${
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
            <div className="mt-6 flex justify-end">
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
    </div>
  );
};

export default Membership; 