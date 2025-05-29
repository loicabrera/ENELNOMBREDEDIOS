import React, { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';

const Publicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/api/productos-todos').then(r => r.json()),
      fetch('http://localhost:3000/api/servicios').then(r => r.json()),
      fetch('http://localhost:3000/proveedores').then(r => r.json())
    ]).then(([productos, servicios, proveedores]) => {
      const pubs = [
        ...productos.map(p => ({
          id: p.id_productos,
          titulo: p.nombre,
          proveedor: proveedores.find(pr => pr.id_provedor === p.provedor_negocio_id_provedor)?.nombre_empresa || 'Desconocido',
          categoria: p.categoria || p.tipo_producto || 'Sin categoría',
          fecha: p.fecha_creacion || p.createdAt || '',
          estado: p.estado || 'aprobado',
          descripcion: p.descripcion,
          tipo: 'Producto'
        })),
        ...servicios.map(s => ({
          id: s.id_servicio,
          titulo: s.nombre,
          proveedor: proveedores.find(pr => pr.id_provedor === s.provedor_negocio_id_provedor)?.nombre_empresa || 'Desconocido',
          categoria: s.tipo_servicio || 'Sin categoría',
          fecha: s.fecha_creacion || s.createdAt || '',
          estado: s.estado || 'aprobado',
          descripcion: s.descripcion,
          tipo: 'Servicio'
        }))
      ];
      setPublicaciones(pubs);
      setProveedores(proveedores);
    });
  }, []);

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

  const categoriasUnicas = Array.from(new Set(publicaciones.map(p => p.categoria)));

  const publicacionesFiltradas = publicaciones.filter(pub => {
    const cumpleEstado = filtroEstado === 'todos' || pub.estado === filtroEstado;
    const cumpleCategoria = filtroCategoria === 'todas' || pub.categoria === filtroCategoria;
    const cumpleBusqueda = pub.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      pub.proveedor.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleEstado && cumpleCategoria && cumpleBusqueda;
  });

  return (
    <div className="p-6 w-full">
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
              {categoriasUnicas.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de publicaciones */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full table-fixed divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 w-1/6 truncate">Título</th>
              <th className="px-2 py-3 w-1/6 truncate">Proveedor</th>
              <th className="px-2 py-3 w-1/6 truncate">Categoría</th>
              <th className="px-2 py-3 w-1/6 truncate">Estado</th>
              <th className="px-2 py-3 w-1/12 truncate">Tipo</th>
              <th className="px-2 py-3 w-1/6 truncate">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {publicacionesFiltradas.map((pub) => (
              <tr key={pub.tipo + '-' + pub.id}>
                <td className="px-2 py-2 w-1/6 truncate">
                  <div className="text-sm font-medium text-gray-900 truncate">{pub.titulo}</div>
                  <div className="text-sm text-gray-500 truncate">{pub.descripcion}</div>
                </td>
                <td className="px-2 py-2 w-1/6 truncate">
                  <div className="text-sm text-gray-900 truncate">{pub.proveedor}</div>
                </td>
                <td className="px-2 py-2 w-1/6 truncate">
                  <div className="text-sm text-gray-900 truncate">{pub.categoria}</div>
                </td>
                <td className="px-2 py-2 w-1/6 truncate">
                  <div className="flex items-center">
                    {getEstadoIcon(pub.estado)}
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(pub.estado)}`}>
                      {pub.estado.charAt(0).toUpperCase() + pub.estado.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2 w-1/12 truncate">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">{pub.tipo}</span>
                </td>
                <td className="px-2 py-2 w-1/6 truncate text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => { setPublicacionSeleccionada(pub); setModalAbierto(true); }}>Ver</button>
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

      {/* Modal de detalles */}
      {modalAbierto && publicacionSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setModalAbierto(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Detalles de la Publicación</h2>
            <div className="mb-2"><span className="font-semibold">Título:</span> {publicacionSeleccionada.titulo}</div>
            <div className="mb-2"><span className="font-semibold">Proveedor:</span> {publicacionSeleccionada.proveedor}</div>
            <div className="mb-2"><span className="font-semibold">Categoría:</span> {publicacionSeleccionada.categoria}</div>
            <div className="mb-2"><span className="font-semibold">Estado:</span> {publicacionSeleccionada.estado}</div>
            <div className="mb-2"><span className="font-semibold">Tipo:</span> {publicacionSeleccionada.tipo}</div>
            <div className="mb-2"><span className="font-semibold">Descripción:</span> {publicacionSeleccionada.descripcion}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publicaciones; 