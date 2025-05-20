import { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Requests = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');

  const requests = [
    {
      id: 1,
      user: 'María González',
      subject: 'Cotización para Boda',
      message: 'Hola, me gustaría obtener una cotización para una boda de 100 personas...',
      date: '2024-03-15 14:30',
      status: 'new',
      unread: true
    },
    {
      id: 2,
      user: 'Juan Pérez',
      subject: 'Evento Corporativo',
      message: 'Buenas tardes, estamos interesados en su servicio para un evento corporativo...',
      date: '2024-03-14 10:15',
      status: 'responded',
      unread: false
    },
    {
      id: 3,
      user: 'Ana Martínez',
      subject: 'Consulta sobre Menú',
      message: 'Me gustaría saber si tienen opciones vegetarianas en su menú...',
      date: '2024-03-13 16:45',
      status: 'closed',
      unread: false
    }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      new: 'bg-blue-100 text-blue-800',
      responded: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-gray-100 text-gray-800'
    };

    const statusIcons = {
      new: <ClockIcon className="w-4 h-4" />,
      responded: <ChatBubbleLeftRightIcon className="w-4 h-4" />,
      closed: <CheckCircleIcon className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {statusIcons[status]}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Requests List */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Solicitudes</h2>
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <FunnelIcon className="w-5 h-5" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={() => setFilter('all')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilter('new')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Nuevas
                </button>
                <button
                  onClick={() => setFilter('responded')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Respondidas
                </button>
                <button
                  onClick={() => setFilter('closed')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cerradas
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredRequests.map((request) => (
            <button
              key={request.id}
              onClick={() => setSelectedRequest(request)}
              className={`w-full p-4 text-left hover:bg-gray-50 ${
                selectedRequest?.id === request.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{request.user}</h3>
                  <p className="text-sm text-gray-500">{request.subject}</p>
                </div>
                {request.unread && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Nuevo
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600 truncate">{request.message}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">{request.date}</span>
                {getStatusBadge(request.status)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Request Detail */}
      <div className="flex-1 flex flex-col">
        {selectedRequest ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedRequest.subject}</h2>
                  <p className="text-sm text-gray-600">De: {selectedRequest.user}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm text-green-600 hover:text-green-700">
                    <CheckCircleIcon className="w-5 h-5" />
                  </button>
                  <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700">
                    <XCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-800">{selectedRequest.message}</p>
                <span className="text-xs text-gray-500 mt-2 block">{selectedRequest.date}</span>
              </div>
              {/* Conversation history would go here */}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Escribe tu respuesta..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Selecciona una solicitud para ver los detalles
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests; 