import React, { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, X } from 'lucide-react';

const Publicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
  const [error, setError] = useState(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [fieldModalContent, setFieldModalContent] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Intentar obtener productos
        const productosResponse = await fetch('https://spectacular-recreation-production.up.railway.app/api/productos-todos');
        if (!productosResponse.ok) {
          throw new Error(`Error al obtener productos: ${productosResponse.status}`);
        }
        const productos = await productosResponse.json();
        console.log('Productos recibidos:', productos);

        // Intentar obtener servicios
        const serviciosResponse = await fetch('https://spectacular-recreation-production.up.railway.app/api/servicios');
        if (!serviciosResponse.ok) {
          throw new Error(`Error al obtener servicios: ${serviciosResponse.status}`);
        }
        const servicios = await serviciosResponse.json();
        console.log('Servicios recibidos:', servicios);

        // Intentar obtener proveedores
        const proveedoresResponse = await fetch('https://spectacular-recreation-production.up.railway.app/proveedores');
        if (!proveedoresResponse.ok) {
          throw new Error(`Error al obtener proveedores: ${proveedoresResponse.status}`);
        }
        const proveedores = await proveedoresResponse.json();
        console.log('Proveedores recibidos:', proveedores);
        if (proveedores.length > 0) {
          console.log('Estructura del primer proveedor:', proveedores[0]);
        }

        const pubs = [
          ...productos.map(p => {
            const proveedorAsociado = proveedores.find(pr => pr.id_provedor === p.provedor_negocio_id_provedor);
            return {
              id: p.id_productos,
              titulo: p.nombre,
              proveedor: proveedorAsociado?.nombre_empresa || 'Desconocido',
              categoria: p.categoria || p.tipo_producto || 'Sin categoría',
              fecha: proveedorAsociado?.fecha_creacion || '',
              estado: p.estado || 'aprobado',
              descripcion: p.descripcion,
              tipo: 'Producto'
            };
          }),
          ...servicios.map(s => {
             const proveedorAsociado = proveedores.find(pr => pr.id_provedor === s.provedor_negocio_id_provedor);
             return {
              id: s.id_servicio,
              titulo: s.nombre,
              proveedor: proveedorAsociado?.nombre_empresa || 'Desconocido',
              categoria: s.tipo_servicio || 'Sin categoría',
              fecha: proveedorAsociado?.fecha_creacion || '',
              estado: s.estado || 'aprobado',
              descripcion: s.descripcion,
              tipo: 'Servicio'
            };
          })
        ];

        setPublicaciones(pubs);
        setProveedores(proveedores);
        setError(null);
      } catch (err) {
        console.error('Error al cargar los datos:', err);
        setError(err.message);
      }
    };

    fetchData();
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

  const handleVerPublicacion = (publicacion) => {
    setPublicacionSeleccionada(publicacion);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPublicacionSeleccionada(null);
  };

  const handleFieldClick = (title, content) => {
    setFieldModalContent({ title, content });
    setShowFieldModal(true);
  };

  const cerrarFieldModal = () => {
    setShowFieldModal(false);
    setFieldModalContent({ title: '', content: '' });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Publicaciones</h1>
        <p className="text-gray-600">Administra y revisa las publicaciones de los proveedores</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

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
              className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobado">Aprobados</option>
              <option value="rechazado">Rechazados</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <p className="truncate">Título</p>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <p className="truncate">Proveedor</p>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <p className="truncate">Categoría</p>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <p className="truncate">Estado</p>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <p className="truncate">Tipo</p>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <p className="truncate">Acciones</p>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publicacionesFiltradas.map((pub) => (
                <tr key={pub.tipo + '-' + pub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <p 
                        className="text-sm font-medium text-gray-900 truncate max-w-[200px] cursor-pointer hover:underline"
                        title={pub.titulo}
                        onClick={() => handleFieldClick('Título', pub.titulo)}
                      >
                        {pub.titulo.length > 10 ? pub.titulo.substring(0, 10) + '...' : pub.titulo}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <p 
                      className="text-sm text-gray-900 truncate max-w-[150px] cursor-pointer hover:underline"
                      title={pub.proveedor}
                      onClick={() => handleFieldClick('Proveedor', pub.proveedor)}
                    >
                      {pub.proveedor.length > 10 ? pub.proveedor.substring(0, 10) + '...' : pub.proveedor}
                    </p>
                  </td>
                  <td className="px-4 py-2">
                    <p 
                      className="text-sm text-gray-900 truncate max-w-[150px] cursor-pointer hover:underline"
                      title={pub.categoria}
                      onClick={() => handleFieldClick('Categoría', pub.categoria)}
                    >
                      {pub.categoria.length > 10 ? pub.categoria.substring(0, 10) + '...' : pub.categoria}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getEstadoIcon(pub.estado)}
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(pub.estado)}`}>
                        {pub.estado.charAt(0).toUpperCase() + pub.estado.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">{pub.tipo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleVerPublicacion(pub)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Ver detalles"
                      >
                        Ver
                      </button>
                      {pub.estado === 'pendiente' && (
                        <>
                          <button 
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Aprobar publicación"
                          >
                            Aprobar
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Rechazar publicación"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalles */}
      {modalAbierto && publicacionSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {publicacionSeleccionada.titulo}
              </h2>
              <button
                onClick={cerrarModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Proveedor</h3>
                <p className="mt-1 text-gray-900">{publicacionSeleccionada.proveedor}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Categoría</h3>
                <p className="mt-1 text-gray-900">{publicacionSeleccionada.categoria}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                <p className="mt-1">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {publicacionSeleccionada.tipo}
                  </span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                <div className="mt-1 flex items-center">
                  {getEstadoIcon(publicacionSeleccionada.estado)}
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(publicacionSeleccionada.estado)}`}>
                    {publicacionSeleccionada.estado.charAt(0).toUpperCase() + publicacionSeleccionada.estado.slice(1)}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Fecha de creación</h3>
                <p className="mt-1 text-gray-900">
                  {publicacionSeleccionada.fecha ? new Date(publicacionSeleccionada.fecha).toLocaleDateString() : 'No disponible'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {publicacionSeleccionada.descripcion || 'No hay descripción disponible'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Modal for individual field details */}
      {showFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{fieldModalContent.title}</h3>
              <button
                onClick={cerrarFieldModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{fieldModalContent.content}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={cerrarFieldModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publicaciones; 