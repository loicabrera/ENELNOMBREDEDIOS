const PerfilResumen = ({ proveedor }) => {
    return (
      <section className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Resumen del Perfil</h2>
        <p>👤 <strong>{proveedor.nombre}</strong></p>
        <p>🛠 Tipo de servicio: <strong>{proveedor.tipoServicio}</strong></p>
        <p>📦 Plan actual: <strong>{proveedor.plan}</strong></p>
        <p>✅ Estado de cuenta: <strong>{proveedor.estadoCuenta}</strong></p>
      </section>
    );
  };
  
  export default PerfilResumen;
  