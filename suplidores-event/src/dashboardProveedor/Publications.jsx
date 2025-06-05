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
import { useAuth } from '../context/AuthContext';
import { useActiveBusiness } from '../context/ActiveBusinessContext.jsx';

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
  const [imagenes, setImagenes] = useState({}); // { id_producto: [id_imagenes, ...] }
  const [servicios, setServicios] = useState([]);
  const [imagenesServicios, setImagenesServicios] = useState({}); // { id_servicio: [id_imagenes, ...] }
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const navigate = useNavigate();
  const [limiteFotosProducto, setLimiteFotosProducto] = useState(0); // Inicializar en 0
  const [errorImagenesProducto, setErrorImagenesProducto] = useState('');
  const [limiteFotosServicio, setLimiteFotosServicio] = useState(0); // Inicializar en 0
  const [errorImagenesServicio, setErrorImagenesServicio] = useState('');
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [membresia, setMembresia] = useState(null);
  const [loadingMembresia, setLoadingMembresia] = useState(true);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { activeBusiness } = useActiveBusiness();

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !activeBusiness?.id) {
        setError('Selecciona un negocio en la sección "Negocios" para ver las publicaciones.');
        setLoading(false);
        return;
      }
      const proveedorId = activeBusiness.id;

      try {
        // Obtener datos del proveedor logueado
        const resProveedor = await fetch(`https://spectacular-recreation-production.up.railway.app/proveedores/${proveedorId}`, { credentials: 'include' });
        if (!resProveedor.ok) throw new Error('Error al obtener datos del proveedor');
        const dataProveedor = await resProveedor.json();
        setProveedor(dataProveedor);

        // Obtener membresía
        const membresiaRes = await fetch(`https://spectacular-recreation-production.up.railway.app/membresia/${proveedorId}`, { credentials: 'include' });
        const membresiaData = await membresiaRes.json();
        setMembresia(membresiaData);
        setLoadingMembresia(false);

        // Obtener límite de fotos
        // Asumiendo que la membresía contiene la información o hay un endpoint para esto
        // Si tu API no tiene un endpoint específico, ajusta esto para obtener el límite de la membresía
        const limiteResponse = await fetch(`https://spectacular-recreation-production.up.railway.app/api/limite-fotos?provedor_negocio_id_provedor=${proveedorId}`, { credentials: 'include' });
         if (!limiteResponse.ok && limiteResponse.status !== 404) {
             throw new Error('Error al obtener el límite de fotos');
         }
         const limiteData = limiteResponse.status === 404 ? { limite_fotos: 0 } : await limiteResponse.json();
        setLimiteFotosProducto(limiteData.limite_fotos || 0);
        setLimiteFotosServicio(limiteData.limite_fotos || 0);

        // Obtener productos del proveedor
        const productosRes = await fetch(`https://spectacular-recreation-production.up.railway.app/api/productos?provedor_negocio_id_provedor=${proveedorId}`, { credentials: 'include' });
        if (!productosRes.ok && productosRes.status !== 403) throw new Error('Error al obtener productos');
        const productosData = productosRes.status === 403 ? [] : await productosRes.json();
        setProductos(productosData);

        // Obtener servicios del proveedor
        const serviciosRes = await fetch(`https://spectacular-recreation-production.up.railway.app/api/servicios?provedor_negocio_id_provedor=${proveedorId}`, { credentials: 'include' });
        const serviciosData = serviciosRes.status === 403 ? [] : await serviciosRes.json();
        setServicios(serviciosData);

        // Obtener imágenes para productos
        const imagenesProductosMap = {};
        for (const prod of productosData) {
            const imgRes = await fetch(`https://spectacular-recreation-production.up.railway.app/api/imagenes_productos/por-producto/${prod.id_productos}`, { credentials: 'include' });
            if (imgRes.ok) {
                imagenesProductosMap[prod.id_productos] = await imgRes.json();
            }
        }
        setImagenes(imagenesProductosMap);

        // Obtener imágenes para servicios
        const imagenesServiciosMap = {};
        for (const serv of serviciosData) {
             const imgRes = await fetch(`https://spectacular-recreation-production.up.railway.app/api/imagenes_servicio/por-servicio/${serv.id_servicio}`, { credentials: 'include' });
             if (imgRes.ok) {
                 imagenesServiciosMap[serv.id_servicio] = await imgRes.json();
             }
        }
        setImagenesServicios(imagenesServiciosMap);

        setLoading(false);

      } catch (err) {
        console.error('Error fetching data in Publications:', err);
        setError(err.message || 'Error al cargar datos');
        setLoading(false);
        setLoadingMembresia(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated, authLoading, activeBusiness]);

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

    if (limiteFotosProducto > 0 && nuevasImagenes.length > limiteFotosProducto) {
      setErrorImagenesProducto(`Solo puedes subir hasta ${limiteFotosProducto} imágenes según tu membresía.`);
      nuevasImagenes = nuevasImagenes.slice(0, limiteFotosProducto);
    } else if (limiteFotosProducto === 0) {
         setErrorImagenesProducto('No puedes subir imágenes con tu membresía actual.');
         nuevasImagenes = [];
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
    if (limiteFotosServicio > 0 && nuevasImagenes.length > limiteFotosServicio) {
      setErrorImagenesServicio(`Solo puedes subir hasta ${limiteFotosServicio} imágenes según tu membresía.`);
      nuevasImagenes = nuevasImagenes.slice(0, limiteFotosServicio);
    } else if (limiteFotosServicio === 0) {
         setErrorImagenesServicio('No puedes subir imágenes con tu membresía actual.');
         nuevasImagenes = [];
    }
    setServicioForm(prev => ({
      ...prev,
      imagenes: nuevasImagenes
    }));
  };

  // Función para crear producto
  const handleCrearProducto = async (nuevoProducto) => {
    if (!proveedor?.id_provedor) {
        console.error('ID de proveedor no disponible para crear producto');
        alert('Error: Información del proveedor no disponible.');
        return false;
    }
    // Crear producto
    try {
        const res = await fetch('https://spectacular-recreation-production.up.railway.app/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nuevoProducto.nombre,
            descripcion: nuevoProducto.descripcion,
            precio: nuevoProducto.precio,
            tipo_producto: nuevoProducto.tipo_producto,
            categoria: nuevoProducto.categoria,
            provedor_negocio_id_provedor: proveedor.id_provedor
          })
        });

        const data = await res.json();
        if (!res.ok) {
             console.error('Error response creating product:', data);
            alert('Error al crear el producto: ' + (data.error || 'Error desconocido'));
            return false;
        }

        if (data.id_producto) {
          // Subir imágenes si hay
          for (let img of nuevoProducto.imagenes) {
            const formData = new FormData();
            formData.append('imagen', img);
            formData.append('productos_id_productos', data.id_producto); // Usar el ID correcto
            await fetch('https://spectacular-recreation-production.up.railway.app/api/imagenes_productos', {
              method: 'POST',
              body: formData,
              credentials: 'include'
            });
          }
          alert('Producto creado con éxito');
          return true;
        } else {
             console.error('Product creation did not return id:', data);
             alert('Error al crear el producto: ID no retornado.');
             return false;
        }

    } catch (error) {
        console.error('Error in handleCrearProducto:', error);
        alert('Ocurrió un error al crear el producto.');
        return false;
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

    // Asegúrate de que el estado existe en statusStyles antes de acceder
    const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
    const icon = statusIcons[status] || <DocumentTextIcon className="w-4 h-4" />;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
        {icon}
        <span className="ml-1 capitalize">{status || 'desconocido'}</span>
      </span>
    );
  };

  const handleServicioSubmit = async (e) => {
    e.preventDefault();
    if (!proveedor?.id_provedor) {
      console.error('No hay proveedor autenticado para crear servicio');
      alert('Error: Información del proveedor no disponible.');
      return;
    }
    if (!servicioForm.nombre || !servicioForm.descripcion || !servicioForm.tipo_servicio || !servicioForm.precio) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }
    try {
      // 1. Crear el servicio
      const res = await fetch('https://spectacular-recreation-production.up.railway.app/api/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: servicioForm.nombre,
          descripcion: servicioForm.descripcion,
          tipo_servicio: servicioForm.tipo_servicio,
          precio: servicioForm.precio,
          provedor_negocio_id_provedor: proveedor.id_provedor,
           estado: 'pending' // O el estado inicial que uses
        }),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) {
         console.error('Error response creating service:', data);
        alert('Error al crear el servicio: ' + (data.error || 'Error desconocido'));
        return;
      }
      if (data.id_servicio) {
        // 2. Subir imágenes si hay
        for (let img of servicioForm.imagenes) {
          const formData = new FormData();
          formData.append('imagen', img);
          formData.append('SERVICIO_id_servicio', data.id_servicio);
          await fetch('https://spectacular-recreation-production.up.railway.app/api/imagenes_servicio', {
            method: 'POST',
            body: formData,
            credentials: 'include'
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
        setTipoVendedor('selector'); // Volver al selector
        // Recargar la lista de servicios
        const servs = await fetch(`https://spectacular-recreation-production.up.railway.app/api/servicios?provedor_negocio_id_provedor=${proveedor.id_provedor}`, { credentials: 'include' }).then(res => res.json());
        setServicios(servs);
      } else {
          console.error('Service creation did not return id:', data);
          alert('Error al crear el servicio: ID no retornado.');
      }
    } catch (error) {
      console.error('Error en el submit del servicio:', error);
      alert('Ocurrió un error al enviar el formulario. Revisa la consola para más detalles.');
    }
  };

  const handleProductoSubmit = async (e) => {
    e.preventDefault();
    const success = await handleCrearProducto(productoForm);
    if (success) {
        setTipoVendedor('selector'); // Volver al selector si se creó con éxito
         // Recargar productos
        const prods = await fetch(`https://spectacular-recreation-production.up.railway.app/api/productos?provedor_negocio_id_provedor=${proveedor.id_provedor}`, { credentials: 'include' }).then(res => res.json());
        setProductos(prods);
    }
  };

  const handleEliminarServicio = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      return;
    }
     if (!proveedor?.id_provedor) {
        alert('Error: Información del proveedor no disponible.');
        return;
     }
    try {
      const res = await fetch(`https://spectacular-recreation-production.up.railway.app/api/servicios/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
         const errorData = await res.json();
        throw new Error('Error al eliminar el servicio: ' + (errorData.error || 'desconocido'));
      }
      // Actualizar la lista de servicios
      const servs = await fetch(`https://spectacular-recreation-production.up.railway.app/api/servicios?provedor_negocio_id_provedor=${proveedor.id_provedor}`, { credentials: 'include' }).then(res => res.json());
      setServicios(servs);
      alert('Servicio eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando servicio:', error);
      alert(error.message || 'Error al eliminar el servicio');
    }
  };

  // Unificar productos y servicios en una sola lista de publicaciones
  const publicaciones = [
    ...productos.map(p => ({ ...p, tipo: 'Producto', id: p.id_productos, estado: p.estado || 'draft' })), // Asigna un estado por defecto si no existe
    ...servicios.map(s => ({ ...s, tipo: 'Servicio', id: s.id_servicio, estado: s.estado || 'draft' })) // Asigna un estado por defecto si no existe
  ];

  // Acción: Ver publicación
  const handleVer = async (pub) => {
    setSelectedPublication(pub);
    setShowPreviewModal(true);
    setCurrentImageIdx(0);

    // Cargar imágenes dinámicamente solo si no se han cargado aún para esta publicación
    if (pub.tipo === 'Producto' && !imagenes[pub.id]) {
      try {
        const res = await fetch(`https://spectacular-recreation-production.up.railway.app/api/imagenes_productos/por-producto/${pub.id}`, { credentials: 'include' });
        const imgs = await res.json();
        setImagenes(prev => ({
          ...prev,
          [pub.id]: imgs
        }));
      } catch (error) {
        console.error('Error al cargar imágenes del producto:', error);
         setImagenes(prev => ({ ...prev, [pub.id]: [] })); // Asegura que se establece un array vacío en caso de error
      }
    } else if (pub.tipo === 'Servicio' && !imagenesServicios[pub.id]) {
         try {
             const res = await fetch(`https://spectacular-recreation-production.up.railway.app/api/imagenes_servicio/por-servicio/${pub.id}`, { credentials: 'include' });
             const imgs = await res.json();
             setImagenesServicios(prev => ({
                 ...prev,
                 [pub.id]: imgs
             }));
         } catch (error) {
             console.error('Error al cargar imágenes del servicio:', error);
              setImagenesServicios(prev => ({ ...prev, [pub.id]: [] })); // Asegura que se establece un array vacío en caso de error
         }
    }


  };

  // Acción: Editar publicación
  const handleEditar = (pub) => {
    if (pub.tipo === 'Producto') {
      navigate(`/dashboard-proveedor/productos/editar/${pub.id}`);
    } else {
      navigate(`/dashboard-proveedor/servicios/editar/${pub.id}`);
    }
  };

  // Acción: Eliminar publicación
  const handleEliminar = async (pub) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) return;
     if (!proveedor?.id_provedor) {
        alert('Error: Información del proveedor no disponible.');
        return;
     }
    try {
      if (pub.tipo === 'Producto') {
        const res = await fetch(`https://spectacular-recreation-production.up.railway.app/api/productos/${pub.id}`, { method: 'DELETE', credentials: 'include' });
        if (!res.ok) {
             const errorData = await res.json();
            throw new Error('Error al eliminar el producto: ' + (errorData.error || 'desconocido'));
        }
        // Actualizar productos
        const prods = await fetch(`https://spectacular-recreation-production.up.railway.app/api/productos?provedor_negocio_id_provedor=${proveedor.id_provedor}`, { credentials: 'include' }).then(res => res.json());
        setProductos(prods);
      } else {
        const res = await fetch(`https://spectacular-recreation-production.up.railway.app/api/servicios/${pub.id}`, { method: 'DELETE', credentials: 'include' });
         if (!res.ok) {
             const errorData = await res.json();
            throw new Error('Error al eliminar el servicio: ' + (errorData.error || 'desconocido'));
        }
        // Actualizar servicios
        const servs = await fetch(`https://spectacular-recreation-production.up.railway.app/api/servicios?provedor_negocio_id_provedor=${proveedor.id_provedor}`, { credentials: 'include' }).then(res => res.json());
        setServicios(servs);
      }
      alert('Publicación eliminada exitosamente');
    } catch (error) {
        console.error('Error eliminando publicación:', error);
      alert(error.message || 'Error al eliminar la publicación');
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Nuevo componente de formulario de servicio (ajustado para usar estado local)
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
    const [formError, setFormError] = useState(null);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setFormError(null); // Limpiar errores al cambiar input
    };

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      let nuevasImagenes = [...formData.imagenes, ...files];

      // Elimina duplicados por nombre y tamaño
      nuevasImagenes = nuevasImagenes.filter(
        (img, idx, arr) => arr.findIndex(i => i.name === img.name && i.size === img.size) === idx
      );

      if (limiteFotosServicio > 0 && nuevasImagenes.length > limiteFotosServicio) {
        setErrorImagenesServicio(`Solo puedes subir hasta ${limiteFotosServicio} imágenes según tu membresía.`);
        nuevasImagenes = nuevasImagenes.slice(0, limiteFotosServicio);
      } else if (limiteFotosServicio === 0) {
           setErrorImagenesServicio('No puedes subir imágenes con tu membresía actual.');
           nuevasImagenes = [];
      } else {
           setErrorImagenesServicio(''); // Clear error if within limit
      }

      setFormData(prev => ({
        ...prev,
        imagenes: nuevasImagenes
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (loading || alreadyClicked) {
        setFormError('Ya se está procesando la publicación. Por favor espera.');
        return;
      }
      setLoading(true);
      setAlreadyClicked(true);
       setFormError(null); // Limpiar errores previos

      if (!proveedor?.id_provedor) {
        console.error('No hay proveedor autenticado');
        setFormError('Error: Información del proveedor no disponible.');
        setLoading(false);
        setAlreadyClicked(false);
        return;
      }

       if (!formData.nombre || !formData.descripcion || !formData.tipo_servicio || !formData.precio || formData.imagenes.length === 0) {
           setFormError('Por favor, completa todos los campos y sube al menos una imagen.');
           setLoading(false);
           setAlreadyClicked(false);
           return;
       }

      try {
        // Crear el servicio
        const res = await fetch('https://spectacular-recreation-production.up.railway.app/api/servicios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            tipo_servicio: formData.tipo_servicio,
            precio: formData.precio,
            provedor_negocio_id_provedor: proveedor.id_provedor,
             estado: 'pending' // O el estado inicial que uses
          })
        });

        const data = await res.json();
        if (!res.ok) {
            console.error('Error response creating service:', data);
            setFormError('Error al crear el servicio: ' + (data.error || 'Error desconocido'));
            return;
        }

        if (data.id_servicio) {
          // Subir imágenes si hay
          for (let img of formData.imagenes) {
            const formDataImg = new FormData();
            formDataImg.append('imagen', img);
            formDataImg.append('SERVICIO_id_servicio', data.id_servicio);
            await fetch('https://spectacular-recreation-production.up.railway.app/api/imagenes_servicio', {
              method: 'POST',
              body: formDataImg,
              credentials: 'include'
            });
          }

          alert('Servicio creado con éxito');
          setTipoVendedor(null); // Cerrar el modal y formulario
          // Recargar la lista de servicios
          const servs = await fetch(`https://spectacular-recreation-production.up.railway.app/api/servicios?provedor_negocio_id_provedor=${proveedor.id_provedor}`, { credentials: 'include' }).then(res => res.json());
          setServicios(servs);
        } else {
            console.error('Service creation did not return id:', data);
             setFormError('Error al crear el servicio: ID no retornado.');
        }

      } catch (error) {
        console.error('Error en el submit del servicio:', error);
        setFormError('Ocurrió un error al enviar el formulario. Revisa la consola para más detalles.');
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
            onClick={() => setTipoVendedor(null)}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

         {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {formError}
              </div>
            )}

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
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
               {limiteFotosServicio > 0 && (
                 <div className="text-xs text-gray-500 mb-1">Puedes subir hasta {limiteFotosServicio} imágenes según tu membresía.</div>
              )}
             {limiteFotosServicio === 0 && (
                 <div className="text-xs text-red-500 mb-1">Tu membresía actual no te permite subir imágenes.</div>
             )}
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
                      className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${
                         limiteFotosServicio === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
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
                         disabled={limiteFotosServicio === 0}
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
                  {errorImagenesServicio && (
                     <p className="text-xs text-red-500 mt-1">{errorImagenesServicio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setTipoVendedor(null)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
            disabled={loading || limiteFotosServicio === 0 || formData.imagenes.length === 0}
          >
            {loading ? 'Publicando...' : 'Publicar Servicio'}
          </button>
        </div>
      </form>
    );
  };

  // Nuevo componente de formulario de producto (ajustado para usar estado local)
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
     const [formError, setFormError] = useState(null);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
       setFormError(null); // Limpiar errores al cambiar input
    };

    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      let nuevasImagenes = [...formData.imagenes, ...files];

      // Elimina duplicados por nombre y tamaño
      nuevasImagenes = nuevasImagenes.filter(
        (img, idx, arr) => arr.findIndex(i => i.name === img.name && i.size === img.size) === idx
      );

      if (limiteFotosProducto > 0 && nuevasImagenes.length > limiteFotosProducto) {
        setErrorImagenesProducto(`Solo puedes subir hasta ${limiteFotosProducto} imágenes según tu membresía.`);
        nuevasImagenes = nuevasImagenes.slice(0, limiteFotosProducto);
      } else if (limiteFotosProducto === 0) {
         setErrorImagenesProducto('No puedes subir imágenes con tu membresía actual.');
         nuevasImagenes = [];
      } else {
           setErrorImagenesProducto(''); // Clear error if within limit
      }

      setFormData(prev => ({
        ...prev,
        imagenes: nuevasImagenes
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (loading || alreadyClicked) {
        setFormError('Ya se está procesando la publicación. Por favor espera.');
        return;
      }
      setLoading(true);
      setAlreadyClicked(true);
       setFormError(null); // Limpiar errores previos

      if (!proveedor?.id_provedor) {
        console.error('No hay proveedor autenticado');
        setFormError('Error: Información del proveedor no disponible.');
        setLoading(false);
        setAlreadyClicked(false);
        return;
      }

       if (!formData.nombre || !formData.descripcion || !formData.precio || !formData.tipo_producto || formData.imagenes.length === 0) {
           setFormError('Por favor, completa todos los campos y sube al menos una imagen.');
           setLoading(false);
           setAlreadyClicked(false);
           return;
       }

      try {
        // Crear el producto
        const res = await fetch('https://spectacular-recreation-production.up.railway.app/api/productos', {
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
        if (!res.ok) {
            console.error('Error response creating product:', data);
            setFormError('Error al crear el producto: ' + (data.error || 'Error desconocido'));
            return;
        }

        if (data.id_producto) {
          // Subir imágenes
          for (let img of formData.imagenes) {
            const formDataImg = new FormData();
            formDataImg.append('imagen', img);
            formDataImg.append('productos_id_productos', data.id_producto); // Usar el ID correcto
            await fetch('https://spectacular-recreation-production.up.railway.app/api/imagenes_productos', {
              method: 'POST',
              body: formDataImg,
              credentials: 'include'
            });
          }

          alert('Producto creado con éxito');
          setTipoVendedor(null); // Cerrar el modal y formulario
          // Recargar productos
          const prods = await fetch(`https://spectacular-recreation-production.up.railway.app/api/productos?provedor_negocio_id_provedor=${proveedor.id_provedor}`, { credentials: 'include' }).then(res => res.json());
          setProductos(prods);
        } else {
            console.error('Product creation did not return id:', data);
             setFormError('Error al crear el producto: ID no retornado.');
        }

      } catch (error) {
        console.error('Error en el submit del producto:', error);
        setFormError('Ocurrió un error al enviar el formulario. Revisa la consola para más detalles.');
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
            onClick={() => setTipoVendedor(null)}
            className="text-gray-500 hover:text-gray-700"
             disabled={loading}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

         {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {formError}
              </div>
            )}

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
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
               {limiteFotosProducto > 0 && (
                 <div className="text-xs text-gray-500 mb-1">Puedes subir hasta {limiteFotosProducto} imágenes según tu membresía.</div>
              )}
             {limiteFotosProducto === 0 && (
                 <div className="text-xs text-red-500 mb-1">Tu membresía actual no te permite subir imágenes.</div>
             )}
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
                      className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${
                         limiteFotosProducto === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
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
                         disabled={limiteFotosProducto === 0}
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
                  {errorImagenesProducto && (
                     <p className="text-xs text-red-500 mt-1">{errorImagenesProducto}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setTipoVendedor(null)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
            disabled={loading || limiteFotosProducto === 0 || formData.imagenes.length === 0}
          >
            {loading ? 'Publicando...' : 'Publicar Producto'}
          </button>
        </div>
      </form>
    );
  };

  if (authLoading || loadingMembresia) {
       return (
         <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
         </div>
       );
  }

   // Si no está autenticado como proveedor y no está cargando, redirigir
   if (!isAuthenticated || !activeBusiness?.id) {
       // Nota: La redirección también está en el useEffect inicial, esto es un fallback visual
        return (
            <div className="p-8 text-center text-red-700">
                No tienes permiso para ver esta página. Redirigiendo...
            </div>
        );
   }

  if (membresia && membresia.estado && membresia.estado.toLowerCase() === 'vencida') {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">¡Membresía vencida!</strong>
          <span className="block sm:inline ml-2">No puedes publicar productos ni servicios hasta renovar tu membresía.</span>
          {/* Usar Link o navigate si es un SPA, href si es recarga */}
          <a href="/dashboard-proveedor/membresia" className="ml-4 underline text-red-800 font-semibold">Renovar ahora</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {publicaciones.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(pub.estado)}
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