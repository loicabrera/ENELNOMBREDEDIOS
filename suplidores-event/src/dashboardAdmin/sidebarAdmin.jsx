// SidebarAdmin.tsx
import React, { useState, useEffect } from 'react';
import { Home, Users, FileText, Layers, CreditCard, BarChart, Settings, HelpCircle, ShieldCheck, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SidebarAdmin() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 z-50">
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100/50">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white border-r shadow-sm z-40 transition-all duration-300
        ${isMobile 
          ? (isOpen ? 'w-64' : '-translate-x-full') 
          : (isOpen ? 'w-64' : 'w-20')}`}>
        <div className={`p-4 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
          {isOpen && <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>}
          {!isMobile && (
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        <nav className="p-4 flex flex-col gap-2">
          <NavItem icon={<Home size={20} />} label="Inicio" onClick={() => navigate('/dashboardadmin')} isOpen={isOpen} />
          <NavItem icon={<Users size={20} />} label="Proveedores" onClick={() => navigate('/dashboardadmin/proveedores')} isOpen={isOpen} />
          <NavItem icon={<FileText size={20} />} label="Publicaciones" onClick={() => navigate('/dashboardadmin/publicaciones')} isOpen={isOpen} />
          <NavItem icon={<Layers size={20} />} label="Membresías" onClick={() => navigate('/dashboardadmin/membresias')} isOpen={isOpen} />
          <NavItem icon={<CreditCard size={20} />} label="Pagos" onClick={() => navigate('/dashboardadmin/pagos')} isOpen={isOpen} />
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function NavItem({ icon, label, onClick, isOpen }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all text-sm font-medium">
      {icon}
      {isOpen && <span>{label}</span>}
    </button>
  );
}
