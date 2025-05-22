import { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  StarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Publications = () => {
  const [tipoVendedor, setTipoVendedor] = useState(null); // null, 'servicios', 'productos'
  const [servicioForm, setServicioForm] = useState({
    nombre: '',
    descripcion: '',
    tipo_servicio: '',
    precio: '',
    imagenes: []
  });

  const [productoForm, setProductoForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tipo_producto: '',
    imagenes: []
  });

  const [publications] = useState([
    {
      id: 1,
      title: 'Servicio de Catering para Eventos Corporativos',
      status: 'published',
      date: '2024-03-15',
      views: 245,
      featured: true
    },
    {
      id: 2,
      title: 'Buffet para Bodas y Eventos Sociales',
      status: 'pending',
      date: '2024-03-14',
      views: 0,
      featured: false
    },
    {
      id: 3,
      title: 'Servicio de Coctelería Profesional',
      status: 'draft',
      date: '2024-03-13',
      views: 0,
      featured: false
    },
    {
      id: 4,
      title: 'Menú Degustación para Eventos Especiales',
      status: 'rejected',
      date: '2024-03-12',
      views: 0,
      featured: false
    }
  ]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      published: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const statusIcons = {
      published: <CheckCircleIcon className="w-4 h-4" />,
      pending: <ClockIcon className="w-4 h-4" />,
      draft: <EyeIcon className="w-4 h-4" />,
      rejected: <XCircleIcon className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {statusIcons[status]}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const handleServicioChange = (e) => {
    const { name, value } = e.target;
    setServicioForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    setProductoForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicioSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del servicio:', servicioForm);
    // Aquí iría la lógica para guardar el servicio
  };

  const handleProductoSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del producto:', productoForm);
    // Aquí iría la lógica para guardar el producto
  };

  // Formulario de Servicio
  const ServicioForm = () => (
    <form onSubmit={handleServicioSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Nuevo Servicio</h2>
        <button
          onClick={() => setTipoVendedor('selector')}
          className="text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Servicio</label>
          <input
            type="text"
            name="nombre"
            value={servicioForm.nombre}
            onChange={handleServicioChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
          <input
            type="text"
            name="tipo_servicio"
            value={servicioForm.tipo_servicio}
            onChange={handleServicioChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <input
            type="number"
            name="precio"
            value={servicioForm.precio}
            onChange={handleServicioChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={servicioForm.descripcion}
              onChange={handleServicioChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Subir imágenes</span>
          <input
                      id="file-upload"
                      name="file-upload"
            type="file"
            multiple
            accept="image/*"
                      className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setServicioForm(prev => ({
                ...prev,
                imagenes: files
              }));
            }}
                    />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
              </div>
            </div>
          </div>
        </div>
        </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setTipoVendedor('selector')}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Publicar Servicio
        </button>
      </div>
    </form>
  );

  // Formulario de Producto
  const ProductoForm = () => (
    <form onSubmit={handleProductoSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Nuevo Producto</h2>
        <button
          onClick={() => setTipoVendedor('selector')}
          className="text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
          <input
            type="text"
            name="nombre"
            value={productoForm.nombre}
            onChange={handleProductoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Producto</label>
          <input
            type="text"
            name="tipo_producto"
            value={productoForm.tipo_producto}
            onChange={handleProductoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <input
            type="number"
            name="precio"
            value={productoForm.precio}
            onChange={handleProductoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={productoForm.descripcion}
              onChange={handleProductoChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Subir imágenes</span>
          <input
                      id="file-upload"
                      name="file-upload"
            type="file"
            multiple
            accept="image/*"
                      className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setProductoForm(prev => ({
                ...prev,
                imagenes: files
              }));
            }}
                    />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
              </div>
            </div>
          </div>
        </div>
        </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setTipoVendedor('selector')}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Publicar Producto
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Publicaciones</h1>
          <p className="mt-2 text-gray-600">Gestiona tus servicios y productos publicados</p>
        </div>

        {!tipoVendedor ? (
          <>
            {/* Lista de publicaciones existentes */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Publicaciones Activas</h2>
                  <button
                    onClick={() => setTipoVendedor('selector')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Nueva Publicación
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vistas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {publications.map((publication) => (
                        <tr key={publication.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{publication.title}</div>
                              {publication.featured && (
                                <StarIcon className="ml-2 h-5 w-5 text-yellow-400" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(publication.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {publication.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {publication.views}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : tipoVendedor === 'selector' ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">¿Qué deseas publicar?</h2>
              <button
                onClick={() => setTipoVendedor(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setTipoVendedor('servicios')}
                className="p-6 border rounded-lg hover:bg-gray-50 text-center transition-colors duration-200"
              >
                <span className="block text-3xl mb-3">🎯</span>
                <span className="text-lg font-medium">Servicios</span>
                <p className="mt-2 text-sm text-gray-500">Publica tus servicios para eventos</p>
              </button>
              <button
                onClick={() => setTipoVendedor('productos')}
                className="p-6 border rounded-lg hover:bg-gray-50 text-center transition-colors duration-200"
              >
                <span className="block text-3xl mb-3">📦</span>
                <span className="text-lg font-medium">Productos</span>
                <p className="mt-2 text-sm text-gray-500">Publica tus productos para eventos</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            {tipoVendedor === 'servicios' && <ServicioForm />}
            {tipoVendedor === 'productos' && <ProductoForm />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications; 