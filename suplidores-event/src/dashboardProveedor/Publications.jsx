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
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentTextIcon
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
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const navigate = useNavigate();
  const [limiteFotosProducto, setLimiteFotosProducto] = useState(8); // valor por defecto
  const [errorImagenesProducto, setErrorImagenesProducto] = useState('');
  const [limiteFotosServicio, setLimiteFotosServicio] = useState(8); // valor por defecto
  const [errorImagenesServicio, setErrorImagenesServicio] = useState('');
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [membresia, setMembresia] = useState(null);
  const [loadingMembresia, setLoadingMembresia] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }
    // Obtener el negocio activo
    const negocioActivoId = localStorage.getItem('negocio_activo');
    fetch('http://localhost:3000/proveedores')
      .then(res => res.json())
      .then(data => {
        let prov;
        if (negocioActivoId) {
          prov = data.find(p => p.id_provedor === Number(negocioActivoId));
        }
        if (!prov) {
          prov = data.find(p => p.PERSONA_id_persona === user.PERSONA_id_persona);
        }
        setProveedor(prov);
        if (prov) {
          // Obtener membresía
          fetch(`http://localhost:3000/membresia/${prov.id_provedor}`)
            .then(res => res.json())
            .then(membresiaData => {
              setMembresia(membresiaData);
              setLoadingMembresia(false);
            })
            .catch(() => setLoadingMembresia(false));
          // Obtener límite de fotos para productos
          fetch(`http://localhost:3000/api/limite-fotos?provedor_negocio_id_provedor=${prov.id_provedor}`)
            .then(res => {
              if (!res.ok) {
                if (res.status === 404) {
                  // No tienes membresía activa, ignora el límite
                  return { limite_fotos: 0 };
                }
                throw new Error('Error al obtener el límite de fotos');
              }
              return res.json();
            })
            .then(data => {
              setLimiteFotosProducto(data.limite_fotos || 0);
              setLimiteFotosServicio(data.limite_fotos || 0);
            })
            .catch(() => {
              setLimiteFotosProducto(0);
              setLimiteFotosServicio(0);
            });
          // Obtener productos del proveedor
          fetch(`http://localhost:3000/api/productos?provedor_negocio_id_provedor=${prov.id_provedor}`)
            .then(res => {
              if (!res.ok) {
                if (res.status === 403) {
                  setProductos([]);
                  return [];
                }
                throw new Error('Error al obtener productos');
              }
              return res.json();
            })
            .then(setProductos)
            .catch(() => setProductos([]));
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

  const handleImagenesChange = (e) => {
    setErrorImagenesProducto('');
    const files = Array.from(e.target.files);
    let nuevasImagenes = [...productoForm.imagenes, ...files];

    // Elimina duplicados por nombre y tamaño
    nuevasImagenes = nuevasImagenes.filter(
      (img, idx, arr) => arr.findIndex(i => i.name === img.name && i.size === img.size) === idx
    );

    if (nuevasImagenes.length > limiteFotosProducto) {
      setErrorImagenesProducto(`Solo puedes subir hasta ${limiteFotosProducto} imágenes según tu membresía.`);
      nuevasImagenes = nuevasImagenes.slice(0, limiteFotosProducto);
    }

    setProductoForm(prev => ({
      ...prev,
      imagenes: nuevasImagenes
    }));
  };

  const handleImagenesServicioChange = (e) => {
    setErrorImagenesServicio('');
    const files = Array.from(e.target.files);
    let nuevasImagenes = [...servicioForm.imagenes, ...files];
    // Elimina duplicados por nombre y tamaño
    nuevasImagenes = nuevasImagenes.filter(
      (img, idx, arr) => arr.findIndex(i => i.name === img.name && i.size === img.size) === idx
    );
    if (nuevasImagenes.length > limiteFotosServicio) {
      setErrorImagenesServicio(`Solo puedes subir hasta ${limiteFotosServicio} imágenes según tu membresía.`);
      nuevasImagenes = nuevasImagenes.slice(0, limiteFotosServicio);
    }
    setServicioForm(prev => ({
      ...prev,
      imagenes: nuevasImagenes
    }));
  };

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
  const handleVer = async (pub) => {
    setSelectedPublication(pub);
    setShowPreviewModal(true);
    setCurrentImageIdx(0);
    
    if (pub.tipo === 'Producto') {
      try {
        const res = await fetch(`http://localhost:3000/api/imagenes_productos/por-producto/${pub.id_productos}`);
        const imgs = await res.json();
        setImagenes(prev => ({
          ...prev,
          [pub.id_productos]: imgs
        }));
      } catch (error) {
        console.error('Error al cargar imágenes del producto:', error);
      }
    }
  };

  // Acción: Editar publicación
  const handleEditar = (pub) => {
    if (pub.tipo === 'Producto') {
      navigate(`/productos/editar/${pub.id_productos}`);
    } else {
      navigate(`/servicios/editar/${pub.id_servicio}`);
    }
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

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Nuevo componente de formulario de servicio
  const ServicioForm = () => {
    const [formData, setFormData] = useState({
      nombre: '',
      descripcion: '',
      tipo_servicio: '',
      precio: '',
      imagenes: []
    });
    const [loading, setLoading] = useState(false);
    const [alreadyClicked, setAlreadyClicked] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...files].slice(0, limiteFotosServicio)
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (loading || alreadyClicked) {
        alert('Ya se está procesando la publicación. Por favor espera.');
        return;
      }
      setLoading(true);
      setAlreadyClicked(true);
      if (!proveedor) {
        console.error('No hay proveedor autenticado');
        setLoading(false);
        setAlreadyClicked(false);
        return;
      }

      try {
        // Crear el servicio
        const res = await fetch('http://localhost:3000/api/servicios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            tipo_servicio: formData.tipo_servicio,
            precio: formData.precio,
            provedor_negocio_id_provedor: proveedor.id_provedor
          })
        });

        const data = await res.json();
        if (data.id_servicio) {
          // Subir imágenes
          for (let img of formData.imagenes) {
            const formDataImg = new FormData();
            formDataImg.append('imagen', img);
            formDataImg.append('SERVICIO_id_servicio', data.id_servicio);
            await fetch('http://localhost:3000/api/imagenes_servicio', {
              method: 'POST',
              body: formDataImg
            });
          }

          alert('Servicio creado con éxito');
          setTipoVendedor('selector');
          // Recargar servicios
          const servs = await fetch('http://localhost:3000/api/servicios').then(res => res.json());
          const misServicios = servs.filter(s => s.provedor_negocio_id_provedor === proveedor.id_provedor);
          setServicios(misServicios);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el servicio');
      } finally {
        setLoading(false);
        setAlreadyClicked(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
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
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
              <select
                name="tipo_servicio"
                value={formData.tipo_servicio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Seleccione una categoría</option>
                <option value="Comida y Bebidas">Comida y Bebidas</option>
                <option value="Catering">Catering</option>
                <option value="Decoración">Decoración</option>
                <option value="Entretenimiento">Entretenimiento</option>
                <option value="Fotografía y Video">Fotografía y Video</option>
                <option value="Música">Música</option>
                <option value="Coordinación de Eventos">Coordinación de Eventos</option>
                <option value="Lugar y Espacio">Lugar y Espacio</option>
                <option value="Mobiliario y Equipos">Mobiliario y Equipos</option>
                <option value="Transporte">Transporte</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
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
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
              <div className="text-xs text-gray-500 mb-1">Puedes subir hasta {limiteFotosServicio} imágenes según tu membresía.</div>
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
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                  {formData.imagenes.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-700 text-left">
                      {formData.imagenes.map((img, idx) => (
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
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar Servicio'}
          </button>
        </div>
      </form>
    );
  };

  // Nuevo componente de formulario de producto
  const ProductoForm = () => {
    const [formData, setFormData] = useState({
      nombre: '',
      descripcion: '',
      precio: '',
      tipo_producto: '',
      categoria: '',
      imagenes: []
    });
    const [loading, setLoading] = useState(false);
    const [alreadyClicked, setAlreadyClicked] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...files].slice(0, limiteFotosProducto)
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (loading || alreadyClicked) {
        alert('Ya se está procesando la publicación. Por favor espera.');
        return;
      }
      setLoading(true);
      setAlreadyClicked(true);
      if (!proveedor) {
        console.error('No hay proveedor autenticado');
        setLoading(false);
        setAlreadyClicked(false);
        return;
      }

      try {
        // Crear el producto
        const res = await fetch('http://localhost:3000/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio: formData.precio,
            tipo_producto: formData.tipo_producto,
            categoria: formData.categoria,
            provedor_negocio_id_provedor: proveedor.id_provedor
          })
        });

        const data = await res.json();
        if (data.id_producto) {
          // Subir imágenes
          for (let img of formData.imagenes) {
            const formDataImg = new FormData();
            formDataImg.append('imagen', img);
            formDataImg.append('productos_id_productos', data.id_producto);
            await fetch('http://localhost:3000/api/imagenes_productos', {
              method: 'POST',
              body: formDataImg
            });
          }

          alert('Producto creado con éxito');
          setTipoVendedor('selector');
          // Recargar productos
          const prods = await fetch(`http://localhost:3000/api/productos?provedor_negocio_id_provedor=${proveedor.id_provedor}`).then(res => res.json());
          setProductos(prods);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el producto');
      } finally {
        setLoading(false);
        setAlreadyClicked(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Nuevo Producto</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Producto</label>
              <select
                name="tipo_producto"
                value={formData.tipo_producto}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Seleccione una categoría</option>
                <option value="Floristería">Floristería (Flores, Arreglos, Ramos)</option>
                <option value="Decoración">Decoración (Centros de mesa, Globos, Accesorios)</option>
                <option value="Mobiliario">Mobiliario (Mesas, Sillas, Carpas)</option>
                <option value="Iluminación">Iluminación (Luces, Candiles, Lámparas)</option>
                <option value="Vajilla">Vajilla (Platos, Copas, Cubiertos)</option>
                <option value="Textiles">Textiles (Manteles, Servilletas, Cortinas)</option>
                <option value="Recuerdos">Recuerdos (Souvenirs, Detalles, Regalos)</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Opcional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
              <div className="text-xs text-gray-500 mb-1">Puedes subir hasta {limiteFotosProducto} imágenes según tu membresía.</div>
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
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                  {formData.imagenes.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-700 text-left flex flex-wrap gap-2">
                      {formData.imagenes.map((img, idx) => (
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
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar Producto'}
          </button>
        </div>
      </form>
    );
  };

  if (loadingMembresia) {
    return <div className="p-8 text-center">Cargando membresía...</div>;
  }
  if (membresia && membresia.estado && membresia.estado.toLowerCase() === 'vencida') {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">¡Membresía vencida!</strong>
          <span className="block sm:inline ml-2">No puedes publicar productos ni servicios hasta renovar tu membresía.</span>
          <a href="/dashboard-proveedor/membresia" className="ml-4 underline text-red-800 font-semibold">Renovar ahora</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Publicaciones</h1>
          <p className="text-lg text-gray-600">Gestiona tus servicios y productos publicados</p>
        </div>

        {/* Tabla unificada de publicaciones */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Publicaciones Activas</h2>
              <button
                onClick={() => setTipoVendedor('selector')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nueva Publicación
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {publicaciones.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-lg">No hay publicaciones activas</p>
                          <button
                            onClick={() => setTipoVendedor('selector')}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Crear primera publicación
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    publicaciones.map(pub => (
                      <tr key={pub.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] break-words">{pub.nombre}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pub.tipo === 'Producto' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {pub.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div 
                            className="text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors group"
                            onClick={() => toggleDescription(pub.id)}
                          >
                            <div className={`${expandedDescriptions[pub.id] ? 'whitespace-normal' : 'line-clamp-2'} break-words max-w-[250px] transition-all duration-200`}>
                              {pub.descripcion.split(' ').length > 6 && !expandedDescriptions[pub.id] 
                                ? `${pub.descripcion.split(' ').slice(0, 6).join(' ')}...` 
                                : pub.descripcion}
                              {pub.descripcion.split(' ').length > 6 && (
                                <span className="text-blue-600 ml-1 group-hover:underline">
                                  {expandedDescriptions[pub.id] ? 'Leer menos' : 'Leer más'}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${pub.precio}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => handleVer(pub)} 
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                              title="Ver detalles"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleEditar(pub)} 
                              className="text-green-600 hover:text-green-900 transition-colors duration-150"
                              title="Editar publicación"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleEliminar(pub)} 
                              className="text-red-600 hover:text-red-900 transition-colors duration-150"
                              title="Eliminar publicación"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selector de tipo de publicación */}
        {tipoVendedor === 'selector' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 transform transition-all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">¿Qué deseas publicar?</h2>
                <button
                  onClick={() => setTipoVendedor(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setTipoVendedor('servicios')}
                  className="p-6 border rounded-xl hover:bg-gray-50 text-center transition-all duration-200 hover:shadow-md"
                >
                  <span className="block text-4xl mb-4">🎯</span>
                  <span className="text-xl font-medium text-gray-900">Servicios</span>
                  <p className="mt-2 text-gray-600">Publica tus servicios para eventos</p>
                </button>
                <button
                  onClick={() => setTipoVendedor('productos')}
                  className="p-6 border rounded-xl hover:bg-gray-50 text-center transition-all duration-200 hover:shadow-md"
                >
                  <span className="block text-4xl mb-4">📦</span>
                  <span className="text-xl font-medium text-gray-900">Productos</span>
                  <p className="mt-2 text-gray-600">Publica tus productos para eventos</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formularios */}
        {tipoVendedor === 'servicios' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
              <ServicioForm />
            </div>
          </div>
        )}

        {tipoVendedor === 'productos' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
              <ProductoForm />
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreviewModal && selectedPublication && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-150"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Carrusel de imágenes para servicios */}
                {selectedPublication.tipo === 'Servicio' && imagenesServicios[selectedPublication.id]?.length > 0 && (
                  <div className="flex flex-col items-center md:w-80 w-full">
                    <div className="relative w-full flex justify-center items-center">
                      <button
                        onClick={() => setCurrentImageIdx(prev => prev === 0 ? imagenesServicios[selectedPublication.id].length - 1 : prev - 1)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow hover:bg-gray-200 z-10"
                        style={{ display: imagenesServicios[selectedPublication.id].length > 1 ? 'block' : 'none' }}
                        aria-label="Anterior"
                      >
                        &#8592;
                      </button>
                      <img
                        src={`http://localhost:3000/api/imagenes_servicio/${imagenesServicios[selectedPublication.id][currentImageIdx].id_imagenes}`}
                        alt={selectedPublication.nombre}
                        className="w-full h-64 object-cover bg-gray-100 rounded-lg"
                        style={{ maxWidth: 320 }}
                      />
                      <button
                        onClick={() => setCurrentImageIdx(prev => prev === imagenesServicios[selectedPublication.id].length - 1 ? 0 : prev + 1)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow hover:bg-gray-200 z-10"
                        style={{ display: imagenesServicios[selectedPublication.id].length > 1 ? 'block' : 'none' }}
                        aria-label="Siguiente"
                      >
                        &#8594;
                      </button>
                    </div>
                    {/* Miniaturas */}
                    {imagenesServicios[selectedPublication.id].length > 1 && (
                      <div className="flex gap-2 mt-2 justify-center">
                        {imagenesServicios[selectedPublication.id].map((img, idx) => (
                          <img
                            key={img.id_imagenes}
                            src={`http://localhost:3000/api/imagenes_servicio/${img.id_imagenes}`}
                            alt={`Miniatura ${idx + 1}`}
                            className={`w-12 h-12 object-cover rounded cursor-pointer border-2 ${idx === currentImageIdx ? 'border-blue-500' : 'border-transparent'}`}
                            onClick={() => setCurrentImageIdx(idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Carrusel de imágenes para productos */}
                {selectedPublication.tipo === 'Producto' && imagenes[selectedPublication.id]?.length > 0 && (
                  <div className="flex flex-col items-center md:w-80 w-full">
                    <div className="relative w-full flex justify-center items-center">
                      <button
                        onClick={() => setCurrentImageIdx(prev => prev === 0 ? imagenes[selectedPublication.id].length - 1 : prev - 1)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow hover:bg-gray-200 z-10"
                        style={{ display: imagenes[selectedPublication.id].length > 1 ? 'block' : 'none' }}
                        aria-label="Anterior"
                      >
                        &#8592;
                      </button>
                      <img
                        src={`http://localhost:3000/api/imagenes_productos/${imagenes[selectedPublication.id][currentImageIdx].id_imagenes}`}
                        alt={selectedPublication.nombre}
                        className="w-full h-64 object-cover bg-gray-100 rounded-lg"
                        style={{ maxWidth: 320 }}
                      />
                      <button
                        onClick={() => setCurrentImageIdx(prev => prev === imagenes[selectedPublication.id].length - 1 ? 0 : prev + 1)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow hover:bg-gray-200 z-10"
                        style={{ display: imagenes[selectedPublication.id].length > 1 ? 'block' : 'none' }}
                        aria-label="Siguiente"
                      >
                        &#8594;
                      </button>
                    </div>
                    {/* Miniaturas */}
                    {imagenes[selectedPublication.id].length > 1 && (
                      <div className="flex gap-2 mt-2 justify-center">
                        {imagenes[selectedPublication.id].map((img, idx) => (
                          <img
                            key={img.id_imagenes}
                            src={`http://localhost:3000/api/imagenes_productos/${img.id_imagenes}`}
                            alt={`Miniatura ${idx + 1}`}
                            className={`w-12 h-12 object-cover rounded cursor-pointer border-2 ${idx === currentImageIdx ? 'border-blue-500' : 'border-transparent'}`}
                            onClick={() => setCurrentImageIdx(idx)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex-1 flex flex-col gap-4">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#cbb4db' }}>{selectedPublication.nombre}</h2>
                  <div className="text-gray-700 mb-2">{selectedPublication.descripcion}</div>
                  <div className="text-lg font-bold mb-2" style={{ color: '#fbaccb' }}>Precio: ${selectedPublication.precio}</div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#cbb4db' }}>Vendedor</h3>
                    {proveedor ? (
                      <div className="rounded-lg p-4" style={{ background: '#f3e8ff', color: '#012e33' }}>
                        <div><span className="font-semibold">Empresa:</span> {proveedor.nombre_empresa}</div>
                        <div><span className="font-semibold">Email:</span> {proveedor.email_empresa}</div>
                        <div><span className="font-semibold">Teléfono:</span> {proveedor.telefono_empresa}</div>
                        <div><span className="font-semibold">Dirección:</span> {proveedor.direccion}</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No se encontró información del proveedor.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications; 