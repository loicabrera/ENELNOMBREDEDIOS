import { 
  CheckCircleIcon,
  CreditCardIcon,
  CalendarIcon,
  ChartBarIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Membership = () => {
  // Mock data - replace with actual data from your backend
  const currentPlan = {
    name: "Premium",
    price: "RD$ 1,999",
    period: "mensual",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
    benefits: [
      "Publicaciones ilimitadas",
      "Estadísticas avanzadas",
      "Soporte prioritario",
      "Perfil destacado",
      "Mensajes ilimitados"
    ],
    features: {
      publications: "Ilimitadas",
      views: "Estadísticas detalladas",
      support: "24/7",
      profile: "Destacado",
      messages: "Ilimitados"
    }
  };

  const plans = [
    {
      name: "Básico",
      price: "RD$ 499",
      period: "mensual",
      features: {
        publications: "5 publicaciones",
        views: "Estadísticas básicas",
        support: "Email",
        profile: "Estándar",
        messages: "50 mensajes"
      }
    },
    {
      name: "Premium",
      price: "RD$ 1,999",
      period: "mensual",
      features: {
        publications: "Ilimitadas",
        views: "Estadísticas detalladas",
        support: "24/7",
        profile: "Destacado",
        messages: "Ilimitados"
      },
      current: true
    },
    {
      name: "Enterprise",
      price: "RD$ 4,999",
      period: "mensual",
      features: {
        publications: "Ilimitadas",
        views: "API + Estadísticas",
        support: "Dedicado",
        profile: "VIP",
        messages: "Ilimitados"
      }
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800",
        text: "Activo"
      },
      expired: {
        color: "bg-red-100 text-red-800",
        text: "Expirado"
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Pendiente"
      }
    };

    const config = statusConfig[status];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Membresía y Plan</h1>

      {/* Current Plan Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Plan Actual</h2>
              <p className="text-gray-600 mt-1">Plan {currentPlan.name}</p>
            </div>
            {getStatusBadge(currentPlan.status)}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">Precio: {currentPlan.price}/{currentPlan.period}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Válido hasta: {new Date(currentPlan.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Beneficios Incluidos</h3>
              <ul className="space-y-2">
                {currentPlan.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Planes Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-6 ${
                  plan.current ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{plan.price}</p>
                  <p className="text-sm text-gray-500">/{plan.period}</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{plan.features.publications}</span>
                  </div>
                  <div className="flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{plan.features.views}</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{plan.features.support}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                      plan.current
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Plan Actual' : 'Cambiar a este Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Historial de Pagos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2024-01-01
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Premium
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    RD$ 1,999
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge('active')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership; 