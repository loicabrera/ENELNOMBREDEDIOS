import { Link } from "react-router-dom";
import { Target, Settings, BarChart3, HelpCircle } from "lucide-react";

const colors = {
  sage: "#9CAF88",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
};
const Vende = () => {
  return (
<div className="flex flex-col min-h-full">       {/* Hero Section - Cambiado a imagen simple sin gradiente */}
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
                Vende con nosotros 
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white opacity-90 mb-8">
             Lleva tu negocio con nosotros al siguiente nivel 
              </p>
            </div>
          </div>
        </section>

      <div className="vende-header">
        <h1>Vende con nosotros</h1>
        <p className="vende-subtitle">
          En Évoca recibimos miles de visitantes interesados en contratar
          servicios para eventos cada mes. Somos el mayor directorio
          especializado para el mercado de eventos y celebraciones.
        </p>

        <div className="vende-stats">
          <div className="stat-item">
            <span className="stat-icon">✓</span>
            <span className="stat-text">Más de 50,000 visitas mensuales</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✓</span>
            <span className="stat-text">
              Accesible desde dispositivos móviles
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✓</span>
            <span className="stat-text">
              ¡Promociona tus servicios fácil y cómodamente!
            </span>
          </div>
        </div>
      </div>

      {/* PLANES */}
      <div className="vende-plans">
        <h2 className="plans-title">Elige tu plan:</h2>

        {/* Agregamos plans-grid para que se acomoden en fila */}
        <div className="plans-grid">
          <div className="plan-card">
            <div className="plan-content">
              <h3>Plan Básico</h3>
              <p className="plan-description">
                Con este plan puedes publicar hasta 3 servicios con descripción
                detallada y 3 productos con una duración de 30 días:
              </p>
              <p className="plan-price">RD$2,000</p>
              <ul className="plan-features">
                <li>3 publicaciones de servicios</li>
                <li>3 publicaciones de productos</li>
                <li>Hasta 8 fotos por servicio y productos</li>
              </ul>
            </div>
            <Link to="/registro/basico" className="plan-button" state={{ plan: 'basico', amount: 2000 }}>
              Elegir »
            </Link>
          </div>

          <div className="plan-card highlighted">
            <div className="plan-content">
              <div className="plan-badge">Más popular</div>
              <h3>Plan Destacado</h3>
              <p className="plan-description">
                Anuncio con hasta 6 servicios, con descripción detallada y 7
                productos con una duración de 60 días:
              </p>
              <p className="plan-price">RD$4,000</p>
              <ul className="plan-features">
                <li>6 publicaciones de servicios</li>
                <li>7 publicaciones de productos</li>
                <li>Hasta 15 fotos por servicio y productos </li>
                <li>Posición destacada en resultados de búsqueda por 7 días</li>
                <li>25% más de visibilidad que el plan básico</li>
              </ul>
            </div>
            <Link to="/registro/destacado" className="plan-button" state={{ plan: 'destacado', amount: 4000 }}>
              Elegir »
            </Link>
          </div>

          <div className="plan-card">
            <div className="plan-content">
              <h3>Plan Premium</h3>
              <p className="plan-description">
                Máxima visibilidad para tu negocio, incluye portada en página
                principal, destacado permanente por 90 días:
              </p>
              <p className="plan-price">RD$8,000</p>
              <ul className="plan-features">
                <li>Publicaciones ilimitadas de servicios y productos</li>
                <li>Hasta 25 fotos por servicio y productos</li>
                <li>Aparición en portada por 15 días + destacado permanente</li>
                <li>Posición premium en resultados de búsqueda</li>
                <li>Badge verificado en tu perfil</li>
                <li>Estadísticas avanzadas de visitas y contactos</li>
              </ul>
            </div>
            <Link to="/registro/premium" className="plan-button" state={{ plan: 'premium', amount: 8000 }}>
              Elegir »
            </Link>
          </div>
        </div>
      </div>

      {/* BENEFICIOS */}
      <div className="vende-benefits">
        <h2>¿Por qué registrar tu servicio con nosotros?</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">
              <Target size={32} className="text-purple" />
            </div>
            <h3>Mayor visibilidad</h3>
            <p>
              Llega a clientes que están buscando específicamente tus servicios
              para sus eventos
            </p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <Settings size={32} className="text-purple" />
            </div>
            <h3>Gestión sencilla</h3>
            <p>
              Panel de control fácil de usar para administrar tus publicaciones
              y contactos
            </p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <BarChart3 size={32} className="text-purple" />
            </div>
            <h3>Estadísticas detalladas</h3>
            <p>
              Conoce el rendimiento de tus anuncios y optimiza tu estrategia
            </p>
          </div>
        </div>
      </div>


      {/* FAQ */}
      <div className="vende-faq">
        <h2>Preguntas frecuentes</h2>
        <div className="faq-item">
          <div className="faq-header">
            <h3>¿Cómo funciona el proceso de registro?</h3>
            <HelpCircle size={24} className="text-purple" />
          </div>
          <p>
            Nosotros creamos tu cuenta con un usuario y contraseña base. Una vez
            que eliges y pagas tu plan, te proporcionamos tus credenciales unicas que debes de guardar para que
            puedas acceder y comenzar a publicar tus servicios.
          </p>
        </div>
        <div className="faq-item">
          <div className="faq-header">
            <h3>¿Puedo cambiar de plan más adelante?</h3>
            <HelpCircle size={24} className="text-purple" />
          </div>
          <p>
            Sí, puedes actualizar tu plan en cualquier momento. La diferencia de
            precio se calculará proporcionalmente al tiempo restante de tu
            membresía actual.
          </p>
        </div>
        <div className="faq-item">
          <div className="faq-header">
            <h3>¿Qué pasa cuando mi membresía expire?</h3>
            <HelpCircle size={24} className="text-purple" />
          </div>
          <p>
            Te enviaremos recordatorios antes de que tu membresía expire. Si no
            renuevas, tu cuenta estara inactiva y tus publicaciones dejarán de ser visibles, pero tu cuenta
            y datos permanecerán en el sistema para cuando decidas reactivarla.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Vende;
