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
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { useActiveBusiness } from '../context/ActiveBusinessContext';

const navigation = [
  { name: 'Inicio', href: '/dashboard-proveedor', icon: HomeIcon },
  { name: 'Perfil', href: '/dashboard-proveedor/perfil', icon: UserIcon },
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
  const [isMobile, setIsMobile] = useState(false);
  const [tieneNotificaciones, setTieneNotificaciones] = useState(false);
  const { user, isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const { activeBusiness } = useActiveBusiness();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const checkNotificaciones = async () => {
      try {
        if (!isAuthenticated || !activeBusiness?.id) {
          setTieneNotificaciones(false);
          return;
        }
        const proveedorId = activeBusiness.id;
        const res = await fetch(`https://spectacular-recreation-production.up.railway.app/api/notificaciones/nuevas?proveedor_id=${proveedorId}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Error al verificar notificaciones');
        const data = await res.json();
        setTieneNotificaciones(data.nuevas);
        // Si estamos en la ruta de notificaciones, marcarlas como leídas
        if (location.pathname === '/dashboard-proveedor/notificaciones') {
          await fetch('https://spectacular-recreation-production.up.railway.app/api/notificaciones/leer', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ proveedor_id: proveedorId })
          });
          setTieneNotificaciones(false);
        }
      } catch (error) {
        setTieneNotificaciones(false);
      }
    };
    checkNotificaciones();
    const interval = setInterval(checkNotificaciones, 10000);
    return () => clearInterval(interval);
  }, [location.pathname, isAuthenticated, activeBusiness]);

  const handleLogout = async () => {
    try {
      await fetch('https://spectacular-recreation-production.up.railway.app/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      // Ignora errores de red, igual limpia el estado
    }
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#fbcbdb] flex flex-col">
      <div className="flex flex-1">
        {/* Mobile Header */}
        {isMobile && (
          <header className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 z-50">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-[#fbcbdb]/50 hover:text-[#012e33] transition-colors"
            >
              {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </header>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-40
          ${isMobile 
            ? (isSidebarOpen ? 'w-64' : '-translate-x-full') 
            : (isSidebarOpen ? 'w-64' : 'w-16')}`}>
          <div className="flex flex-col h-full">
            {/* Menu button - only visible on desktop */}
            {!isMobile && (
              <div className="p-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg hover:bg-[#fbcbdb] hover:text-[#012e33] transition-colors"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
              </div>
            )}

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

        {/* Mobile overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 
          ${isMobile 
            ? 'ml-0' 
            : (isSidebarOpen ? 'md:ml-64' : 'md:ml-16')}`}>
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