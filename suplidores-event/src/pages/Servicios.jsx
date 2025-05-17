import { useState } from 'react';
import { Search, Calendar, Users, MapPin, Star, ArrowLeft, Phone, Mail, Globe, Clock } from 'lucide-react';

// Datos ficticios para las categorías de servicios
const categorias = [
  { id: 1, nombre: "Florerías", icono: "🌸", color: "bg-pink-100" },
  { id: 2, nombre: "Catering", icono: "🍽️", color: "bg-yellow-100" },
  { id: 3, nombre: "Fotografía", icono: "📸", color: "bg-purple-100" },
  { id: 4, nombre: "Música", icono: "🎵", color: "bg-blue-100" },
  { id: 5, nombre: "Decoración", icono: "✨", color: "bg-green-100" },
  { id: 6, nombre: "Salones", icono: "🏛️", color: "bg-orange-100" },
];

// Datos ficticios para los proveedores de florería
const floreriasProveedores = [
  {
    id: 1,
    nombre: "Florería Bella Rosa",
    descripcion: "Arreglos florales para todo tipo de eventos",
    imagen: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=300&h=200&auto=format&fit=crop",
    calificacion: 4.8,
    ubicacion: "Ciudad de México",
    precioPromedio: "$$",
    destacado: true
  },
  {
    id: 2,
    nombre: "Flores del Jardín",
    descripcion: "Flores frescas y arreglos personalizados",
    imagen: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=300&h=200&auto=format&fit=crop",
    calificacion: 4.5,
    ubicacion: "Guadalajara",
    precioPromedio: "$$$",
    destacado: false
  },
  {
    id: 3,
    nombre: "Floristería Primavera",
    descripcion: "Expertos en decoración floral para bodas y eventos corporativos",
    imagen: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=300&h=200&auto=format&fit=crop",
    calificacion: 4.9,
    ubicacion: "Monterrey",
    precioPromedio: "$$$$",
    destacado: true
  },
  {
    id: 4,
    nombre: "Arte Floral",
    descripcion: "Diseños únicos y creativos para cualquier ocasión",
    imagen: "https://images.unsplash.com/photo-1583008584407-ab6e98944f5d?q=80&w=300&h=200&auto=format&fit=crop",
    calificacion: 4.7,
    ubicacion: "Puebla",
    precioPromedio: "$$$",
    destacado: false
  },
  {
    id: 5,
    nombre: "Flores y Más",
    descripcion: "Soluciones florales completas para eventos",
    imagen: "https://images.unsplash.com/photo-1515696955266-4f67e13219e8?q=80&w=300&h=200&auto=format&fit=crop",
    calificacion: 4.6,
    ubicacion: "Mérida",
    precioPromedio: "$$",
    destacado: false
  },
  {
    id: 6,
    nombre: "Florería Encanto",
    descripcion: "Arreglos elegantes y sofisticados",
    imagen: "https://images.unsplash.com/photo-1561181278-a5e969228d5c?q=80&w=300&h=200&auto=format&fit=crop",
    calificacion: 4.8,
    ubicacion: "Querétaro",
    precioPromedio: "$$$",
    destacado: true
  },
];

