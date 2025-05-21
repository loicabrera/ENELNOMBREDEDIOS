import React, { useEffect, useState } from 'react';

const HistorialPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/pagos')
      .then(res => res.json())
      .then(data => {
        setPagos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Función para calcular el estado de la membresía
  const calcularEstado = (fechaPago) => {
    const diasMembresia = 30;
    const diasGracia = 7;
    const fecha = new Date(fechaPago);
    const hoy = new Date();
    const finMembresia = new Date(fecha);
    finMembresia.setDate(fecha.getDate() + diasMembresia);
    const finGracia = new Date(fecha);
    finGracia.setDate(fecha.getDate() + diasMembresia + diasGracia);

    if (hoy <= finMembresia) return 'Pagado';
    if (hoy > finMembresia && hoy <= finGracia) return 'En período de gracia';
    return 'Pendiente';
  };

  if (loading) return <div>Cargando historial de pagos...</div>;

  return (
    <div className="p-6 ml-64 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Historial de Pagos</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Fecha</th>
            <th className="border px-4 py-2">Monto</th>
            <th className="border px-4 py-2">Proveedor</th>
            <th className="border px-4 py-2">Persona</th>
            <th className="border px-4 py-2">Método</th>
            <th className="border px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <tr key={pago.id_pago}>
              <td className="border px-4 py-2">{new Date(pago.fecha_pago).toLocaleDateString()}</td>
              <td className="border px-4 py-2">${pago.monto}</td>
              <td className="border px-4 py-2">{pago.proveedor?.nombre_empresa || 'N/A'}</td>
              <td className="border px-4 py-2">
                {pago.proveedor?.persona
                  ? `${pago.proveedor.persona.nombre} ${pago.proveedor.persona.apellido}`
                  : 'N/A'}
              </td>
              <td className="border px-4 py-2">Stripe</td>
              <td className="border px-4 py-2">{calcularEstado(pago.fecha_pago)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialPagos; 