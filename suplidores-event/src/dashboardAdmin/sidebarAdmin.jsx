// SidebarAdmin.tsx
import React, { useState } from 'react';
import { Home, Users, FileText, Layers, CreditCard, BarChart, Settings, HelpCircle, ShieldCheck, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SidebarAdmin() {
  const [isOpen, setIsOpen] = useState(true); // Estado para controlar si el sidebar está abierto
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`h-screen bg-white border-r shadow-sm fixed top-0 left-0 z-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className={`p-4 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>}
        <button onClick={toggleSidebar} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="p-4 flex flex-col gap-2">
        <NavItem icon={<Home size={20} />} label="Inicio" onClick={() => navigate('/dashboardadmin')} isOpen={isOpen} />
        <NavItem icon={<Users size={20} />} label="Proveedores" onClick={() => navigate('/dashboardadmin/proveedores')} isOpen={isOpen} />
        <NavItem icon={<FileText size={20} />} label="Publicaciones" onClick={() => navigate('/dashboardadmin/publicaciones')} isOpen={isOpen} />
        <NavItem icon={<Layers size={20} />} label="Membresías" onClick={() => navigate('/dashboardadmin/membresias')} isOpen={isOpen} />
        <NavItem icon={<CreditCard size={20} />} label="Pagos" onClick={() => navigate('/dashboardadmin/pagos')} isOpen={isOpen} />
      </nav>
    </aside>
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