// Datos detallados de un proveedor específico
const proveedorDetalle = {
  id: 1,
  nombre: "Florería Bella Rosa",
  descripcion: "Somos expertos en arreglos florales para todo tipo de eventos. Nos especializamos en bodas, eventos corporativos y celebraciones especiales.",
  imagen: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?q=80&w=800&h=400&auto=format&fit=crop",
  calificacion: 4.8,
  ubicacion: "Av. Reforma 234, Col. Juárez, Ciudad de México",
  telefono: "(55) 1234-5678",
  email: "contacto@bellarosa.com",
  sitioWeb: "www.bellarosa.com",
  horario: "Lunes a Sábado: 9:00 - 18:00, Domingo: 10:00 - 14:00",
  redesSociales: {
    facebook: "florerabellarosa",
    instagram: "@bella_rosa_flores",
    pinterest: "bellarosaflores"
  },
  servicios: [
    { nombre: "Decoración floral para bodas", precio: "$5,000 - $25,000" },
    { nombre: "Centros de mesa", precio: "$500 - $1,500" },
    { nombre: "Ramos de novia", precio: "$1,200 - $3,000" },
    { nombre: "Arcos florales", precio: "$3,500 - $8,000" },
    { nombre: "Corsages y boutonnieres", precio: "$200 - $500" }
  ],
  galeria: [
    "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=400&h=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519750287407-b2ec3a8f1d2a?q=80&w=400&h=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607035798067-31bbcb7a00fd?q=80&w=400&h=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594055102298-bfc9daacce9e?q=80&w=400&h=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1612540942065-9fd0ca98fb3e?q=80&w=400&h=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551733372-a27aaa888c4f?q=80&w=400&h=300&auto=format&fit=crop"
  ],
  resenas: [
    {
      usuario: "María G.",
      calificacion: 5,
      comentario: "¡Increíble servicio! Los arreglos florales para mi boda fueron perfectos.",
      fecha: "12/02/2025"
    },
    {
      usuario: "Carlos L.",
      calificacion: 4,
      comentario: "Muy profesionales y puntuales con la entrega. Los centros de mesa eran hermosos.",
      fecha: "28/01/2025"
    },
    {
      usuario: "Ana P.",
      calificacion: 5,
      comentario: "El ramo de novia superó mis expectativas. Definitivamente los recomiendo.",
      fecha: "05/01/2025"
    }
  ]
};

