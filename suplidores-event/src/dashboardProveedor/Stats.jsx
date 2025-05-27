import {
  ChartBarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon,
  PhotoIcon,
  ClockIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const Stats = () => {
  const metrics = [
    {
      name: 'Visitas al Perfil',
      value: '1,234',
      change: '+12.3%',
      trend: 'up',
      icon: ChartBarIcon
    },
    {
      name: 'Vistas de Publicaciones',
      value: '5,678',
      change: '+8.1%',
      trend: 'up',
      icon: EyeIcon
    },
    {
      name: 'Clics en Contacto',
      value: '234',
      change: '-2.4%',
      trend: 'down',
      icon: CursorArrowRaysIcon
    },
    {
      name: 'Solicitudes Recibidas',
      value: '45',
      change: '+15.7%',
      trend: 'up',
      icon: ChatBubbleLeftRightIcon
    }
  ];

  const topPublications = [
    {
      id: 1,
      title: 'Servicios de Catering Premium',
      views: 1234,
      clicks: 234,
      conversion: '18.9%'
    },
    {
      id: 2,
      title: 'Decoración para Eventos',
      views: 987,
      clicks: 156,
      conversion: '15.8%'
    },
    {
      id: 3,
      title: 'Fotografía Profesional',
      views: 876,
      clicks: 98,
      conversion: '11.2%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold">Estadísticas</h2>
        <p className="text-gray-600">Métricas de rendimiento y análisis</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-50 rounded-lg">
                <metric.icon className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                )}
                {metric.change}
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-bold">{metric.value}</h3>
            <p className="text-gray-600">{metric.name}</p>
          </div>
        ))}
      </div>

      {/* Top Publications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Publicaciones más Populares</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vistas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversión
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPublications.map((publication) => (
                <tr key={publication.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {publication.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {publication.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {publication.clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {publication.conversion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Ranking */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Ranking en Categoría</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <StarIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium">Catering y Eventos</h4>
              <p className="text-gray-600">Posición actual: #3</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">4.8</div>
            <div className="text-sm text-gray-600">de 5.0</div>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Consejos para Mejorar</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 bg-green-50 rounded-lg">
              <PhotoIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <h4 className="font-medium">Actualiza tus Fotos</h4>
              <p className="text-gray-600">Las publicaciones con fotos de alta calidad tienen un 40% más de interacciones.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="font-medium">Responde Rápidamente</h4>
              <p className="text-gray-600">Los proveedores que responden en menos de 1 hora tienen un 60% más de conversiones.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-2 bg-purple-50 rounded-lg">
              <ChatBubbleLeftIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <h4 className="font-medium">Mantén tu Perfil Actualizado</h4>
              <p className="text-gray-600">Los perfiles actualizados regularmente reciben un 30% más de visitas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats; 