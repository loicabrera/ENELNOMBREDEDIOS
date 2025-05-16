const IndicadoresClave = ({ proveedor }) => {
    return (
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Indicadores Clave</h2>
        <ul className="space-y-2">
          <li>📌 Publicaciones activas: <strong>{proveedor.publicacionesActivas}</strong></li>
          <li>📅 Vencimiento de membresía: <strong>{proveedor.vencimientoMembresia}</strong></li>
          <li>📨 Mensajes recientes: <strong>{proveedor.mensajesRecientes}</strong></li>
          <li>🕓 Publicaciones en revisión: <strong>{proveedor.publicacionesPendientes}</strong></li>
        </ul>
      </section>
    );
  };
  
  export default IndicadoresClave;
  