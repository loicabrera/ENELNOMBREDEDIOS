import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  NewspaperIcon, 
  ChatBubbleLeftRightIcon,
  CreditCardIcon,
  ChartBarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Inicio', icon: HomeIcon, path: '/dashboard' },
    { name: 'Perfil', icon: UserIcon, path: '/dashboard/perfil' },
    { name: 'Publicaciones', icon: NewspaperIcon, path: '/dashboard/publicaciones' },
    { name: 'Solicitudes', icon: ChatBubbleLeftRightIcon, path: '/dashboard/solicitudes' },
    { name: 'Membresía', icon: CreditCardIcon, path: '/dashboard/membresia' },
    { name: 'Estadísticas', icon: ChartBarIcon, path: '/dashboard/estadisticas' },
    { name: 'Notificaciones', icon: BellIcon, path: '/dashboard/notificaciones' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-lg max-h-screen w-64 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-gray-800">Dashboard Proveedor</h1>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <item.icon className="h-6 w-6 mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t p-4">
            <button className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`lg:ml-64 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
              <span className="text-gray-700">Nombre Proveedor</span>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 