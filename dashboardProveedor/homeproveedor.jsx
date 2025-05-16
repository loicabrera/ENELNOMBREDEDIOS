import ProveedorLayout from "../layouts/ProveedorLayout";
import PerfilResumen from "./perfilResumen";
import IndicadoresClave from "./IndicadoresClave";

const HomeProveedor = () => {
  const proveedor = {
    nombre: "Juan Pérez",
    tipoServicio: "Catering",
    plan: "Premium",
    estadoCuenta: "Activo",
    publicacionesActivas: 5,
    vencimientoMembresia: "2025-06-15",
    mensajesRecientes: 2,
    publicacionesPendientes: 1,
  };

  return (
    <ProveedorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard del Proveedor</h1>
        <PerfilResumen proveedor={proveedor} />
        <IndicadoresClave proveedor={proveedor} />
      </div>
    </ProveedorLayout>
  );
};

export default HomeProveedor;
