import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Home, ShoppingBag, Store, DollarSign, User } from "lucide-react";

const colors = {
  sage: "#9CAF88",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
};

function Navbar({ children }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [asideOpen, setAsideOpen] = useState(true);

  const location = useLocation();
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const toggleAside = () => {
    setAsideOpen(!asideOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex w-full items-center justify-between border-b-2 border-gray-200 p-2">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <button type="button" className="text-2xl" onClick={toggleAside}>
            <i class="fi fi-br-bars-sort"></i>
          </button>
          <div>
            {" "}
            <img
              src="/suplidores-event/img/logos.svg"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Button Profile */}
        <div>
          <button
            type="button"
            onClick={toggleProfile}
            className="h-9 w-9 overflow-hidden rounded-full"
          >
            <img src="/api/placeholder/40/40" alt="perfil" />
          </button>

          {/* Dropdown Profile */}
          {profileOpen && (
            <div
              className="absolute right-2 mt-1 w-48 divide-y divide-gray-200 rounded-md border border-gray-200  shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
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
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Aside/Sidebar */}
        {asideOpen && (
          <aside
            className="w-72 flex-shrink-0 overflow-y-auto transition-all duration-300"
            style={{ backgroundColor: "transparent" }}
          >
            <a
              href="/Home"
              className={`flex items-center space-x-3 rounded-md px-4 py-3 transition-all duration-200 text-gray-700 ${
                location.pathname === "/Home" 
                  ? 'bg-purple/30' 
                  : 'hover:bg-purple/20'
              }`}
            >
              <Home size={20} />
              <span>Inicio</span>
            </a>

            <a
              href="/servicios"
              className={`flex items-center space-x-3 rounded-md px-4 py-3 transition-all duration-200 text-gray-700 ${
                location.pathname === "/servicios" 
                  ? 'bg-purple/30' 
                  : 'hover:bg-purple/20'
              }`}
            >
              <ShoppingBag size={20} />
              <span>Servicios</span>
            </a>

            <a
              href="/Productos"
              className={`flex items-center space-x-3 rounded-md px-4 py-3 transition-all duration-200 text-gray-700 ${
                location.pathname === "/Productos" 
                  ? 'bg-purple/30' 
                  : 'hover:bg-purple/20'
              }`}
            >
              <Store size={20} />
              <span>Productos</span>
            </a>

            <a
              href="/Vende"
              className={`flex items-center space-x-3 rounded-md px-4 py-3 transition-all duration-200 text-gray-700 ${
                location.pathname === "/Vende" 
                  ? 'bg-purple/30' 
                  : 'hover:bg-purple/20'
              }`}
            >
              <DollarSign size={20} />
              <span>Vende</span>
            </a>

            <a
              href="/perfil"
              className={`flex items-center space-x-3 rounded-md px-4 py-3 transition-all duration-200 text-gray-700 ${
                location.pathname === "/perfil" 
                  ? 'bg-purple/30' 
                  : 'hover:bg-purple/20'
              }`}
            >
              <User size={20} />
              <span>Perfil</span>
            </a>
          </aside>
        )}
        {/* Main Content */}
        <main 
          className={`flex-1 transition-all duration-300 overflow-auto`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default Navbar;
