import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('Usuario en ProtectedRoute:', user); // Debug log
  console.log('Ruta actual:', location.pathname); // Debug log
  console.log('Roles permitidos:', allowedRoles); // Debug log

  // Verificación específica para rutas de admin
  if (location.pathname.includes('dashboardadmin')) {
    if (!user || !user.rol || user.rol !== 'admin') {
      console.log('Redirigiendo a LoginAdmin - Acceso no autorizado a ruta de admin'); // Debug log
      return <Navigate to="/LoginAdmin" state={{ from: location }} replace />;
    }
  }

  // Verificación general de autenticación
  if (!user || !user.rol) {
    console.log('No hay usuario o no tiene rol, redirigiendo a login'); // Debug log
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificación de roles permitidos
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    console.log('Usuario no tiene rol permitido:', user.rol); // Debug log
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si todo está bien, renderizar el componente
  console.log('Acceso permitido para usuario:', user); // Debug log
  return children;
};

export default ProtectedRoute;