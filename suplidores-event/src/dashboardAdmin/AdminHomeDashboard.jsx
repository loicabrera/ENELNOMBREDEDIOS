import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Bell, CalendarCheck } from 'lucide-react';

export default function AdminHomeDashboard() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/proveedores')
      .then(res => res.json())
      .then(data => {
        setProveedores(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Calcular datos reales
  const totalProviders = proveedores.length;
  const activos = proveedores.filter(p => p.activo !== false).length; // Asume campo 'activo', si no existe, todos activos
  const inactivos = totalProviders - activos;
  // Proveedores por tipo de servicio
  const servicios = {};
  proveedores.forEach(p => {
    if (p.tipo_servicio) {
      servicios[p.tipo_servicio] = (servicios[p.tipo_servicio] || 0) + 1;
    }
  });
  const categorias = Object.keys(servicios);
  const categoriasSeries = [{ name: 'Proveedores', data: Object.values(servicios) }];

  // Placeholder para proveedores más activos (puedes mejorar con pagos reales)
  const topProveedores = proveedores.slice(0, 4);
  const topLabels = topProveedores.map(p => p.nombre_empresa);
  const topSeries = topProveedores.map(() => 1); // Simulado, puedes usar pagos reales

  // Alerts (puedes mejorar con lógica real)
  const alerts = [
    { id: 1, icon: CalendarCheck, text: '5 membresías por vencer en los próximos 3 días.' },
    { id: 2, icon: Bell, text: '12 publicaciones pendientes de revisión.' },
  ];

  return (
    <div className="p-6 ml-64 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Resumen General</h1>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Total Proveedores</h3>
          <p className="text-3xl font-semibold">{loading ? '...' : totalProviders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Activos / Inactivos</h3>
          <p className="text-3xl font-semibold">{loading ? '...' : `${activos} / ${inactivos}`}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Aprobadas / Pendientes / Rechazadas</h3>
          <p className="text-3xl font-semibold">340 / 24 / 16</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Membresías Activas / Vencidas</h3>
          <p className="text-3xl font-semibold">110 / 18</p>
        </div>
      </div>

      {/* Solicitudes */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h3 className="text-lg font-medium mb-2">Solicitudes de Contacto</h3>
        <div className="flex space-x-8">
          <div>
            <p className="text-sm text-gray-500">Hoy</p>
            <p className="text-xl font-semibold">12</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Semana</p>
            <p className="text-xl font-semibold">67</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mes</p>
            <p className="text-xl font-semibold">212</p>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Proveedores por Categoría</h3>
          <Chart options={{
            chart: { id: 'categories-chart', toolbar: { show: false } },
            xaxis: { categories: categorias },
          }} series={categoriasSeries} type="bar" height={200} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Proveedores Más Activos</h3>
          <Chart options={{
            chart: { id: 'active-providers' },
            labels: topLabels
          }} series={topSeries} type="donut" height={200} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Visitas por Día</h3>
          <Chart options={{
            chart: { id: 'visits-chart', toolbar: { show: false } },
            xaxis: { categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
            stroke: { curve: 'smooth' },
          }} series={[
            { name: 'Visitas', data: [30, 45, 28, 50, 42, 60, 75] }
          ]} type="line" height={200} />
        </div>
      </div>

      {/* Alertas recientes */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Alertas Recientes</h3>
        <ul className="space-y-3">
          {alerts.map(a => (
            <li key={a.id} className="flex items-center gap-3">
              <a.icon className="w-5 h-5 text-red-500" />
              <span className="text-gray-700">{a.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
