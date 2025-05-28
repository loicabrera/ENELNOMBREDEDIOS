import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  let user = null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error al parsear usuario:', error);
    localStorage.removeItem('user');
  }
  
  console.log('=== ProtectedRoute Debug ===');
  console.log('Usuario en ProtectedRoute:', user);
  console.log('Ruta actual:', location.pathname);
  console.log('Roles permitidos:', allowedRoles);
  console.log('========================');

  // Si no hay usuario, redirigir al login
  if (!user || !user.rol) {
    console.log('No hay usuario o no tiene rol, redirigiendo a login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificación específica para rutas de admin
  if (location.pathname.includes('dashboardadmin')) {
    console.log('Ruta de admin detectada');
    if (user.rol !== 'admin') {
      console.log('Redirigiendo a LoginAdmin - Acceso no autorizado a ruta de admin');
      return <Navigate to="/LoginAdmin" state={{ from: location }} replace />;
    }
  }

  // Verificación de roles permitidos
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    console.log('Usuario no tiene rol permitido:', user.rol);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si todo está bien, renderizar el componente
  console.log('Acceso permitido para usuario:', user);
  return children;
};

export default ProtectedRoute;