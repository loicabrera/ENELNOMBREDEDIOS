import {
  ChevronRight,
  Users,
  Building2,
  Package,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
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

// Componente Modal Mejorado
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Bloquear el scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
      // Enfocar el modal cuando se abre
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 ease-in-out scale-100"
        tabIndex="-1"
        role="document"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full p-1 transition-colors"
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Componente principal de la página de inicio
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalTriggerRef = useRef(null);

  // Efecto para detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        // Add any functionality here if needed in the future
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Devolver el foco al botón que abrió el modal
    modalTriggerRef.current?.focus();
  };

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1">
        {/* Hero Section */}
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

        {/* Sección de Conoce ÉVOCA */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: colors.darkTeal }}
              >
                ¿Quieres conocer ÉVOCA?
              </h2>
              <p className="text-lg mb-4" style={{ color: colors.darkTeal }}>
                La plataforma líder en conexión de proveedores y clientes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col p-6 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 bg-white">
                <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4 shadow-sm"
                  style={{ backgroundColor: colors.lightPink }}>
                  <Users size={24} style={{ color: colors.darkTeal }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.darkTeal }}>
                  Comunidad Activa
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Únete a nuestra comunidad de proveedores y clientes
                </p>
              </div>

              <div className="flex flex-col p-6 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 bg-white">
                <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4 shadow-sm"
                  style={{ backgroundColor: `${colors.purple}40` }}>
                  <Building2 size={24} style={{ color: colors.darkTeal }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.darkTeal }}>
                  Plataforma Confiable
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Conectamos proveedores verificados con clientes potenciales
                </p>
              </div>

              <div className="flex flex-col p-6 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 bg-white">
                <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4 shadow-sm"
                  style={{ backgroundColor: `${colors.sage}40` }}>
                  <Package size={24} style={{ color: colors.darkTeal }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.darkTeal }}>
                  Soluciones Integrales
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Todo lo que necesitas para tu evento en un solo lugar
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                ref={modalTriggerRef}
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
                aria-haspopup="dialog"
              >
                Conoce más sobre ÉVOCA <ChevronRight size={16} className="ml-2" />
              </button>
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
                    className="bg-transparent border py-3 px-6 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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

        {/* Modal de Información */}
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <div className="space-y-6">
            <h2 id="modal-title" className="text-3xl font-bold" style={{ color: colors.darkTeal }}>
              Sobre ÉVOCA
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.darkTeal }}>
                  Nuestra Misión
                </h3>
                <p className="text-gray-600">
                  Conectar proveedores de calidad con clientes que buscan los mejores servicios para sus eventos, creando una comunidad confiable y eficiente.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.darkTeal }}>
                  ¿Por qué elegirnos?
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Plataforma verificada y segura</li>
                  <li>Amplia red de proveedores profesionales</li>
                  <li>Sistema de calificaciones y reseñas</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.darkTeal }}>
                  Nuestros Valores
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Calidad y profesionalismo</li>
                  <li>Transparencia en cada interacción</li>
                  <li>Innovación constante</li>
                  <li>Compromiso con la excelencia</li>
                </ul>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleModalClose}
                className="w-full py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
                Entendido
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