export default function ServiciosApp() {
  const [vista, setVista] = useState('categorias'); // categorias, proveedores, detalle
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  
  // Función para manejar la selección de categoría
  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setVista('proveedores');
  };
  
  // Función para manejar la selección de proveedor
  const seleccionarProveedor = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setVista('detalle');
  };
  
  // Función para volver a la vista anterior
  const volverVista = () => {
    if (vista === 'detalle') {
      setVista('proveedores');
      setProveedorSeleccionado(null);
    } else if (vista === 'proveedores') {
      setVista('categorias');
      setCategoriaSeleccionada(null);
    }
  };

  return (
    <div className="font-sans">
      {/* Contenido principal */}
      <main className="container mx-auto p-6">
     

        {/* Vista de categorías de servicios */}
        {vista === 'categorias' && (
          <div>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">Explora por categorías</h1>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Encuentra rápidamente los proveedores especializados en lo que tu negocio necesita
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {categorias.map(categoria => (
                <div 
                  key={categoria.id} 
                  className={`${categoria.color} rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer`}
                  onClick={() => seleccionarCategoria(categoria)}
                >
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="text-5xl mb-4">{categoria.icono}</div>
                    <h3 className="text-xl font-semibold text-slate-800">{categoria.nombre}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista de listado de proveedores por categoría */}
        {vista === 'proveedores' && (
          <div>
            <div className="flex items-center mb-6">
              <button 
                onClick={volverVista}
                className="flex items-center text-sky-600 hover:text-sky-800 mr-4"
              >
                <ArrowLeft size={20} className="mr-1" /> Volver
              </button>
              <h1 className="text-3xl font-bold text-slate-800">
                {categoriaSeleccionada?.nombre || "Florerías"}
              </h1>
            </div>

            {/* Filtros */}
            <div className="bg-white shadow rounded-lg p-4 mb-8">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-grow max-w-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" 
                    placeholder="Buscar proveedor..." 
                  />
                </div>
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-sky-500 focus:border-sky-500">
                  <option value="">Ubicación</option>
                  <option value="cdmx">Ciudad de México</option>
                  <option value="guadalajara">Guadalajara</option>
                  <option value="monterrey">Monterrey</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-sky-500 focus:border-sky-500">
                  <option value="">Precio</option>
                  <option value="1">$</option>
                  <option value="2">$$</option>
                  <option value="3">$$$</option>
                  <option value="4">$$$$</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-sky-500 focus:border-sky-500">
                  <option value="">Calificación</option>
                  <option value="4">4+ estrellas</option>
                  <option value="3">3+ estrellas</option>
                </select>
              </div>
            </div>

            {/* Listado de proveedores */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {floreriasProveedores.map(proveedor => (
                <div 
                  key={proveedor.id} 
                  className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                  onClick={() => seleccionarProveedor(proveedor)}
                >
                  <div className="relative">
                    <img 
                      src={proveedor.imagen} 
                      alt={proveedor.nombre} 
                      className="w-full h-48 object-cover"
                    />
                    {proveedor.destacado && (
                      <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-semibold px-2 py-1 m-2 rounded">
                        Destacado
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{proveedor.nombre}</h3>
                    <p className="text-slate-600 mb-3">{proveedor.descripcion}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <MapPin size={16} className="text-slate-500 mr-1" />
                        <span>{proveedor.ubicacion}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500 font-semibold mr-1">{proveedor.calificacion}</span>
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-slate-500">
                      Precio promedio: <span className="font-medium">{proveedor.precioPromedio}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista de detalle del proveedor */}
        {vista === 'detalle' && (
          <div>
            <div className="flex items-center mb-6">
              <button 
                onClick={volverVista}
                className="flex items-center text-sky-600 hover:text-sky-800 mr-4"
              >
                <ArrowLeft size={20} className="mr-1" /> Volver
              </button>
              <h1 className="text-3xl font-bold text-slate-800">
                {proveedorSeleccionado?.nombre || proveedorDetalle.nombre}
              </h1>
            </div>

            {/* Imagen principal y detalles */}
            <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
              <div className="relative">
                <img 
                  src={proveedorDetalle.imagen} 
                  alt={proveedorDetalle.nombre} 
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{proveedorDetalle.nombre}</h2>
                    <div className="flex items-center mb-2">
                      <Star size={18} className="text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-semibold mr-1">{proveedorDetalle.calificacion}</span>
                      <span className="text-slate-500">({proveedorDetalle.resenas.length} reseñas)</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <button className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition flex items-center">
                      <Phone size={16} className="mr-2" /> Contactar
                    </button>
                    <button className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-300 transition flex items-center">
                      <Calendar size={16} className="mr-2" /> Agendar cita
                    </button>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-6">
                  {proveedorDetalle.descripcion}
                </p>

                {/* Información de contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Información de contacto</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <MapPin className="w-5 h-5 text-slate-500 mr-2 mt-0.5" />
                        <span>{proveedorDetalle.ubicacion}</span>
                      </li>
                      <li className="flex items-start">
                        <Phone className="w-5 h-5 text-slate-500 mr-2 mt-0.5" />
                        <span>{proveedorDetalle.telefono}</span>
                      </li>
                      <li className="flex items-start">
                        <Mail className="w-5 h-5 text-slate-500 mr-2 mt-0.5" />
                        <span>{proveedorDetalle.email}</span>
                      </li>
                      <li className="flex items-start">
                        <Globe className="w-5 h-5 text-slate-500 mr-2 mt-0.5" />
                        <span>{proveedorDetalle.sitioWeb}</span>
                      </li>
                      <li className="flex items-start">
                        <Clock className="w-5 h-5 text-slate-500 mr-2 mt-0.5" />
                        <span>{proveedorDetalle.horario}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Servicios y precios</h3>
                    <ul className="space-y-2">
                      {proveedorDetalle.servicios.map((servicio, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{servicio.nombre}</span>
                          <span className="font-medium">{servicio.precio}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Galería de fotos */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Galería de trabajos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {proveedorDetalle.galeria.map((imagen, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img 
                          src={imagen} 
                          alt={`Trabajo de ${proveedorDetalle.nombre} ${index+1}`} 
                          className="w-full h-32 object-cover hover:opacity-90 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reseñas */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Reseñas de clientes</h3>
                  <div className="space-y-4">
                    {proveedorDetalle.resenas.map((resena, index) => (
                      <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{resena.usuario}</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={16} 
                                  className={i < resena.calificacion ? "text-yellow-500 fill-yellow-500" : "text-slate-300"}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-sm text-slate-500">{resena.fecha}</div>
                        </div>
                        <p className="text-slate-600">{resena.comentario}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Évoca</h4>
              <p className="text-slate-300">Conectamos tu empresa con los mejores proveedores de servicios para eventos.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white">Inicio</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Servicios</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Productos</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Vende con nosotros</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categorías</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white">Florerías</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Catering</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Fotografía</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white">Música</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  <span>contacto@evoca.com</span>
                </li>
                <li className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <span>(55) 1234-5678</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            &copy; {new Date().getFullYear()} Évoca. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}