import React, { useState } from 'react';
import { Search, Flag, AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';

const Moderacion = () => {
  const [reportes] = useState([
    {
      id: 1,
      tipo: "contenido_inapropiado",
      reportado: "Servicio de Catering Premium",
      reportador: "Juan Pérez",
      fecha: "2024-03-15",
      estado: "pendiente",
      descripcion: "El contenido incluye imágenes inapropiadas..."
    },
    {
      id: 2,
      tipo: "informacion_falsa",
      reportado: "Decoraciones Elegantes",
      reportador: "María García",
      fecha: "2024-03-14",
      estado: "en_revision",
      descripcion: "La información del servicio no coincide con la realidad..."
    },
    {
      id: 3,
      tipo: "spam",
      reportado: "Música en Vivo",
      reportador: "Carlos López",
      fecha: "2024-03-13",
      estado: "resuelto",
      descripcion: "Publicación repetida múltiples veces..."
    }
  ]);

  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'contenido_inapropiado':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'informacion_falsa':
        return <Flag className="w-5 h-5 text-yellow-500" />;
      case 'spam':
        return <Shield className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_revision':
        return 'bg-blue-100 text-blue-800';
      case 'resuelto':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const reportesFiltrados = reportes.filter(reporte => {
    const cumpleEstado = filtroEstado === 'todos' || reporte.estado === filtroEstado;
    const cumpleTipo = filtroTipo === 'todos' || reporte.tipo === filtroTipo;
    const cumpleBusqueda = reporte.reportado.toLowerCase().includes(busqueda.toLowerCase()) ||
                          reporte.reportador.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleEstado && cumpleTipo && cumpleBusqueda;
  });

  return (
    <div className="p-6 ml-64">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Centro de Moderación</h1>
        <p className="text-gray-600">Gestiona reportes y contenido inapropiado</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar reportes..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="en_revision">En revisión</option>
              <option value="resuelto">Resueltos</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="contenido_inapropiado">Contenido inapropiado</option>
              <option value="informacion_falsa">Información falsa</option>
              <option value="spam">Spam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de reportes */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reportador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportesFiltrados.map((reporte) => (
                <tr key={reporte.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{reporte.reportado}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{reporte.descripcion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reporte.reportador}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTipoIcon(reporte.tipo)}
                      <span className="ml-2 text-sm text-gray-900">
                        {reporte.tipo.replace('_', ' ').charAt(0).toUpperCase() + reporte.tipo.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(reporte.estado)}`}>
                      {reporte.estado.replace('_', ' ').charAt(0).toUpperCase() + reporte.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(reporte.fecha).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                    {reporte.estado !== 'resuelto' && (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-3">Aprobar</button>
                        <button className="text-red-600 hover:text-red-900">Rechazar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Reportes Pendientes</p>
              <p className="text-2xl font-semibold text-yellow-600">8</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En Revisión</p>
              <p className="text-2xl font-semibold text-blue-600">5</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resueltos Hoy</p>
              <p className="text-2xl font-semibold text-green-600">12</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tiempo Promedio</p>
              <p className="text-2xl font-semibold text-purple-600">1.5h</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moderacion; 