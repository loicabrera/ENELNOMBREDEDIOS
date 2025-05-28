import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [imagenesProductos, setImagenesProductos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/productos-todos')
      .then(res => res.json())
      .then(async data => {
        setProductos(data);
        const imagenesObj = {};
        await Promise.all(
          data.map(async (producto) => {
            const resImg = await fetch(`http://localhost:3000/api/imagenes_productos/por-producto/${producto.id_productos}`);
            if (resImg.ok) {
              const imgs = await resImg.json();
              imagenesObj[producto.id_productos] = imgs;
            } else {
              imagenesObj[producto.id_productos] = [];
            }
          })
        );
        setImagenesProductos(imagenesObj);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los productos');
        setLoading(false);
      });
  }, []);

  const productosFiltrados = filtroTipo ? productos.filter(p => p.tipo_producto === filtroTipo) : productos;

  if (loading) return <div className="p-8 text-center">Cargando productos...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#cbb4db' }}>Productos disponibles</h2>
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#cbb4db] focus:border-[#cbb4db]"
        >
          <option value="">Todas las categorías</option>
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
      {productosFiltrados.length === 0 ? (
        <div className="text-gray-600">No hay productos publicados.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {productosFiltrados.map(producto => {
            const imagenes = imagenesProductos[producto.id_productos] || [];
            const imagenReal = imagenes.length > 0 ? `http://localhost:3000/api/imagenes_productos/${imagenes[0].id_imagenes}` : null;
            return (
              <div
                key={producto.id_productos}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
                onClick={() => navigate(`/productos/${producto.id_productos}`)}
              >
                {imagenReal && (
                  <img
                    src={imagenReal}
                    alt={producto.nombre}
                    className="w-full h-48 object-cover bg-gray-100"
                  />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#cbb4db' }}>{producto.nombre}</h3>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Productos;
