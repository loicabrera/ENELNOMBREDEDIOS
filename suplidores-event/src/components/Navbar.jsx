import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Home, ShoppingBag, Store, DollarSign, User, LogIn, Menu } from "lucide-react";

const colors = {
  sage: "#9CAF88",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
};

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [asideOpen, setAsideOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="fixed h-screen flex flex-col border-r border-gray-200 bg-white z-50">
      {/* Header del Navbar */}
      <header className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={() => setAsideOpen(!asideOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <nav className={`flex-1 transition-all duration-300 ${asideOpen ? 'w-48' : 'w-16'}`}>
        <div className="flex flex-col gap-2 p-4">
          {/* Links del sidebar */}
          <a
            href="/Home"
            className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
              asideOpen ? 'px-3 py-2' : 'justify-center p-2'
            } ${
              location.pathname === "/Home" 
                ? 'bg-purple/30' 
                : 'hover:bg-purple/20'
            }`}
          >
            <Home size={18} />
            {asideOpen && <span className="ml-3 text-sm">Inicio</span>}
          </a>

          <a
            href="/servicios"
            className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
              asideOpen ? 'px-3 py-2' : 'justify-center p-2'
            } ${
              location.pathname === "/servicios" 
                ? 'bg-purple/30' 
                : 'hover:bg-purple/20'
            }`}
          >
            <ShoppingBag size={18} />
            {asideOpen && <span className="ml-3 text-sm">Servicios</span>}
          </a>

          <a
            href="/Productos"
            className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
              asideOpen ? 'px-3 py-2' : 'justify-center p-2'
            } ${
              location.pathname === "/Productos" 
                ? 'bg-purple/30' 
                : 'hover:bg-purple/20'
            }`}
          >
            <Store size={18} />
            {asideOpen && <span className="ml-3 text-sm">Productos</span>}
          </a>

          <a
            href="/Vende"
            className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
              asideOpen ? 'px-3 py-2' : 'justify-center p-2'
            } ${
              location.pathname === "/Vende" 
                ? 'bg-purple/30' 
                : 'hover:bg-purple/20'
            }`}
          >
            <DollarSign size={18} />
            {asideOpen && <span className="ml-3 text-sm">Vende</span>}
          </a>
        </div>
      </nav>

      {/* Profile button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center space-x-2 w-full"
        >
          <div className="h-8 w-8 rounded-full bg-purple/20 flex items-center justify-center">
            <User size={16} className="text-gray-700" />
          </div>
          {asideOpen && <span className="text-sm">Perfil</span>}
        </button>
        {/* Profile dropdown */}
        {profileOpen && (
          <div className="absolute bottom-16 left-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="flex items-center space-x-2 p-2">
              <div className="h-9 w-9 rounded-full bg-purple/20 flex items-center justify-center">
                <User size={18} className="text-gray-700" />
              </div>
              <div className="font-medium">Hafiz Haziq</div>
            </div>

            <div className="flex flex-col bg-white space-y-3 p-2">
              <a href="#" className="transition hover:text-blue-600">
                Mi Perfil
              </a>
              <a href="#" className="transition hover:text-blue-600">
                Editar Perfil
              </a>
              <a href="#" className="transition hover:text-blue-600">
                Configuración
              </a>
            </div>

            <div className="p-2">
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('negocio_activo');
                  window.location.href = '/login';
                }} 
                className="flex items-center space-x-2 transition hover:text-blue-600"
              >
                <LogIn size={16} />
                <div>Cerrar Sesión</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
