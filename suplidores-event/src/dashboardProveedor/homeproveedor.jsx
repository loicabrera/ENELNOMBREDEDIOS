import React, { useEffect, useState } from 'react';
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
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Fetch proveedores
    fetch('http://localhost:3000/proveedores')
      .then(res => res.json())
      .then(data => {
        const proveedorLogueado = data.find(
          p => p.PERSONA_id_persona === user.PERSONA_id_persona
        );
        if (proveedorLogueado) {
          setProveedor(proveedorLogueado);
        } else {
          setError('No se encontró tu perfil de proveedor');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los datos del proveedor');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!proveedor) return <div className="p-8 text-center">No se encontró tu perfil de proveedor</div>;

  const keyIndicators = [
    {
      title: "Publicaciones Activas",
      value: proveedor.publicaciones_activas || 0,
      icon: DocumentTextIcon,
      color: "bg-blue-500",
      link: "/dashboard-proveedor/publicaciones"
    },
    {
      title: "Vencimiento Membresía",
      value: proveedor.fecha_vencimiento ? new Date(proveedor.fecha_vencimiento).toLocaleDateString() : 'No disponible',
      icon: CalendarIcon,
      color: "bg-green-500",
      link: "/dashboard-proveedor/membresia"
    },
    {
      title: "Mensajes Nuevos",
      value: proveedor.mensajes_nuevos || 0,
      icon: ChatBubbleLeftRightIcon,
      color: "bg-purple-500",
      link: "/dashboard-proveedor/solicitudes"
    },
    {
      title: "Estado",
      value: proveedor.estado || 'Activo',
      icon: CheckCircleIcon,
      color: "bg-yellow-500",
      link: "/dashboard-proveedor/perfil"
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
            src={proveedor.logo_url || "https://via.placeholder.com/100"}
            alt="Logo"
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{proveedor.nombre_empresa}</h2>
            <p className="text-gray-600">{proveedor.tipo_servicio}</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Plan {proveedor.plan || 'Básico'}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {proveedor.estado || 'Activo'}
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
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeProveedor; 