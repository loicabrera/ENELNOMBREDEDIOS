import {
  Award,
  ChevronRight,
  MessageCircle,
  ShoppingBag,
  Star,
  Users,
  Camera,
  Music,
  Sparkles,
  Building,
  Flower2,
  UtensilsCrossed,
  Building2,
  Package,
  Wrench,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
// Colores definidos
const colors = {
  sage: "#9CAF88",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
  crema: "#cba884",
};

// Datos actualizados de proveedores destacados con imágenes reales
const proveedoresDestacados = [
  {
    id: 1,
    nombre: "Eventos Elegantes",
    imagen: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1298&auto=format&fit=crop",
    categoria: "Decoración",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    nombre: "Sweet Moments Catering",
    imagen: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1470&auto=format&fit=crop",
    categoria: "Catering",
    rating: 4.7,
    reviews: 98,
  },
  {
    id: 3,
    nombre: "Captura Mágica",
    imagen: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1470&auto=format&fit=crop",
    categoria: "Fotografía",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 4,
    nombre: "Jardín de Eventos",
    imagen: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1469&auto=format&fit=crop",
    categoria: "Salones",
    rating: 4.6,
    reviews: 87,
  },
];

// Datos de servicios destacados
const serviciosDestacados = [
  {
    id: 1,
    nombre: "Decoración de Eventos",
    descripcion: "Transformamos espacios en momentos mágicos",
    icono: <Sparkles size={24} style={{ color: colors.pink }} />,
    bgColor: colors.lightPink,
  },
  {
    id: 2,
    nombre: "Catering Premium",
    descripcion: "Experiencias culinarias inolvidables",
    icono: <UtensilsCrossed size={24} style={{ color: colors.purple }} />,
    bgColor: `${colors.purple}40`,
  },
  {
    id: 3,
    nombre: "Fotografía Profesional",
    descripcion: "Capturando momentos especiales",
    icono: <Camera size={24} style={{ color: colors.darkTeal }} />,
    bgColor: `${colors.sage}40`,
  },
  {
    id: 4,
    nombre: "Música en Vivo",
    descripcion: "Ambiente perfecto para tu evento",
    icono: <Music size={24} style={{ color: colors.purple }} />,
    bgColor: `${colors.purple}30`,
  }
];

// Datos de productos destacados
const productosDestacados = [
  {
    id: 1,
    nombre: "Mobiliario para Eventos",
    descripcion: "Sillas, mesas y más para tu evento",
    icono: <Package size={24} style={{ color: colors.pink }} />,
    bgColor: colors.lightPink,
  },
  {
    id: 2,
    nombre: "Equipos de Sonido",
    descripcion: "Sistemas profesionales de audio",
    icono: <Music size={24} style={{ color: colors.purple }} />,
    bgColor: `${colors.purple}40`,
  },
  {
    id: 3,
    nombre: "Iluminación",
    descripcion: "Equipos de iluminación profesional",
    icono: <Sparkles size={24} style={{ color: colors.darkTeal }} />,
    bgColor: `${colors.sage}40`,
  },
  {
    id: 4,
    nombre: "Equipos Técnicos",
    descripcion: "Todo lo necesario para tu evento",
    icono: <Wrench size={24} style={{ color: colors.purple }} />,
    bgColor: `${colors.purple}30`,
  }
];

// Componente para la tarjeta de proveedor
const ProveedorCard = ({ proveedor, colors }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
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
            e.currentTarget.style.backgroundColor = colors.lightPink;
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
    <div className="flex flex-col min-h-full">
      <main className="flex-1">
        {/* Hero Section - Cambiado a imagen simple sin gradiente */}
        <section className="relative py-16 md:py-24 w-full">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1470&auto=format&fit=crop"
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: colors.darkTeal, opacity: 0.4 }}
            ></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                ÉVOCA
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white opacity-90 mb-8">
                Proveedores de calidad que ofrecen los
                productos y servicios que necesitas
              </p>
            </div>
          </div>
        </section>

        {/* Servicios Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: colors.darkTeal }}
              >
                Servicios Destacados
              </h2>
              <p className="text-lg mb-4" style={{ color: colors.darkTeal }}>
                Descubre los mejores servicios para tu evento
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviciosDestacados.map((servicio) => (
                <div
                  key={servicio.id}
                  className="flex flex-col p-6 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105"
                  style={{ backgroundColor: servicio.bgColor }}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full mb-4 shadow-sm">
                    {servicio.icono}
                  </div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: colors.darkTeal }}
                  >
                    {servicio.nombre}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {servicio.descripcion}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {servicio.proveedores} 
                    </span>
                    <button
                      className="text-sm font-medium flex items-center gap-1 group relative overflow-hidden px-2 py-1 rounded-md transition-all duration-300 focus:outline-none"
                      style={{ 
                        backgroundColor: colors.white,
                        color: '#000000',
                        border: '1px solid black',
                       
                      }}
                    >
                      <span className="relative z-10">Explorar</span>
                      <ChevronRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Productos Section */}
        <section className="py-12 md:py-16" style={{ backgroundColor: `${colors.sage}10` }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: colors.darkTeal }}
              >
                Productos Destacados
              </h2>
              <p className="text-lg mb-4" style={{ color: colors.darkTeal }}>
                Encuentra los productos que necesitas para tu evento
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosDestacados.map((producto) => (
                <div
                  key={producto.id}
                  className="flex flex-col p-6 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 bg-white"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4 shadow-sm"
                    style={{ backgroundColor: producto.bgColor }}>
                    {producto.icono}
                  </div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: colors.darkTeal }}
                  >
                    {producto.nombre}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    {producto.descripcion}
                  </p>
                  <div className="flex items-center justify-between">
                   
                    <button
                      className="text-sm font-medium flex items-center gap-1 group relative overflow-hidden px-2 py-1 rounded-md transition-all duration-300 focus:outline-none"
                      style={{ 
                        backgroundColor: 'white',
                        color: '#000000',
                        border: '1px solid rgb(0, 0, 0)',
                         hover: 'bg-[#CDCDCD] transition-all duration-300'
                      }}
                    >
                      <span className="relative z-10">Explorar</span>
                      <ChevronRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                      <span className="absolute inset-0  opacity-0 "></span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proveedores Destacados */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: colors.darkTeal }}
              >
                Proveedores Destacados
              </h2>
              <p className="text-lg mb-4" style={{ color: colors.darkTeal }}>
                Descubre los mejores proveedores para tu evento
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {proveedoresDestacados.map((proveedor) => (
                <ProveedorCard key={proveedor.id} proveedor={proveedor} colors={colors} />
              ))}
            </div>

            <div className="text-center mt-8">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 rounded-full transition-colors"
                style={{ 
                  backgroundColor: colors.purple,
                  color: 'white'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = colors.pink;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = colors.purple;
                }}
              >
                Ver todos los proveedores <ChevronRight size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* Sección "Vende con nosotros" */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: colors.darkTeal }}
                >
                  ¿Eres proveedor? Vende con nosotros
                </h2>
                <p 
                  className="text-base sm:text-lg mb-6 max-w-lg"
                  style={{ color: colors.darkTeal }}
                >
                  Únete a nuestra red de proveedores y conecta con miles de
                  empresas que buscan tus productos y servicios. Aumenta tu
                  visibilidad y consigue nuevos clientes.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link 
                    to="/Vende"
                    className="bg-transparent border py-3 px-6 rounded-lg font-medium transition-colors"
                    style={{ 
                      color: colors.darkTeal,
                      borderColor: colors.darkTeal 
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = colors.darkTeal;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.darkTeal;
                    }}
                  >
                    Saber más
                  </Link>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1374&auto=format&fit=crop"
                  alt="Vender con nosotros"
                  className="rounded-lg shadow-xl max-w-full md:max-w-md object-cover h-[400px]"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
