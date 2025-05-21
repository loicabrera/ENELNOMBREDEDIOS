import React from 'react';
import Chart from 'react-apexcharts';
import { Bell, CalendarCheck } from 'lucide-react';
import HistorialPagos from './HistorialPagos';

export default function AdminHomeDashboard() {
  // Placeholder data; replace with fetched API data
  const stats = {
    totalProviders: 128,
    activeProviders: 102,
    inactiveProviders: 26,
    approvedPosts: 340,
    pendingPosts: 24,
    rejectedPosts: 16,
    activeMemberships: 110,
    expiredMemberships: 18,
    contactsToday: 12,
    contactsWeek: 67,
    contactsMonth: 212,
  };

  // Chart configs
  const visitsOptions = {
    chart: { id: 'visits-chart', toolbar: { show: false } },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    stroke: { curve: 'smooth' },
  };
  const visitsSeries = [
    { name: 'Visitas', data: [30, 45, 28, 50, 42, 60, 75] }
  ];

  const activeProvidersOptions = {
    chart: { id: 'active-providers' },
    plotOptions: { pie: { donut: { size: '65%' } } },
    labels: ['Proveedor A', 'Proveedor B', 'Proveedor C', 'Otros'],
  };
  const activeProvidersSeries = [40, 25, 20, 15];

  const categoriesOptions = {
    chart: { id: 'categories-chart', toolbar: { show: false } },
    xaxis: { categories: ['Floristería', 'Catering', 'Música', 'Decoración'] }
  };
  const categoriesSeries = [
    { name: 'Publicaciones', data: [120, 95, 75, 60] }
  ];

  // Alerts
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
          <p className="text-3xl font-semibold">{stats.totalProviders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Activos / Inactivos</h3>
          <p className="text-3xl font-semibold">{stats.activeProviders} / {stats.inactiveProviders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Aprobadas / Pendientes / Rechazadas</h3>
          <p className="text-3xl font-semibold">{stats.approvedPosts} / {stats.pendingPosts} / {stats.rejectedPosts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500">Membresías Activas / Vencidas</h3>
          <p className="text-3xl font-semibold">{stats.activeMemberships} / {stats.expiredMemberships}</p>
        </div>
      </div>

      {/* Solicitudes */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h3 className="text-lg font-medium mb-2">Solicitudes de Contacto</h3>
        <div className="flex space-x-8">
          <div>
            <p className="text-sm text-gray-500">Hoy</p>
            <p className="text-xl font-semibold">{stats.contactsToday}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Semana</p>
            <p className="text-xl font-semibold">{stats.contactsWeek}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mes</p>
            <p className="text-xl font-semibold">{stats.contactsMonth}</p>
          </div>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Visitas por Día</h3>
          <Chart options={visitsOptions} series={visitsSeries} type="line" height={200} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Proveedores Más Activos</h3>
          <Chart options={activeProvidersOptions} series={activeProvidersSeries} type="donut" height={200} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Categorías Más Populares</h3>
          <Chart options={categoriesOptions} series={categoriesSeries} type="bar" height={200} />
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
