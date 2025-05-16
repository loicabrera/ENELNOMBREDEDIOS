// SidebarAdmin.tsx
import { Home, Users, FileText, Layers, CreditCard, BarChart, Settings, HelpCircle, ShieldCheck } from 'lucide-react';

const SidebarAdmin = () => {
  return (
    <aside className="h-screen w-64 bg-white border-r shadow-sm fixed top-0 left-0 z-50">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        <p className="text-sm text-gray-500">Gestión de la plataforma</p>
      </div>

      <nav className="p-4 flex flex-col gap-2">
        <NavItem icon={<Home size={20} />} label="Inicio" />
        <NavItem icon={<Users size={20} />} label="Proveedores" />
        <NavItem icon={<FileText size={20} />} label="Publicaciones" />
        <NavItem icon={<Layers size={20} />} label="Membresías" />
        <NavItem icon={<CreditCard size={20} />} label="Pagos" />
        <NavItem icon={<BarChart size={20} />} label="Reportes" />
        <NavItem icon={<HelpCircle size={20} />} label="Soporte" />
        <NavItem icon={<ShieldCheck size={20} />} label="Moderación" />
        <NavItem icon={<Settings size={20} />} label="Configuración" />
      </nav>
    </aside>
  );
}

function NavItem({ icon, label }) {
  return (
    <button className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all text-sm font-medium">
      {icon}
      {label}
    </button>
  );
}

export default SidebarAdmin;
