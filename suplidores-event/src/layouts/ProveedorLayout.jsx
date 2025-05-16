// src/dashboardProveedor/ProveedorLayout.jsx
const ProveedorLayout = ({ children }) => {
    return (
      <div className="flex">
        <aside className="w-64 bg-gray-100 h-screen p-4">
          {/* Menú lateral para el proveedor */}
          <ul>
            <li>Inicio</li>
            <li>Mis Servicios</li>
            <li>Configuración</li>
          </ul>
        </aside>
        <main className="flex-1 p-4 bg-white">{children}</main>
      </div>
    );
  };
  
  export default ProveedorLayout;
  