import { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  StarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Publications = () => {
  const [publications] = useState([
    {
      id: 1,
      title: 'Servicio de Catering para Eventos Corporativos',
      status: 'published',
      date: '2024-03-15',
      views: 245,
      featured: true
    },
    {
      id: 2,
      title: 'Buffet para Bodas y Eventos Sociales',
      status: 'pending',
      date: '2024-03-14',
      views: 0,
      featured: false
    },
    {
      id: 3,
      title: 'Servicio de Coctelería Profesional',
      status: 'draft',
      date: '2024-03-13',
      views: 0,
      featured: false
    },
    {
      id: 4,
      title: 'Menú Degustación para Eventos Especiales',
      status: 'rejected',
      date: '2024-03-12',
      views: 0,
      featured: false
    }
  ]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      published: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const statusIcons = {
      published: <CheckCircleIcon className="w-4 h-4" />,
      pending: <ClockIcon className="w-4 h-4" />,
      draft: <EyeIcon className="w-4 h-4" />,
      rejected: <XCircleIcon className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {statusIcons[status]}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Publicaciones</h2>
          <p className="text-gray-600">Gestiona tus publicaciones y servicios</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon className="w-5 h-5 mr-2" />
          Nueva Publicación
        </button>
      </div>

      {/* Publications List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vistas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destacado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((publication) => (
                <tr key={publication.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {publication.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(publication.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {publication.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {publication.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {publication.featured ? (
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <StarIcon className="w-5 h-5 text-gray-300" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Membership Limit Warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <StarIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Has alcanzado el límite de publicaciones para tu plan actual. 
              <a href="#" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                Actualiza tu plan
              </a>
              para publicar más.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publications; 