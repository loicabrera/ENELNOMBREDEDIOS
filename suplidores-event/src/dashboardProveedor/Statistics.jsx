import { 
  ChartBarIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { useEffect } from 'react';

const Statistics = () => {
  // Mock data - replace with actual data from your backend
  const stats = {
    profileViews: {
      total: 1250,
      change: 12.5,
      trend: 'up'
    },
    publicationViews: {
      total: 3500,
      change: -5.2,
      trend: 'down'
    },
    contactClicks: {
      total: 450,
      change: 8.3,
      trend: 'up'
    },
    requests: {
      total: 180,
      change: 15.7,
      trend: 'up'
    }
  };

  const topPublications = [
    {
      id: 1,
      title: "Servicio de Consultoría Empresarial",
      views: 850,
      clicks: 120,
      conversion: "14.1%"
    },
    {
      id: 2,
      title: "Asesoría Financiera Personal",
      views: 620,
      clicks: 85,
      conversion: "13.7%"
    },
    {
      id: 3,
      title: "Planificación Estratégica",
      views: 480,
      clicks: 65,
      conversion: "13.5%"
    }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? (
      <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
    );
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }
    // Obtener el negocio activo
    const negocioActivoId = localStorage.getItem('negocio_activo');
    fetch('https://spectacular-recreation-production.up.railway.app/proveedores')
      .then(res => res.json())
      .then(data => {
        let prov;
        if (negocioActivoId) {
          prov = data.find(p => p.id_provedor === Number(negocioActivoId));
        }
        if (!prov) {
          prov = data.find(p => p.PERSONA_id_persona === user.PERSONA_id_persona);
        }
        if (!prov) {
          // Manejar error si no hay proveedor
          return;
        }
        // Aquí continúa tu lógica de estadísticas usando prov.id_provedor
        // ...
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Estadísticas</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <EyeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vistas del Perfil</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.profileViews.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats.profileViews.trend)}
            <span className={`ml-2 text-sm font-medium ${getTrendColor(stats.profileViews.trend)}`}>
              {stats.profileViews.change}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vistas de Publicaciones</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.publicationViews.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats.publicationViews.trend)}
            <span className={`ml-2 text-sm font-medium ${getTrendColor(stats.publicationViews.trend)}`}>
              {stats.publicationViews.change}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clics en Contacto</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.contactClicks.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats.contactClicks.trend)}
            <span className={`ml-2 text-sm font-medium ${getTrendColor(stats.contactClicks.trend)}`}>
              {stats.contactClicks.change}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <UserGroupIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Solicitudes Recibidas</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.requests.total}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats.requests.trend)}
            <span className={`ml-2 text-sm font-medium ${getTrendColor(stats.requests.trend)}`}>
              {stats.requests.change}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs mes anterior</span>
          </div>
        </div>
      </div>

      {/* Top Publications */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Publicaciones más Populares</h2>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {publication.title}
                      </div>
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
      </div>

      {/* Category Ranking */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Ranking en Categoría</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Posición actual</p>
            <p className="text-3xl font-bold text-gray-900">#3</p>
            <p className="text-sm text-gray-500">de 45 proveedores</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Puntuación</p>
            <p className="text-3xl font-bold text-gray-900">4.8/5.0</p>
            <p className="text-sm text-green-600">+0.2 este mes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 