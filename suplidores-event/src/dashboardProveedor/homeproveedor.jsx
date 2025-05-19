import ProveedorLayout from "../layouts/proveedorLayout";
import PerfilResumen from "./PerfilResumen";
import IndicadoresClave from "./IndicadoresClave";

const HomeProveedor = () => {
  // 🔧 Datos simulados (puedes reemplazarlos luego por datos reales de un API o contexto)
  const proveedor = {
    nombre: "Juan Pérez",
    tipoServicio: "Catering para eventos",
    plan: "Premium",
    estadoCuenta: "Activo",
    publicacionesActivas: 5,
    vencimientoMembresia: "2025-06-15",
    mensajesRecientes: 3,
    publicacionesPendientes: 1,
  };

  return (
    <ProveedorLayout>
      <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard del Proveedor</h1>
        
        <PerfilResumen proveedor={proveedor} />
        <IndicadoresClave proveedor={proveedor} />
      </div>
    </ProveedorLayout>
  );
};

export default HomeProveedor;
