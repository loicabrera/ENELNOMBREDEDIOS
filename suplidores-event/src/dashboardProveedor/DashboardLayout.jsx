import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CreditCardIcon,
  ChartBarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import Footer from './Footer';

const navigation = [
  { name: 'Inicio', href: '/dashboard-proveedor', icon: HomeIcon },
  { name: 'Negocios', href: '/dashboard-proveedor/negocios', icon: BuildingStorefrontIcon },
  { name: 'Publicaciones', href: '/dashboard-proveedor/publicaciones', icon: DocumentTextIcon },
  { name: 'Membresía', href: '/dashboard-proveedor/membresia', icon: CreditCardIcon },
  { name: 'Notificaciones', href: '/dashboard-proveedor/notificaciones', icon: BellIcon },
];


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tieneNotificaciones, setTieneNotificaciones] = useState(false);

  useEffect(() => {
    const checkNotificaciones = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          console.log('No hay usuario en localStorage');
          return;
        }

        // Obtener el negocio activo
        const negocioActivoId = localStorage.getItem('negocio_activo');
        console.log('Negocio activo ID:', negocioActivoId);
        
        const resProveedor = await fetch('http://localhost:3000/proveedores');
        if (!resProveedor.ok) throw new Error('Error al obtener proveedores');
        const proveedores = await resProveedor.json();
        
        let proveedor;
        if (negocioActivoId) {
          proveedor = proveedores.find(p => p.id_provedor === Number(negocioActivoId));
        }
        if (!proveedor) {
          proveedor = proveedores.find(p => p.PERSONA_id_persona === user.PERSONA_id_persona);
        }
        if (!proveedor) {
          console.log('No se encontró proveedor');
          return;
        }

        console.log('Verificando notificaciones para proveedor:', proveedor.id_provedor);
        // Verificar notificaciones no leídas
        const res = await fetch(`http://localhost:3000/api/notificaciones/nuevas?proveedor_id=${proveedor.id_provedor}`);
        if (!res.ok) throw new Error('Error al verificar notificaciones');
        const data = await res.json();
        console.log('Respuesta de notificaciones:', data);
        setTieneNotificaciones(data.nuevas);

        // Si estamos en la página de notificaciones, marcar como leídas
        if (location.pathname === '/dashboard-proveedor/notificaciones') {
          console.log('Marcando notificaciones como leídas');
          await fetch('http://localhost:3000/api/notificaciones/leer', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ proveedor_id: proveedor.id_provedor })
          });
          setTieneNotificaciones(false);
        }
      } catch (error) {
        console.error('Error al verificar notificaciones:', error);
        setTieneNotificaciones(false);
      }
    };

    // Ejecutar inmediatamente
    checkNotificaciones();
    // Verificar cada 10 segundos (reducido de 30 para mejor respuesta)
    const interval = setInterval(checkNotificaciones, 10000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#fbcbdb] flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
          <div className="flex flex-col h-full">
            {/* Menu button */}
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-[#fbcbdb] hover:text-[#012e33] transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const isNotificaciones = item.name === 'Notificaciones';
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        isActive
                          ? 'bg-[#fbcbdb] text-[#012e33]'
                          : 'text-gray-600 hover:bg-[#fbcbdb] hover:text-[#012e33]'
                      )}
                    >
                      <span className="relative">
                        <item.icon
                          className={classNames(
                            'h-6 w-6',
                            isSidebarOpen ? 'mr-3' : '',
                            isActive ? 'text-[#012e33]' : 'text-gray-400 group-hover:text-[#012e33]'
                          )}
                          aria-hidden="true"
                        />
                        {isNotificaciones && tieneNotificaciones && (
                          <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                        )}
                      </span>
                      {isSidebarOpen && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Logout button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-[#fbcbdb] hover:text-[#012e33] rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className={`h-6 w-6 ${isSidebarOpen ? 'mr-3' : ''}`} />
                {isSidebarOpen && <span>Cerrar Sesión</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer sidebarOpen={isSidebarOpen} />
    </div>
  );
} 