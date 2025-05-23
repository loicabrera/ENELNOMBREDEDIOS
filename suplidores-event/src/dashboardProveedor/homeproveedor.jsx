import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon,
  CreditCardIcon,
  ChartBarIcon,
  BellIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const HomeProveedor = () => {
  // Mock data - replace with actual data from your backend
  const profileData = {
    name: "Servicios Profesionales XYZ",
    serviceType: "Servicios de Consultoría",
    plan: "Premium",
    status: "Activo",
    activePosts: 5,
    membershipExpiry: "2024-12-31",
    unreadMessages: 3,
    lastPostStatus: "Aprobado"
  };

  const keyIndicators = [
    {
      title: "Publicaciones Activas",
      value: profileData.activePosts,
      icon: DocumentTextIcon,
      color: "bg-blue-500",
      link: "/dashboard-proveedor/publicaciones"
    },
    {
      title: "Vencimiento Membresía",
      value: new Date(profileData.membershipExpiry).toLocaleDateString(),
      icon: CalendarIcon,
      color: "bg-green-500",
      link: "/dashboard-proveedor/membresia"
    },
    {
      title: "Mensajes Nuevos",
      value: profileData.unreadMessages,
      icon: ChatBubbleLeftRightIcon,
      color: "bg-purple-500",
      link: "/dashboard-proveedor/solicitudes"
    },
    {
      title: "Última Publicación",
      value: profileData.lastPostStatus,
      icon: CheckCircleIcon,
      color: "bg-yellow-500",
      link: "/dashboard-proveedor/publicaciones"
    }
  ];

  const quickActions = [
    {
      title: "Publicaciones",
      description: "Administra tus servicios y productos publicados",
      icon: DocumentTextIcon,
      link: "/dashboard-proveedor/publicaciones",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Solicitudes",
      description: "Revisa las solicitudes de contacto de tus clientes",
      icon: ChatBubbleLeftRightIcon,
      link: "/dashboard-proveedor/solicitudes",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Membresía",
      description: "Gestiona tu plan y estado de membresía",
      icon: CreditCardIcon,
      link: "/dashboard-proveedor/membresia",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Estadísticas",
      description: "Visualiza el rendimiento de tus publicaciones",
      icon: ChartBarIcon,
      link: "/dashboard-proveedor/stats",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Perfil",
      description: "Actualiza la información de tu negocio",
      icon: UserIcon,
      link: "/dashboard-proveedor/perfil",
      color: "bg-red-100 text-red-600"
    },
    {
      title: "Notificaciones",
      description: "Revisa tus notificaciones y alertas",
      icon: BellIcon,
      link: "/dashboard-proveedor/notificaciones",
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Profile Summary Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://via.placeholder.com/100"
            alt="Logo"
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
            <p className="text-gray-600">{profileData.serviceType}</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Plan {profileData.plan}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {profileData.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyIndicators.map((indicator, index) => (
          <Link
            key={index}
            to={indicator.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{indicator.title}</p>
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                  {indicator.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${indicator.color}`}>
                <indicator.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{action.title}</h3>
                <p className="text-gray-600 mt-1">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Actividad Reciente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800">Nueva publicación aprobada</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-800">Nueva solicitud de contacto</p>
                <p className="text-xs text-gray-500">Hace 5 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProveedor; 