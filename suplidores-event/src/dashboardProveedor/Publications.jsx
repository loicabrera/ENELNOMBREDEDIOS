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
  const [publications, setPublications] = useState([
    {
      id: 1,
      title: "Servicio de Consultoría Empresarial",
      status: "published",
      date: "2024-03-15",
      views: 150,
      featured: false
    },
    {
      id: 2,
      title: "Asesoría Financiera Personal",
      status: "pending",
      date: "2024-03-14",
      views: 0,
      featured: false
    },
    {
      id: 3,
      title: "Planificación Estratégica",
      status: "draft",
      date: "2024-03-13",
      views: 0,
      featured: false
    }
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        icon: CheckCircleIcon,
        color: "bg-green-100 text-green-800",
        text: "Publicado"
      },
      pending: {
        icon: ClockIcon,
        color: "bg-yellow-100 text-yellow-800",
        text: "Pendiente"
      },
      draft: {
        icon: EyeIcon,
        color: "bg-gray-100 text-gray-800",
        text: "Borrador"
      },
      rejected: {
        icon: XCircleIcon,
        color: "bg-red-100 text-red-800",
        text: "Rechazado"
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-4 w-4 mr-1" />
        {config.text}
      </span>
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      setPublications(publications.filter(pub => pub.id !== id));
    }
  };

  const handleFeature = (id) => {
    setPublications(publications.map(pub => 
      pub.id === id ? { ...pub, featured: !pub.featured } : pub
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Publicaciones</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nueva Publicación
        </button>
      </div>

      {/* Publications List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((publication) => (
                <tr key={publication.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {publication.title}
                      </div>
                      {publication.featured && (
                        <StarIcon className="ml-2 h-5 w-5 text-yellow-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(publication.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(publication.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {publication.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleFeature(publication.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Destacar"
                      >
                        <StarIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(publication.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
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