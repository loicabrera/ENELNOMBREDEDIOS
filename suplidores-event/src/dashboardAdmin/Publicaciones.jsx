import React, { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';

const Publicaciones = () => {
  const [publicaciones] = useState([
    {
      id: 1,
      titulo: "Servicio de Catering Premium",
      proveedor: "Catering Express",
      categoria: "Catering",
      fecha: "2024-03-15",
      estado: "pendiente",
      descripcion: "Servicio de catering para eventos empresariales y sociales..."
    },
    {
      id: 2,
      titulo: "Decoración de Eventos",
      proveedor: "Decoraciones Elegantes",
      categoria: "Decoración",
      fecha: "2024-03-14",
      estado: "aprobado",
      descripcion: "Servicio completo de decoración para bodas y eventos..."
    },
    {
      id: 3,
      titulo: "Música en Vivo",
      proveedor: "Música en Vivo",
      categoria: "Entretenimiento",
      fecha: "2024-03-13",
      estado: "rechazado",
      descripcion: "Grupo musical para eventos sociales y corporativos..."
    }
  ]);

  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'aprobado':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rechazado':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pendiente':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'aprobado':
        return 'bg-green-100 text-green-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const publicacionesFiltradas = publicaciones.filter(pub => {
    const cumpleEstado = filtroEstado === 'todos' || pub.estado === filtroEstado;
    const cumpleCategoria = filtroCategoria === 'todas' || pub.categoria === filtroCategoria;
    const cumpleBusqueda = pub.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          pub.proveedor.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleEstado && cumpleCategoria && cumpleBusqueda;
  });

  return (
    <div className="p-6 ml-64">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Publicaciones</h1>
        <p className="text-gray-600">Administra y revisa las publicaciones de los proveedores</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar publicaciones..."
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
              <option value="aprobado">Aprobados</option>
              <option value="rechazado">Rechazados</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="todas">Todas las categorías</option>
              <option value="Catering">Catering</option>
              <option value="Decoración">Decoración</option>
              <option value="Entretenimiento">Entretenimiento</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de publicaciones */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publicacionesFiltradas.map((pub) => (
                <tr key={pub.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pub.titulo}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{pub.descripcion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pub.proveedor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pub.categoria}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(pub.fecha).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getEstadoIcon(pub.estado)}
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(pub.estado)}`}>
                        {pub.estado.charAt(0).toUpperCase() + pub.estado.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Ver</button>
                    {pub.estado === 'pendiente' && (
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
    </div>
  );
};

export default Publicaciones; 