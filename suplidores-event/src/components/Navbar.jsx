import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Home, ShoppingBag, Store, DollarSign, User, LogIn, Menu, X } from "lucide-react";
import { useSidebar } from '../../src/context/SidebarContext';

const colors = {
  sage: "#9CAF88",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
};

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setOpen]);

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 bg-transparent z-50">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-gray-100/50 transition-colors"
          >
            {open ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
          </button>
        </header>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className={`fixed h-screen flex flex-col border-r border-gray-200 bg-white z-50 transition-all duration-300 ${open ? 'w-48' : 'w-16'}`}>
          <div className="flex items-center justify-center p-4">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>

          <nav className={`flex-1 transition-all duration-300 ${open ? 'w-48' : 'w-16'}`}>
            <div className="flex flex-col gap-2 p-4">
              {/* Links del sidebar */}
              <a
                href="/Home"
                className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
                  open ? 'px-3 py-2' : 'justify-center p-2'
                } ${
                  location.pathname === "/Home" 
                    ? 'bg-purple/30' 
                    : 'hover:bg-purple/20'
                }`}
              >
                <Home size={18} />
                {open && <span className="ml-3 text-sm">Inicio</span>}
              </a>

              <a
                href="/servicios"
                className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
                  open ? 'px-3 py-2' : 'justify-center p-2'
                } ${
                  location.pathname === "/servicios" 
                    ? 'bg-purple/30' 
                    : 'hover:bg-purple/20'
                }`}
              >
                <ShoppingBag size={18} />
                {open && <span className="ml-3 text-sm">Servicios</span>}
              </a>

              <a
                href="/Productos"
                className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
                  open ? 'px-3 py-2' : 'justify-center p-2'
                } ${
                  location.pathname === "/Productos" 
                    ? 'bg-purple/30' 
                    : 'hover:bg-purple/20'
                }`}
              >
                <Store size={18} />
                {open && <span className="ml-3 text-sm">Productos</span>}
              </a>

              <a
                href="/Vende"
                className={`flex items-center rounded-md transition-all duration-200 text-gray-700 ${
                  open ? 'px-3 py-2' : 'justify-center p-2'
                } ${
                  location.pathname === "/Vende" 
                    ? 'bg-purple/30' 
                    : 'hover:bg-purple/20'
                }`}
              >
                <DollarSign size={18} />
                {open && <span className="ml-3 text-sm">Vende</span>}
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setOpen(false)}>
          <div 
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50"
            onClick={e => e.stopPropagation()}
          >
            <nav className="flex-1">
              <div className="flex flex-col gap-2 p-4 mt-16">
                <a
                  href="/Home"
                  className={`flex items-center rounded-md px-3 py-2 text-gray-700 ${
                    location.pathname === "/Home" 
                      ? 'bg-purple/30' 
                      : 'hover:bg-purple/20'
                  }`}
                >
                  <Home size={18} />
                  <span className="ml-3 text-sm">Inicio</span>
                </a>

                <a
                  href="/servicios"
                  className={`flex items-center rounded-md px-3 py-2 text-gray-700 ${
                    location.pathname === "/servicios" 
                      ? 'bg-purple/30' 
                      : 'hover:bg-purple/20'
                  }`}
                >
                  <ShoppingBag size={18} />
                  <span className="ml-3 text-sm">Servicios</span>
                </a>

                <a
                  href="/Productos"
                  className={`flex items-center rounded-md px-3 py-2 text-gray-700 ${
                    location.pathname === "/Productos" 
                      ? 'bg-purple/30' 
                      : 'hover:bg-purple/20'
                  }`}
                >
                  <Store size={18} />
                  <span className="ml-3 text-sm">Productos</span>
                </a>

                <a
                  href="/Vende"
                  className={`flex items-center rounded-md px-3 py-2 text-gray-700 ${
                    location.pathname === "/Vende" 
                      ? 'bg-purple/30' 
                      : 'hover:bg-purple/20'
                  }`}
                >
                  <DollarSign size={18} />
                  <span className="ml-3 text-sm">Vende</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
