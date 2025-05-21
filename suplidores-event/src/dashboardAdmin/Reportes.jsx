import React, { useState } from 'react';
import { Download, Calendar, BarChart2, PieChart, LineChart } from 'lucide-react';

const Reportes = () => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('mes');
  const [tipoReporte, setTipoReporte] = useState('ingresos');

  // Datos de ejemplo para las gráficas
  const datosIngresos = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ingresos por Membresías',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }
    ]
  };

  const datosProveedores = {
    labels: ['Catering', 'Decoración', 'Música', 'Fotografía', 'Otros'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
      }
    ]
  };

  const datosActividad = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Visitas',
        data: [150, 230, 180, 290, 200, 250, 300],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      }
    ]
  };

  return (
    <div className="p-6 ml-64">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h1>
        <p className="text-gray-600">Análisis detallado del rendimiento de la plataforma</p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={20} />
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            >
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
              <option value="trimestre">Último trimestre</option>
              <option value="año">Último año</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <BarChart2 className="text-gray-500" size={20} />
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
            >
              <option value="ingresos">Ingresos</option>
              <option value="proveedores">Proveedores</option>
              <option value="actividad">Actividad</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download size={20} />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingresos Totales</h3>
          <p className="text-3xl font-bold text-blue-600">$123,456</p>
          <p className="text-sm text-gray-500">+12% vs período anterior</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Proveedores Activos</h3>
          <p className="text-3xl font-bold text-green-600">245</p>
          <p className="text-sm text-gray-500">+8% vs período anterior</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Visitas Totales</h3>
          <p className="text-3xl font-bold text-purple-600">45,678</p>
          <p className="text-sm text-gray-500">+15% vs período anterior</p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Membresías</h3>
          <div className="h-80">
            {/* Aquí iría la gráfica de ingresos */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Gráfica de ingresos
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Proveedores</h3>
          <div className="h-80">
            {/* Aquí iría la gráfica de distribución */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Gráfica de distribución
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad de la Plataforma</h3>
          <div className="h-80">
            {/* Aquí iría la gráfica de actividad */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Gráfica de actividad
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos Detallados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nuevos Proveedores</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publicaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-03-15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$12,345</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,234</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-03-14</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$11,234</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,123</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;