import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const colors = {
  sage: "#9CAF88",
  purple: "#cbb4db",
  pink: "#fbaccb",
  lightPink: "#fbcbdb",
  darkTeal: "#012e33",
};

const SeleccionarPlanNuevoNegocio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id_persona, isAddingNewBusiness } = location.state || {};

  // Redirigir si faltan datos necesarios
  if (!id_persona || !isAddingNewBusiness) {
    console.error('Datos de estado incompletos para seleccionar plan de nuevo negocio.');
    navigate('/dashboard-proveedor/negocios'); // Redirigir de vuelta a Mis Negocios
    return null;
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Puedes añadir un encabezado o breadcrumbs aquí si quieres */}

      {/* Sección de PLANES adaptada de Vende.jsx */}
      <div className="vende-plans">
        <h2 className="plans-title">Elige el plan para tu nuevo negocio:</h2>

        <div className="plans-grid">
          {/* Plan Básico */}
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
            {/* Modificar el Link o usar un botón para pasar el estado correcto */}
            <Link 
              to="/datosproveedor2" 
              className="plan-button" 
              state={{ 
                id_persona: id_persona,
                plan: 'basico', 
                amount: 2000,
                isAddingNewBusiness: true 
              }}>
              Elegir »
            </Link>
          </div>

          {/* Plan Destacado */}
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
             {/* Modificar el Link o usar un botón para pasar el estado correcto */}
            <Link 
              to="/datosproveedor2" 
              className="plan-button" 
              state={{ 
                id_persona: id_persona,
                plan: 'destacado', 
                amount: 4000,
                isAddingNewBusiness: true 
              }}>
              Elegir »
            </Link>
          </div>

          {/* Plan Premium */}
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
             {/* Modificar el Link o usar un botón para pasar el estado correcto */}
            <Link 
              to="/datosproveedor2" 
              className="plan-button" 
              state={{ 
                id_persona: id_persona,
                plan: 'premium', 
                amount: 8000,
                isAddingNewBusiness: true 
              }}>
              Elegir »
            </Link>
          </div>
        </div>
      </div>

      {/* Puedes añadir otras secciones aquí si es necesario */}

    </div>
  );
};

export default SeleccionarPlanNuevoNegocio; 