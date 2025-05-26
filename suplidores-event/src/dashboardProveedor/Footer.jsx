import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  ShoppingBagIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link 
            to="/dashboard-proveedor" 
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/dashboard-proveedor') ? 'text-[#012e33]' : 'text-gray-500 hover:text-[#012e33]'}`}
          >
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Inicio</span>
          </Link>

          <Link 
            to="/dashboard-proveedor/profile" 
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/dashboard-proveedor/profile') ? 'text-[#012e33]' : 'text-gray-500 hover:text-[#012e33]'}`}
          >
            <UserIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Perfil</span>
          </Link>

          <Link 
            to="/dashboard-proveedor/productos" 
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/dashboard-proveedor/productos') ? 'text-[#012e33]' : 'text-gray-500 hover:text-[#012e33]'}`}
          >
            <ShoppingBagIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Productos</span>
          </Link>

          <Link 
            to="/dashboard-proveedor/eventos" 
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/dashboard-proveedor/eventos') ? 'text-[#012e33]' : 'text-gray-500 hover:text-[#012e33]'}`}
          >
            <CalendarIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Eventos</span>
          </Link>

          <Link 
            to="/dashboard-proveedor/mensajes" 
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/dashboard-proveedor/mensajes') ? 'text-[#012e33]' : 'text-gray-500 hover:text-[#012e33]'}`}
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Mensajes</span>
          </Link>

          <Link 
            to="/dashboard-proveedor/notificaciones" 
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/dashboard-proveedor/notificaciones') ? 'text-[#012e33]' : 'text-gray-500 hover:text-[#012e33]'}`}
          >
            <BellIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Notificaciones</span>
          </Link>

          <Link 
            to="/dashboard-proveedor/configuracion" 
            className={`flex flex-col items-center p-2 rounded-lg ${isActive('/dashboard-proveedor/configuracion') ? 'text-[#012e33]' : 'text-gray-500 hover:text-[#012e33]'}`}
          >
            <Cog6ToothIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Ajustes</span>
          </Link>

          <button 
            onClick={handleLogout}
            className="flex flex-col items-center p-2 rounded-lg text-gray-500 hover:text-[#012e33]"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Salir</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 