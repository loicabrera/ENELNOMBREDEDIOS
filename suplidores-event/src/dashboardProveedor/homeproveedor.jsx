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
  const [publicaciones, setPublicaciones] = useState({ productos: 0, servicios: 0, limite_productos: 0, limite_servicios: 0 });
  const [membresia, setMembresia] = useState(null);

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
        let proveedorLogueado;
        if (negocioActivoId) {
          proveedorLogueado = data.find(p => p.id_provedor === Number(negocioActivoId));
        }
        // Si no hay negocio activo, usa el primero del usuario
        if (!proveedorLogueado) {
          proveedorLogueado = data.find(p => p.PERSONA_id_persona === user.PERSONA_id_persona);
        }
        if (proveedorLogueado) {
          setProveedor(proveedorLogueado);
          // Fetch productos y servicios publicados
          Promise.all([
            fetch(`https://spectacular-recreation-production.up.railway.app/api/productos?provedor_negocio_id_provedor=${proveedorLogueado.id_provedor}`).then(r => r.json()),
            fetch('https://spectacular-recreation-production.up.railway.app/api/servicios').then(r => r.json()),
            fetch(`https://spectacular-recreation-production.up.railway.app/membresia/${proveedorLogueado.id_provedor}`).then(r => r.json())
          ]).then(([productos, servicios, membresiaData]) => {
            const misServicios = servicios.filter(s => s.provedor_negocio_id_provedor === proveedorLogueado.id_provedor);
            setPublicaciones({
              productos: productos.length,
              servicios: misServicios.length,
              limite_productos: membresiaData.limite_productos,
              limite_servicios: membresiaData.limite_servicios
            });
            setMembresia(membresiaData);
            setLoading(false);
          });
        } else {
          setError('No se encontró tu perfil de proveedor');
          setLoading(false);
        }
      })
      .catch(err => {
        setError('Error al cargar los datos del proveedor');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!proveedor) return <div className="p-8 text-center">No se encontró tu perfil de proveedor</div>;

  // --- Banner de alerta de membresía ---
  let banner = null;
  if (membresia && membresia.fecha_fin) {
    const fechaFin = new Date(membresia.fecha_fin);
    const hoy = new Date();
    const diffTime = fechaFin.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (membresia.estado && membresia.estado.toLowerCase() === 'vencida' || diffDays < 0) {
      banner = (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">¡Membresía vencida!</strong>
          <span className="block sm:inline ml-2">Tu membresía ha vencido. Renueva para seguir disfrutando de los beneficios.</span>
          <Link to="/dashboard-proveedor/membresia" className="ml-4 underline text-red-800 font-semibold">Renovar ahora</Link>
        </div>
      );
    } else if (diffDays <= 7) {
      banner = (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">¡Atención!</strong>
          <span className="block sm:inline ml-2">Tu membresía vence en {diffDays} día{diffDays !== 1 ? 's' : ''}. Renueva a tiempo para no perder acceso a tus beneficios.</span>
          <Link to="/dashboard-proveedor/membresia" className="ml-4 underline text-yellow-900 font-semibold">Renovar ahora</Link>
        </div>
      );
    }
  }

  const keyIndicators = [
    {
      title: "Productos Publicados",
      value: `${publicaciones.productos} / ${publicaciones.limite_productos}`,
      icon: DocumentTextIcon,
      color: "bg-blue-500",
      link: "/dashboard-proveedor/publicaciones"
    },
    {
      title: "Servicios Publicados",
      value: `${publicaciones.servicios} / ${publicaciones.limite_servicios}`,
      icon: DocumentTextIcon,
      color: "bg-purple-500",
      link: "/dashboard-proveedor/publicaciones"
    },
    {
      title: "Vencimiento Membresía",
      value: membresia && membresia.fecha_fin ? new Date(membresia.fecha_fin).toLocaleDateString() : 'No disponible',
      icon: CalendarIcon,
      color: "bg-green-500",
      link: "/dashboard-proveedor/membresia"
    },
    {
      title: "Estado Membresía",
      value: membresia && membresia.estado ? membresia.estado : 'No disponible',
      icon: CheckCircleIcon,
      color: "bg-yellow-500",
      link: "/dashboard-proveedor/membresia"
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
      title: "Membresía",
      description: "Gestiona tu plan y estado de membresía",
      icon: CreditCardIcon,
      link: "/dashboard-proveedor/membresia",
      color: "bg-green-100 text-green-600"
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
      {/* Banner de membresía */}
      {banner}

      {/* Profile Summary Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
         
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{proveedor.nombre_empresa}</h2>
            <p className="text-gray-600">{proveedor.tipo_servicio}</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                 {membresia && membresia.nombre_pla ? membresia.nombre_pla : 'Básico'}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {membresia && membresia.estado ? membresia.estado : 'Activo'}
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