import { useState, useEffect, useCallback, memo } from 'react';
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
import { useNavigate } from 'react-router-dom';

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
    categoria: '',
    imagenes: []
  });

  
  const [proveedor, setProveedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [imagenesServicios, setImagenesServicios] = useState({}); // { id_servicio: [id_imagenes, ...] }
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }
    // Obtener proveedor autenticado
    fetch('http://localhost:3000/proveedores')
      .then(res => res.json())
      .then(data => {
        const prov = data.find(p => p.PERSONA_id_persona === user.PERSONA_id_persona);
        setProveedor(prov);
        if (prov) {
          // Obtener productos del proveedor
          fetch(`http://localhost:3000/api/productos?provedor_negocio_id_provedor=${prov.id_provedor}`)
            .then(res => res.json())
            .then(setProductos);
          // Obtener servicios del proveedor
          fetch(`http://localhost:3000/api/servicios`)
            .then(res => res.json())
            .then(servs => {
              const misServicios = servs.filter(s => s.provedor_negocio_id_provedor === prov.id_provedor);
              setServicios(misServicios);
              // Por cada servicio, obtener sus imágenes
              misServicios.forEach(servicio => {
                fetch(`http://localhost:3000/api/imagenes_servicio/por-servicio/${servicio.id_servicio}`)
                  .then(res => res.json())
                  .then(imgs => {
                    setImagenesServicios(prev => ({
                      ...prev,
                      [servicio.id_servicio]: imgs
                    }));
                  });
              });
            });
        }
      });
  }, []);

  // Memoize handlers
  const handleServicioChange = useCallback((e) => {
    const { name, value } = e.target;
    setServicioForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleProductoChange = useCallback((e) => {
    const { name, value } = e.target;
    setProductoForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleImagenesChange = useCallback(e => {
    setImagenes([...e.target.files]);
  }, []);

  // Ejemplo de función para crear producto (ajusta según tu formulario)
  const handleCrearProducto = async (nuevoProducto) => {
    if (!proveedor) return;
    // Crear producto
    const res = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...nuevoProducto,
        provedor_negocio_id_provedor: proveedor.id_provedor
      })
    });
    const data = await res.json();
    if (data.id_producto) {
      // Subir imágenes si hay
      for (let img of nuevoProducto.imagenes) {
        const formData = new FormData();
        formData.append('imagen', img);
        formData.append('productos_id_productos', data.id_producto);
        await fetch('http://localhost:3000/api/imagenes_productos', {
          method: 'POST',
          body: formData
        });
      }
      alert('Producto creado con éxito');
      // Limpiar el formulario después de crear exitosamente
      setProductoForm({
        nombre: '',
        descripcion: '',
        precio: '',
        tipo_producto: '',
        categoria: '',
        imagenes: []
      });
      // Recargar productos
      fetch(`http://localhost:3000/api/productos?provedor_negocio_id_provedor=${proveedor.id_provedor}`)
        .then(res => res.json())
        .then(setProductos);
    }
  };

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

  const handleServicioSubmit = async (e) => {
    e.preventDefault();
    if (!proveedor) {
      console.error('No hay proveedor autenticado');
      return;
    }
    if (!servicioForm.nombre || !servicioForm.descripcion || !servicioForm.tipo_servicio || !servicioForm.precio) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
    try {
      // 1. Crear el servicio
      const res = await fetch('http://localhost:3000/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: servicioForm.nombre,
          descripcion: servicioForm.descripcion,
          tipo_servicio: servicioForm.tipo_servicio,
          precio: servicioForm.precio,
          provedor_negocio_id_provedor: proveedor.id_provedor
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert('Error al crear el servicio: ' + (data.error || 'Error desconocido'));
        return;
      }
      if (data.id_servicio) {
        // 2. Subir imágenes si hay
        for (let img of servicioForm.imagenes) {
          const formData = new FormData();
          formData.append('imagen', img);
          formData.append('SERVICIO_id_servicio', data.id_servicio);
          await fetch('http://localhost:3000/api/imagenes_servicio', {
            method: 'POST',
            body: formData
          });
        }
        alert('Servicio creado con éxito');
        // Limpiar el formulario después de crear exitosamente
        setServicioForm({
          nombre: '',
          descripcion: '',
          tipo_servicio: '',
          precio: '',
          imagenes: []
        });
        // Recargar la lista de servicios
        const servs = await fetch('http://localhost:3000/api/servicios').then(res => res.json());
        const misServicios = servs.filter(s => s.provedor_negocio_id_provedor === proveedor.id_provedor);
        setServicios(misServicios);
      }
    } catch (error) {
      console.error('Error en el submit del servicio:', error);
      alert('Ocurrió un error al enviar el formulario. Revisa la consola para más detalles.');
    }
  };

  const handleProductoSubmit = (e) => {
    e.preventDefault();
    handleCrearProducto(productoForm);
  };

  const handleEliminarServicio = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/servicios/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error('Error al eliminar el servicio');
      }
      // Actualizar la lista de servicios
      const servs = await fetch('http://localhost:3000/api/servicios').then(res => res.json());
      const misServicios = servs.filter(s => s.provedor_negocio_id_provedor === proveedor.id_provedor);
      setServicios(misServicios);
      alert('Servicio eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el servicio');
    }
  };

  // Unificar productos y servicios en una sola lista de publicaciones
  const publicaciones = [
    ...productos.map(p => ({ ...p, tipo: 'Producto', id: p.id_productos })),
    ...servicios.map(s => ({ ...s, tipo: 'Servicio', id: s.id_servicio }))
  ];

  // Acción: Ver publicación
  const handleVer = (pub) => {
    if (pub.tipo === 'Producto') {
      navigate(`/productos/${pub.id_productos}`);
    } else {
      navigate(`/servicios/${pub.id_servicio}`);
    }
  };

  // Acción: Editar publicación (puedes implementar el formulario de edición si lo deseas)
  const handleEditar = (pub) => {
    alert('Funcionalidad de edición aún no implementada.');
    // Aquí podrías abrir un modal o navegar a una página de edición
  };

  // Acción: Eliminar publicación
  const handleEliminar = async (pub) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) return;
    try {
      if (pub.tipo === 'Producto') {
        const res = await fetch(`http://localhost:3000/api/productos/${pub.id_productos}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar el producto');
        // Actualizar productos
        fetch(`http://localhost:3000/api/productos?provedor_negocio_id_provedor=${proveedor.id_provedor}`)
          .then(res => res.json())
          .then(setProductos);
      } else {
        const res = await fetch(`http://localhost:3000/api/servicios/${pub.id_servicio}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar el servicio');
        // Actualizar servicios
        const servs = await fetch('http://localhost:3000/api/servicios').then(res => res.json());
        const misServicios = servs.filter(s => s.provedor_negocio_id_provedor === proveedor.id_provedor);
        setServicios(misServicios);
      }
      alert('Publicación eliminada exitosamente');
    } catch (error) {
      alert(error.message);
    }
  };

  // Memoize form components
  const ServicioForm = memo(() => (
    <form onSubmit={handleServicioSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Nuevo Servicio</h2>
        <button
          type="button"
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
                    htmlFor="file-upload-servicio"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Subir imágenes</span>
                    <input
                      id="file-upload-servicio"
                      name="file-upload-servicio"
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
                {/* Mostrar nombres de imágenes seleccionadas */}
                {servicioForm.imagenes && servicioForm.imagenes.length > 0 && (
                  <ul className="mt-2 text-xs text-gray-700 text-left">
                    {servicioForm.imagenes.map((img, idx) => (
                      <li key={idx}>{img.name}</li>
                    ))}
                  </ul>
                )}
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

// ProductoForm fuera del componente Publications
const ProductoForm = ({
  productoForm,
  setProductoForm,
  handleProductoChange,
  handleProductoSubmit,
  setTipoVendedor
}) => (
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <input
          type="text"
          name="categoria"
          value={productoForm.categoria}
          onChange={handleProductoChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Opcional"
        />
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
                  htmlFor="file-upload-producto"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Subir imágenes</span>
                  <input
                    id="file-upload-producto"
                    name="file-upload-producto"
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
              {/* Mostrar nombres y previews de imágenes seleccionadas */}
              {productoForm.imagenes && productoForm.imagenes.length > 0 && (
                <ul className="mt-2 text-xs text-gray-700 text-left flex flex-wrap gap-2">
                  {productoForm.imagenes.map((img, idx) => (
                    <li key={idx} className="flex flex-col items-center">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={img.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginBottom: 4 }}
                      />
                      <span>{img.name}</span>
                    </li>
                  ))}
                </ul>
              )}
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
    categoria: '',
    imagenes: []
  });

  
  const [proveedor, setProveedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [imagenesServicios, setImagenesServicios] = useState({}); // { id_servicio: [id_imagenes, ...] }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }
    // Obtener proveedor autenticado
    fetch('http://localhost:3000/proveedores')
      .then(res => res.json())
      .then(data => {
        const prov = data.find(p => p.PERSONA_id_persona === user.PERSONA_id_persona);
        setProveedor(prov);
        if (prov) {
          // Obtener productos del proveedor
          fetch(`http://localhost:3000/api/productos?provedor_negocio_id_provedor=${prov.id_provedor}`)
            .then(res => res.json())
            .then(setProductos);
          // Obtener servicios del proveedor
          fetch(`http://localhost:3000/api/servicios`)
            .then(res => res.json())
            .then(servs => {
              const misServicios = servs.filter(s => s.provedor_negocio_id_provedor === prov.id_provedor);
              setServicios(misServicios);
              // Por cada servicio, obtener sus imágenes
              misServicios.forEach(servicio => {
                fetch(`http://localhost:3000/api/imagenes_servicio/por-servicio/${servicio.id_servicio}`)
                  .then(res => res.json())
                  .then(imgs => {
                    setImagenesServicios(prev => ({
                      ...prev,
                      [servicio.id_servicio]: imgs
                    }));
                  });
              });
            });
        }
      });
  }, []);

  // Memoize handlers
  const handleServicioChange = useCallback((e) => {
    const { name, value } = e.target;
    setServicioForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleProductoChange = useCallback((e) => {
    const { name, value } = e.target;
    setProductoForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleImagenesChange = useCallback(e => {
    setImagenes([...e.target.files]);
  }, []);

  // Ejemplo de función para crear producto (ajusta según tu formulario)
  const handleCrearProducto = async (nuevoProducto) => {
    if (!proveedor) return;
    // Crear producto
    const res = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...nuevoProducto,
        provedor_negocio_id_provedor: proveedor.id_provedor
      })
    });
    const data = await res.json();
    if (data.id_producto) {
      // Subir imágenes si hay
      for (let img of nuevoProducto.imagenes) {
        const formData = new FormData();
        formData.append('imagen', img);
        formData.append('productos_id_productos', data.id_producto);
        await fetch('http://localhost:3000/api/imagenes_productos', {
          method: 'POST',
          body: formData
        });
      }
      alert('Producto creado con éxito');
      // Recargar productos
      fetch(`http://localhost:3000/api/productos?provedor_negocio_id_provedor=${proveedor.id_provedor}`)
        .then(res => res.json())
        .then(setProductos);
    }
  };

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

  const handleServicioSubmit = async (e) => {
    e.preventDefault();
    if (!proveedor) {
      console.error('No hay proveedor autenticado');
      return;
    }
    if (!servicioForm.nombre || !servicioForm.descripcion || !servicioForm.tipo_servicio || !servicioForm.precio) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
    try {
      // 1. Crear el servicio
      const res = await fetch('http://localhost:3000/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: servicioForm.nombre,
          descripcion: servicioForm.descripcion,
          tipo_servicio: servicioForm.tipo_servicio,
          precio: servicioForm.precio,
          provedor_negocio_id_provedor: proveedor.id_provedor
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert('Error al crear el servicio: ' + (data.error || 'Error desconocido'));
        return;
      }
      if (data.id_servicio) {
        // 2. Subir imágenes si hay
        for (let img of servicioForm.imagenes) {
          const formData = new FormData();
          formData.append('imagen', img);
          formData.append('SERVICIO_id_servicio', data.id_servicio);
          await fetch('http://localhost:3000/api/imagenes_servicio', {
            method: 'POST',
            body: formData
          });
        }
        alert('Servicio creado con éxito');
        // Aquí puedes recargar la lista de servicios si lo deseas
      }
    } catch (error) {
      console.error('Error en el submit del servicio:', error);
      alert('Ocurrió un error al enviar el formulario. Revisa la consola para más detalles.');
    }
  };

  const handleProductoSubmit = (e) => {
    e.preventDefault();
    handleCrearProducto(productoForm);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Publicaciones</h1>
          <p className="mt-2 text-gray-600">Gestiona tus servicios y productos publicados</p>
        </div>

        {/* Tabla unificada de publicaciones */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {publicaciones.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">No hay publicaciones activas.</td>
                    </tr>
                  ) : (
                    publicaciones.map(pub => (
                      <tr key={pub.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{pub.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pub.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pub.descripcion}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${pub.precio}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button onClick={() => handleVer(pub)} className="text-blue-600 hover:text-blue-900 mr-2">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleEditar(pub)} className="text-green-600 hover:text-green-900 mr-2">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleEliminar(pub)} className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* El resto de la lógica para crear nuevas publicaciones */}
        {tipoVendedor === 'selector' ? (
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
        ) : tipoVendedor === 'servicios' ? (
          <div className="mt-8">
            <ServicioForm />
          </div>
        ) : tipoVendedor === 'productos' ? (
          <div className="mt-8">
            <ProductoForm />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Publications; 