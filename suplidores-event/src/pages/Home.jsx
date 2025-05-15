import {
  Award,
  ChevronRight,
  MessageCircle,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";
import { useEffect } from "react";
// Colores de la nueva paleta
const colors = {
  lightBlue: "#bbe3fb",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
};

// Datos de ejemplo de proveedores destacados
const proveedoresDestacados = [
  {
    id: 1,
    nombre: "Suministros Profesionales",
    imagen: "/api/placeholder/400/300",
    categoria: "Tecnología",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    nombre: "Distribuidora Ejecutiva",
    imagen: "/api/placeholder/400/300",
    categoria: "Papelería",
    rating: 4.7,
    reviews: 98,
  },
  {
    id: 3,
    nombre: "InsumosTech",
    imagen: "/api/placeholder/400/300",
    categoria: "Electrónica",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 4,
    nombre: "Materiales Express",
    imagen: "/api/placeholder/400/300",
    categoria: "Construcción",
    rating: 4.6,
    reviews: 87,
  },
];

// Categorías de ejemplo
const categorias = [
  { id: 1, nombre: "Tecnología", icono: <ShoppingBag size={24} /> },
  { id: 2, nombre: "Papelería", icono: <MessageCircle size={24} /> },
  { id: 3, nombre: "Mobiliario", icono: <Users size={24} /> },
  { id: 4, nombre: "Construcción", icono: <Award size={24} /> },
  { id: 5, nombre: "Servicios", icono: <Star size={24} /> },
  { id: 6, nombre: "Electrónica", icono: <ShoppingBag size={24} /> },
];

// Componente para la tarjeta de proveedor
const ProveedorCard = ({ proveedor }) => {
  return (
    <div className=" flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
      <div className="h-48 relative">
        <img
          src={proveedor.imagen}
          alt={proveedor.nombre}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium"
          style={{ color: colors.darkTeal }}
        >
          {proveedor.categoria}
        </div>
      </div>

      <div className="p-4 flex-grow">
        <h3
          className="text-xl font-semibold mb-2"
          style={{ color: colors.darkTeal }}
        >
          {proveedor.nombre}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(proveedor.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-600">
            {proveedor.rating} ({proveedor.reviews} reseñas)
          </span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          className="w-full py-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium"
          style={{
            border: `1px solid ${colors.purple}`,
            color: colors.purple,
            backgroundColor: "white",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = colors.lightBlue;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "white";
          }}
        >
          Ver perfil <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Componente principal de la página de inicio
export default function Home() {
  // Efecto para detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        // Add any functionality here if needed in the future
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Asegúrate de que el array de dependencias esté vacío o contenga las dependencias necesarias

  return (
    <div className=" w-full p-4 min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}

      <main className="flex-grow">
        {/* Hero Section - Cambiado a imagen simple sin gradiente */}
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/api/placeholder/1600/500"
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: colors.darkTeal, opacity: 0.7 }}
            ></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Encuentra los mejores proveedores para tu negocio
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white opacity-90 mb-8">
                Conectamos tu empresa con proveedores de calidad que ofrecen los
                productos y servicios que necesitas
              </p>
            </div>
          </div>
        </section>

        {/* Categorías Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: colors.darkTeal }}
              >
                Explora por categorías
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Encuentra rápidamente los proveedores especializados en lo que
                tu negocio necesita
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer"
                  style={{ backgroundColor: colors.lightBlue }}
                >
                  <div
                    className="w-14 h-14 flex items-center justify-center bg-white rounded-full mb-3 shadow-sm"
                    style={{ color: colors.purple }}
                  >
                    {categoria.icono}
                  </div>
                  <h3
                    className="font-medium"
                    style={{ color: colors.darkTeal }}
                  >
                    {categoria.nombre}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proveedores Destacados */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <h2
                className="text-3xl font-bold mb-4 sm:mb-0"
                style={{ color: colors.darkTeal }}
              >
                Proveedores Destacados
              </h2>
              <a
                href="#"
                className="font-medium flex items-center transition-colors"
                style={{ color: colors.purple }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = colors.pink;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = colors.purple;
                }}
              >
                Ver todos <ChevronRight size={16} className="ml-1" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {proveedoresDestacados.map((proveedor) => (
                <ProveedorCard key={proveedor.id} proveedor={proveedor} />
              ))}
            </div>
          </div>
        </section>

        {/* Sección "Vende con nosotros" */}
        <section
          className="py-16"
          style={{
            background: `linear-gradient(to right, ${colors.pink}, ${colors.purple})`,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                  ¿Eres proveedor? Vende con nosotros
                </h2>
                <p className="text-base sm:text-lg text-white opacity-90 mb-6 max-w-lg">
                  Únete a nuestra red de proveedores y conecta con miles de
                  empresas que buscan tus productos y servicios. Aumenta tu
                  visibilidad y consigue nuevos clientes.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    className="bg-white py-3 px-6 rounded-lg font-medium transition-colors"
                    style={{ color: colors.darkTeal }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = colors.lightBlue;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    Comenzar ahora
                  </button>
                  <button className="bg-transparent border border-white text-white py-3 px-6 rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
                    Saber más
                  </button>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-center">
                <img
                  src="/api/placeholder/500/400"
                  alt="Vender con nosotros"
                  className="rounded-lg shadow-xl max-w-full md:max-w-md"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
