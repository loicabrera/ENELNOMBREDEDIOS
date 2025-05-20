import { BellIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Publicación Aprobada',
      message: 'Tu publicación "Servicio de Catering para Eventos" ha sido aprobada.',
      time: 'Hace 2 horas',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Nuevo Mensaje',
      message: 'María González ha enviado un mensaje sobre tu servicio.',
      time: 'Hace 5 horas',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Membresía por Vencer',
      message: 'Tu membresía Premium vencerá en 15 días.',
      time: 'Hace 1 día',
      read: true
    }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <BellIcon className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notificaciones</h2>
          <p className="text-gray-600">Mantente al día con las actualizaciones</p>
        </div>
        <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
          Marcar todas como leídas
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm p-4 ${
              !notification.read ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications; 