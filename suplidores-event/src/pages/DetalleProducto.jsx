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

  useEffect(() => {
    // Obtener datos del producto
    fetch('http://localhost:3000/api/productos-todos')
      .then(res => res.json())
      .then(async productos => {
        const prod = productos.find(p => p.id_productos === Number(id));
        setProducto(prod);
        // Obtener imágenes
        const resImg = await fetch(`http://localhost:3000/api/imagenes_productos/por-producto/${id}`);
        const imgs = resImg.ok ? await resImg.json() : [];
        setImagenes(imgs);
        // Obtener proveedor
        if (prod && prod.provedor_negocio_id_provedor) {
          const resProv = await fetch(`http://localhost:3000/proveedores`);
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
  }, [id]);

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setFormMsg('');
    try {
      const res = await fetch('http://localhost:3000/usuarios', {
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

  const imagenReal = imagenes.length > 0 ? `http://localhost:3000/api/imagenes_productos/${imagenes[0].id_imagenes}` : null;

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
        {imagenReal && (
          <img
            src={imagenReal}
            alt={producto.nombre}
            className="w-full md:w-80 h-64 object-cover bg-gray-100 rounded-lg"
          />
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