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
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Inicio', href: '/dashboard-proveedor', icon: HomeIcon },
  { name: 'Perfil', href: '/dashboard-proveedor/perfil', icon: UserIcon },
  { name: 'Negocios', href: '/dashboard-proveedor/negocios', icon: BuildingStorefrontIcon },
  { name: 'Publicaciones', href: '/dashboard-proveedor/publicaciones', icon: DocumentTextIcon },
  { name: 'Solicitudes', href: '/dashboard-proveedor/solicitudes', icon: EnvelopeIcon },
  { name: 'Membresía', href: '/dashboard-proveedor/membresia', icon: CreditCardIcon },
  { name: 'Stats', href: '/dashboard-proveedor/stats', icon: ChartBarIcon },
  { name: 'Notificaciones', href: '/dashboard-proveedor/notificaciones', icon: BellIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardLayout() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#fbcbdb]">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex flex-col h-full">
            {/* Logo section */}
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Your Company"
              />
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
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
                      <item.icon
                        className={classNames(
                          'h-6 w-6 mr-3',
                          isActive ? 'text-[#012e33]' : 'text-gray-400 group-hover:text-[#012e33]'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
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
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-64">
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 