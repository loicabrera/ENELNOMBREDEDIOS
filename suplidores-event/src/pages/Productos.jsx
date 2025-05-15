import React, { useState, useEffect } from "react";

// Paleta de colores pastel
const colors = {
  lightBlue: "#bbe3fb",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
  mint: "#cdeff2",
  yellow: "#fff6b7",
};

// Datos simulados de productos
const productosMock = [
  {
    id_productos: 1,
    nombre: "Cámara Fotográfica",
    descripcion: "Cámara profesional para eventos y sesiones fotográficas.",
    precio: 12000.0,
    tipo_producto: "Electrónica",
    imagen:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  },
  {
    id_productos: 2,
    nombre: "Silla Tiffany",
    descripcion: "Silla elegante para bodas y eventos sociales.",
    precio: 350.0,
    tipo_producto: "Mobiliario",
    imagen:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id_productos: 3,
    nombre: "Centro de Mesa Floral",
    descripcion: "Decoración floral natural para mesas de eventos.",
    precio: 800.0,
    tipo_producto: "Decoración",
    imagen:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id_productos: 4,
    nombre: "Equipo de Sonido",
    descripcion: "Equipo profesional de audio para fiestas y conferencias.",
    precio: 5000.0,
    tipo_producto: "Electrónica",
    imagen:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id_productos: 5,
    nombre: "Mesa Redonda",
    descripcion: "Mesa redonda para banquetes y reuniones.",
    precio: 900.0,
    tipo_producto: "Mobiliario",
    imagen:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80",
  },
  {
    id_productos: 6,
    nombre: "Lámpara Decorativa",
    descripcion: "Lámpara LED para ambientar espacios de eventos.",
    precio: 450.0,
    tipo_producto: "Decoración",
    imagen:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
  },
];

function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Simulación de fetch
    setTimeout(() => {
      setProductos(productosMock);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbcbdb] via-[#cdeff2] to-[#bbe3fb] py-10 px-2">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: colors.darkTeal }}
        >
          Productos Disponibles
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productos.map((producto) => (
            <div
              key={producto.id_productos}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 transition-transform border border-[#cbb4db]"
              style={{ boxShadow: `0 4px 24px 0 ${colors.lightBlue}33` }}
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.purple }}
                >
                  {producto.nombre}
                </h2>
                <p className="text-gray-600 mb-3 flex-1">{producto.descripcion}</p>
                <div className="flex items-center justify-between mt-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: colors.lightBlue, color: colors.darkTeal }}
                  >
                    {producto.tipo_producto}
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: colors.pink }}
                  >
                    ${producto.precio.toLocaleString("es-DO", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {productos.length === 0 && (
          <div className="text-center text-lg text-gray-500 mt-20 animate-pulse">
            Cargando productos...
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;
