import { 
  CheckCircleIcon,
  CreditCardIcon,
  CalendarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Membership = () => {
  const currentPlan = {
    name: 'Premium',
    price: '$99.99',
    period: 'mensual',
    features: [
      'Hasta 20 publicaciones activas',
      'Estadísticas avanzadas',
      'Soporte prioritario',
      'Publicaciones destacadas',
      'Perfil verificado'
    ],
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    status: 'active'
  };

  const paymentHistory = [
    {
      id: 1,
      date: '2024-02-15',
      amount: '$99.99',
      method: 'Tarjeta de Crédito',
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-15',
      amount: '$99.99',
      method: 'Tarjeta de Crédito',
      status: 'completed'
    },
    {
      id: 3,
      date: '2023-12-15',
      amount: '$99.99',
      method: 'Tarjeta de Crédito',
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Plan Actual</h2>
            <p className="text-gray-600">Gestiona tu membresía y pagos</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Activo
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900">{currentPlan.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold text-blue-900">{currentPlan.price}</span>
              <span className="text-blue-600">/{currentPlan.period}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-blue-900">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-blue-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>Fecha de Inicio: {currentPlan.startDate}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>Fecha de Vencimiento: {currentPlan.endDate}</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Renovar Membresía
            </button>
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
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <CreditCardIcon className="w-5 h-5 mr-2 text-gray-400" />
                      {payment.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Completado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Planes Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Plan */}
          <div className="border rounded-lg p-6">
            <h4 className="text-lg font-semibold">Básico</h4>
            <div className="mt-2">
              <span className="text-2xl font-bold">$29.99</span>
              <span className="text-gray-600">/mes</span>
            </div>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                5 publicaciones
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                Estadísticas básicas
              </li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Seleccionar
            </button>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-blue-600 rounded-lg p-6 relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg text-sm">
              Actual
            </div>
            <h4 className="text-lg font-semibold">Premium</h4>
            <div className="mt-2">
              <span className="text-2xl font-bold">$99.99</span>
              <span className="text-gray-600">/mes</span>
            </div>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                20 publicaciones
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                Estadísticas avanzadas
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                Soporte prioritario
              </li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Plan Actual
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="border rounded-lg p-6">
            <h4 className="text-lg font-semibold">Empresarial</h4>
            <div className="mt-2">
              <span className="text-2xl font-bold">$199.99</span>
              <span className="text-gray-600">/mes</span>
            </div>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                Publicaciones ilimitadas
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                Estadísticas premium
              </li>
              <li className="flex items-center text-gray-600">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                Soporte 24/7
              </li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Seleccionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership; 