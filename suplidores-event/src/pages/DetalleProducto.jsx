import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetalleProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="p-8 text-center">Cargando producto...</div>;
  if (error || !producto) return <div className="p-8 text-center text-red-600">{error || 'Producto no encontrado'}</div>;

  const imagenReal = imagenes.length > 0 ? `http://localhost:3000/api/imagenes_productos/${imagenes[0].id_imagenes}` : null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
        {imagenReal && (
          <img
            src={imagenReal}
            alt={producto.nombre}
            className="w-full md:w-80 h-64 object-cover bg-gray-100 rounded-lg"
          />
        )}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-2">{producto.nombre}</h2>
          <div className="text-gray-700 mb-2">{producto.descripcion}</div>
          <div className="text-lg font-bold text-blue-900 mb-2">Precio: ${producto.precio}</div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Vendedor</h3>
            {proveedor ? (
              <div className="bg-gray-50 rounded-lg p-4">
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
  );
};

export default DetalleProducto; 