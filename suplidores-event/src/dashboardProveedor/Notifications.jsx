import { useState } from 'react';
import { 
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Publicación Aprobada',
      message: 'Tu publicación "Servicio de Consultoría Empresarial" ha sido aprobada.',
      date: '2024-03-15 10:30',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Membresía por Vencer',
      message: 'Tu membresía Premium vencerá en 7 días. Renueva ahora para mantener tus beneficios.',
      date: '2024-03-14 15:45',
      read: false
    },
    {
      id: 3,
      type: 'error',
      title: 'Publicación Rechazada',
      message: 'Tu publicación "Asesoría Financiera" ha sido rechazada. Revisa los comentarios del administrador.',
      date: '2024-03-13 09:15',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Nueva Solicitud',
      message: 'Has recibido una nueva solicitud de contacto de Juan Pérez.',
      date: '2024-03-12 14:20',
      read: true
    }
  ]);

  const getNotificationIcon = (type) => {
    const icons = {
      success: CheckCircleIcon,
      warning: ExclamationTriangleIcon,
      error: XCircleIcon,
      info: InformationCircleIcon
    };

    const colors = {
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
      info: 'text-blue-500'
    };

    const Icon = icons[type];
    return <Icon className={`h-6 w-6 ${colors[type]}`} />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      success: 'bg-green-50 border-green-200',
      warning: 'bg-yellow-50 border-yellow-200',
      error: 'bg-red-50 border-red-200',
      info: 'bg-blue-50 border-blue-200'
    };

    return colors[type];
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Notificaciones</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${getNotificationColor(notification.type)} ${
                  !notification.read ? 'border-l-4' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.date).toLocaleString()}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Marcar como leída"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Eliminar notificación"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No hay notificaciones
            </div>
          )}
        </div>
      </div>

      {/* Membership Expiration Warning */}
      {notifications.some(n => n.type === 'warning' && !n.read) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Tu membresía está por vencer. 
                <a href="#" className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-1">
                  Renueva ahora
                </a>
                para mantener tus beneficios.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications; 