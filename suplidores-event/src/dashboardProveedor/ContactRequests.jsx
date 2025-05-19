import { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const ContactRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      userName: "Juan Pérez",
      message: "Me gustaría obtener más información sobre sus servicios de consultoría.",
      contact: "juan@email.com",
      date: "2024-03-15",
      status: "new",
      conversation: [
        {
          id: 1,
          sender: "user",
          message: "Me gustaría obtener más información sobre sus servicios de consultoría.",
          date: "2024-03-15 10:30"
        }
      ]
    },
    {
      id: 2,
      userName: "María García",
      message: "¿Podrían enviarme una cotización para servicios de asesoría financiera?",
      contact: "+1 234 567 890",
      date: "2024-03-14",
      status: "responded",
      conversation: [
        {
          id: 1,
          sender: "user",
          message: "¿Podrían enviarme una cotización para servicios de asesoría financiera?",
          date: "2024-03-14 15:45"
        },
        {
          id: 2,
          sender: "provider",
          message: "Por supuesto, le enviaré la cotización en las próximas horas.",
          date: "2024-03-14 16:00"
        }
      ]
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: {
        icon: ClockIcon,
        color: "bg-blue-100 text-blue-800",
        text: "Nuevo"
      },
      responded: {
        icon: ChatBubbleLeftRightIcon,
        color: "bg-green-100 text-green-800",
        text: "Respondido"
      },
      closed: {
        icon: CheckCircleIcon,
        color: "bg-gray-100 text-gray-800",
        text: "Cerrado"
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

  const handleStatusChange = (id, newStatus) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    ));
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    const newMessage = {
      id: selectedRequest.conversation.length + 1,
      sender: "provider",
      message: replyMessage,
      date: new Date().toLocaleString()
    };

    setRequests(requests.map(request => 
      request.id === selectedRequest.id 
        ? { 
            ...request, 
            conversation: [...request.conversation, newMessage],
            status: "responded"
          }
        : request
    ));

    setReplyMessage("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Solicitudes de Contacto</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-800">Bandeja de Entrada</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {requests.map((request) => (
              <div
                key={request.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedRequest?.id === request.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{request.userName}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{request.message}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(request.date).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-500">{request.contact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation View */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          {selectedRequest ? (
            <>
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-800">
                    Conversación con {selectedRequest.userName}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, "responded")}
                      className="text-green-600 hover:text-green-900"
                      title="Marcar como respondido"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, "closed")}
                      className="text-gray-600 hover:text-gray-900"
                      title="Cerrar conversación"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                {selectedRequest.conversation.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "provider" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "provider"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs mt-1 text-gray-500">
                        {new Date(message.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <form onSubmit={handleReply} className="flex space-x-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Selecciona una conversación para ver los detalles
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactRequests; 