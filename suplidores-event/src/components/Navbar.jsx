import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Home, ShoppingBag, Store, DollarSign, User, LogIn } from "lucide-react";

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
    <div className="flex flex-col border-r border-gray-200">
      {/* Header del Navbar */}
      <header className="h-20 flex items-center justify-center px-6 border-b border-gray-200">
        <div className="flex items-center">
          <img
            src="/img/logos.svg"
            className="h-12 w-auto cursor-pointer transition-transform duration-300 hover:scale-105"
            alt="Logo"
            onClick={() => setAsideOpen(!asideOpen)}
            style={{ objectFit: 'contain' }}
            />
          </div>
      </header>

      {/* Login Section */}
      <div className="p-6 border-b border-gray-200">
        <a
          href="/login"
          className={`flex items-center rounded-md transition-all duration-200 text-gray-700 hover:bg-purple/20 ${
            asideOpen ? 'px-4 py-3 ml-2' : 'justify-center p-3'
          }`}
        >
          <LogIn size={18} />
          {asideOpen && <span className="ml-3 text-sm">Iniciar Sesión</span>}
        </a>
        </div>

      {/* Sidebar */}
      <nav className={`flex-1 transition-all duration-300 ${asideOpen ? 'w-56' : 'w-16'}`}>
        <div className="flex flex-col gap-2 p-6">
          {/* Links del sidebar */}
          <a
            href="/Home"
            className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
              asideOpen ? 'px-4 py-3 ml-2' : 'justify-center p-3'
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
              asideOpen ? 'px-4 py-3 ml-2' : 'justify-center p-3'
            } ${
              location.pathname === "/servicios" 
                ? 'bg-purple/30' 
                : 'hover:bg-purple/20'
            }`}
          >
            <ShoppingBag size={20} />
            {asideOpen && <span className="ml-3 text-sm">Servicios</span>}
          </a>

          <a
            href="/Productos"
            className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
              asideOpen ? 'px-4 py-3 ml-2' : 'justify-center p-3'
            } ${
              location.pathname === "/Productos" 
                ? 'bg-purple/30' 
                : 'hover:bg-purple/20'
            }`}
          >
            <Store size={20} />
            {asideOpen && <span className="ml-3 text-sm">Productos</span>}
          </a>

          <a
            href="/Vende"
            className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
              asideOpen ? 'px-4 py-3 ml-2' : 'justify-center p-3'
            } ${
              location.pathname === "/Vende" 
                ? 'bg-purple/30' 
                : 'hover:bg-purple/20'
            }`}
          >
            <DollarSign size={20} />
            {asideOpen && <span className="ml-3 text-sm">Vende</span>}
          </a>

          <a
            href="/perfil"
            className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
              asideOpen ? 'px-4 py-3 ml-2' : 'justify-center p-3'
            } ${
              location.pathname === "/perfil" 
                ? 'bg-purple/30' 
                : 'hover:bg-purple/20'
            }`}
          >
            <User size={20} />
            {asideOpen && <span className="ml-3 text-sm">Perfil</span>}
          </a>
        </div>
      </nav>

      {/* Profile button */}
      <div className="p-4 border-t border-gray-200">
          <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center space-x-2 w-full"
          >
          <img src="/api/placeholder/40/40" alt="perfil" className="h-8 w-8 rounded-full" />
          {asideOpen && <span className="text-sm">Perfil</span>}
          </button>
        {/* Profile dropdown */}
          {profileOpen && (
          <div className="absolute bottom-16 left-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="flex items-center space-x-2 p-2">
                <img
                  src="/api/placeholder/40/40"
                  alt="perfil"
                  className="h-9 w-9 rounded-full"
                />
                <div className=" font-medium">Hafiz Haziq</div>
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
                <button className="flex items-center space-x-2 transition hover:text-blue-600">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
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
