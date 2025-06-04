import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ChartBarIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.personaId) {
        setError('No se encontró el ID del proveedor');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://spectacular-recreation-production.up.railway.app/api/statistics/${user.personaId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error al obtener estadísticas');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

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

  // Mock data - replace with actual data from your backend
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
              <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats.totalViews > 0 ? 'up' : 'down')}
            <span className={`ml-2 text-sm font-medium ${stats.totalViews > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalViews > 0 ? '+' : ''}
              {stats.totalViews}%
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
              <p className="text-2xl font-semibold text-gray-900">{stats.totalLikes}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats.totalLikes > 0 ? 'up' : 'down')}
            <span className={`ml-2 text-sm font-medium ${stats.totalLikes > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalLikes > 0 ? '+' : ''}
              {stats.totalLikes}%
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
              <p className="text-2xl font-semibold text-gray-900">{stats.totalComments}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats.totalComments > 0 ? 'up' : 'down')}
            <span className={`ml-2 text-sm font-medium ${stats.totalComments > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalComments > 0 ? '+' : ''}
              {stats.totalComments}%
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
              <p className="text-2xl font-semibold text-gray-900">{stats.totalShares}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getTrendIcon(stats.totalShares > 0 ? 'up' : 'down')}
            <span className={`ml-2 text-sm font-medium ${stats.totalShares > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalShares > 0 ? '+' : ''}
              {stats.totalShares}%
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