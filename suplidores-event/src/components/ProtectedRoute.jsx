import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Importar useAuth

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth(); // Usar el hook useAuth para obtener el estado de autenticación

  // Ya no necesitamos la lógica de useEffect para verificar autenticación aquí, 
  // el AuthContext lo maneja al inicio de la aplicación.
  // Eliminamos también la lógica de localStorage y las funciones relacionadas.

  console.log('=== ProtectedRoute Debug ===');
  console.log('Estado de autenticación (AuthContext):', { isAuthenticated, loading, user });
  console.log('Ruta actual:', location.pathname);
  console.log('Roles permitidos:', allowedRoles);
  console.log('========================');

  // Permitir acceso a rutas de admin si isAdmin está en localStorage
  const isAdminLocal = localStorage.getItem('isAdmin') === 'true';

  // Mientras carga la verificación, puedes mostrar un spinner o un mensaje
  if (loading && !isAdminLocal) {
    return <div>Cargando autenticación...</div>; // O un spinner más elaborado
  }

  // Determinar el rol del usuario autenticado (si existe)
  const userRole = user?.provedorId ? 'proveedor' : user?.adminId ? 'admin' : null;

  // Lógica de redirección basada en el estado del contexto y roles
  if ((!isAuthenticated || userRole === null) && !isAdminLocal) {
    console.log('Usuario no autenticado o rol desconocido, redirigiendo a login.');
    // Redirigir al login correspondiente si no está autenticado o el rol es desconocido
     if (location.pathname.includes('dashboardadmin') || location.pathname.includes('enelnombrededios')) {
       return <Navigate to="/enelnombrededios" state={{ from: location }} replace />; // Redirigir al login de admin
     } else {
       return <Navigate to="/login" state={{ from: location }} replace />; // Redirigir al login de proveedor/general
     }
  }

  // Si está autenticado, verificar roles y rutas
  const requiresAdmin = location.pathname.includes('dashboardadmin') || location.pathname.includes('enelnombrededios');
  const requiresProveedor = allowedRoles && allowedRoles.includes('proveedor');

  if (isAuthenticated || isAdminLocal) {
      if (requiresAdmin && !isAdminLocal && userRole !== 'admin') {
          console.log('Acceso denegado: Se requiere rol de admin.');
          // Redirigir a login de admin o a una página de acceso denegado
           return <Navigate to="/enelnombrededios" state={{ from: location }} replace />;
      } else if (requiresProveedor && userRole !== 'proveedor') {
           console.log('Acceso denegado: Se requiere rol de proveedor.');
           // Redirigir a login de proveedor o a una página de acceso denegado
           return <Navigate to="/login" state={{ from: location }} replace />;
       } else if (location.pathname === '/login' || location.pathname === '/enelnombrededios') {
            if(isAdminLocal) return <Navigate to="/dashboardadmin" state={{ from: location }} replace />;
            if(userRole === 'admin') return <Navigate to="/dashboardadmin" state={{ from: location }} replace />;
            if(userRole === 'proveedor') return <Navigate to="/dashboard-proveedor" state={{ from: location }} replace />;
            return <Navigate to="/" state={{ from: location }} replace />;
       } else {
         // Usuario autenticado con el rol correcto para la ruta o ruta no requiere rol específico (pero sí autenticación)
         console.log('Acceso permitido.');
         return children; // Renderizar los componentes hijos
       }
  }

   // Si por alguna razón llegamos aquí (no debería pasar con la lógica anterior), redirigir al login por defecto
   return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute; 