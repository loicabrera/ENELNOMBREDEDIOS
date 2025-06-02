import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', comentario: '' });
  const [formMsg, setFormMsg] = useState('');
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    // Obtener datos del producto
    fetch('https://spectacular-recreation-production.up.railway.app/api/productos-todos')
      .then(res => res.json())
      .then(async productos => {
        const prod = productos.find(p => p.id_productos === Number(id));
        setProducto(prod);
        // Obtener imágenes
        const resImg = await fetch(`https://spectacular-recreation-production.up.railway.app/api/imagenes_productos/por-producto/${id}`);
        const imgs = resImg.ok ? await resImg.json() : [];
        setImagenes(imgs);
        // Obtener proveedor
        if (prod && prod.provedor_negocio_id_provedor) {
          const resProv = await fetch(`https://spectacular-recreation-production.up.railway.app/proveedores`);
          const proveedores = resProv.ok ? await resProv.json() : [];
          const prov = proveedores.find(p => p.id_provedor === prod.provedor_negocio_id_provedor);
          setProveedor(prov);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar el producto');
        setLoading(false);
      });

    // Cambia la URL después de cargar el producto
    window.history.replaceState(null, '', '/productos/detalle');
  }, [id]);

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setFormMsg('');
    // Validar teléfono
    const telefonoRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!telefonoRegex.test(form.telefono)) {
      setFormMsg('El teléfono debe tener el formato: 000-000-0000');
      return;
    }
    try {
      const res = await fetch('https://spectacular-recreation-production.up.railway.app/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          provedor_negocio_id_provedor: proveedor?.id_provedor
        })
      });
      if (res.ok) {
        setFormMsg('¡Mensaje enviado correctamente!');
        setForm({ nombre: '', email: '', telefono: '', comentario: '' });
        setTimeout(() => setModalOpen(false), 1500);
      } else {
        setFormMsg('Error al enviar el mensaje.');
      }
    } catch {
      setFormMsg('Error de conexión.');
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando producto...</div>;
  if (error || !producto) return <div className="p-8 text-center text-red-600">{error || 'Producto no encontrado'}</div>;

  // Carrusel: obtener la imagen actual
  const imagenActual = imagenes.length > 0 ? `https://spectacular-recreation-production.up.railway.app/api/imagenes_productos/${imagenes[currentImageIdx]?.id_imagenes}` : null;

  const handlePrevImage = () => {
    setCurrentImageIdx((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };
  const handleNextImage = () => {
    setCurrentImageIdx((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };
  const handleSelectImage = (idx) => {
    setCurrentImageIdx(idx);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Modal de contacto */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setModalOpen(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#cbb4db' }}>Contactar Proveedor</h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleFormChange} required className="border rounded px-3 py-2" />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleFormChange} required className="border rounded px-3 py-2" />
              <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleFormChange} required className="border rounded px-3 py-2" />
              <textarea name="comentario" placeholder="Comentario" value={form.comentario} onChange={handleFormChange} required className="border rounded px-3 py-2" />
              <button type="submit" className="bg-[#cbb4db] text-white rounded px-4 py-2 font-semibold hover:bg-[#b39cc9] transition">Enviar</button>
              {formMsg && <div className="text-center text-sm mt-2" style={{ color: formMsg.startsWith('¡') ? '#4caf50' : '#e53e3e' }}>{formMsg}</div>}
            </form>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
        {/* Carrusel de imágenes */}
        {imagenes.length > 0 && (
          <div className="flex flex-col items-center md:w-80 w-full">
            <div className="relative w-full flex justify-center items-center">
              <button
                onClick={handlePrevImage}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow hover:bg-gray-200 z-10"
                style={{ display: imagenes.length > 1 ? 'block' : 'none' }}
                aria-label="Anterior"
              >
                &#8592;
              </button>
              {imagenActual && (
                <img
                  src={imagenActual}
                  alt={producto.nombre}
                  className="w-full h-64 object-cover bg-gray-100 rounded-lg"
                  style={{ maxWidth: 320 }}
                />
              )}
              <button
                onClick={handleNextImage}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow hover:bg-gray-200 z-10"
                style={{ display: imagenes.length > 1 ? 'block' : 'none' }}
                aria-label="Siguiente"
              >
                &#8594;
              </button>
            </div>
            {/* Miniaturas */}
            {imagenes.length > 1 && (
              <div className="flex gap-2 mt-2 justify-center">
                {imagenes.map((img, idx) => (
                  <img
                    key={img.id_imagenes}
                    src={`https://spectacular-recreation-production.up.railway.app/api/imagenes_productos/${img.id_imagenes}`}
                    alt={`Miniatura ${idx + 1}`}
                    className={`w-12 h-12 object-cover rounded cursor-pointer border-2 ${idx === currentImageIdx ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => handleSelectImage(idx)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#cbb4db' }}>{producto.nombre}</h2>
          <div className="text-gray-700 mb-2">{producto.descripcion}</div>
          <div className="text-lg font-bold mb-2" style={{ color: '#fbaccb' }}>Precio: ${producto.precio}</div>
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
            {/* Botón para abrir el modal de contacto */}
            <button 
              className="mt-6 w-full px-6 py-3 bg-[#cbb4db] text-black rounded-lg hover:bg-[#b39cc9] transition-colors duration-200 font-semibold text-lg"
              onClick={() => setModalOpen(true)}
            >
              Contactar Proveedor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto; 