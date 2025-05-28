import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  let user = null;
  
  // Función para limpiar el localStorage de manera segura
  const clearUserData = () => {
    try {
      localStorage.removeItem('user');
      console.log('Datos de usuario limpiados del localStorage');
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  };

  // Función para validar el usuario
  const isValidUser = (userData) => {
    return userData && 
           typeof userData === 'object' && 
           userData.rol && 
           typeof userData.rol === 'string';
  };

  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
      // Si el usuario no es válido, limpiar el localStorage
      if (!isValidUser(user)) {
        console.log('Usuario inválido en localStorage, limpiando...');
        clearUserData();
        user = null;
      }
    }
  } catch (error) {
    console.error('Error al leer/parsear usuario:', error);
    clearUserData();
  }
  
  console.log('=== ProtectedRoute Debug ===');
  console.log('Usuario en ProtectedRoute:', user);
  console.log('Ruta actual:', location.pathname);
  console.log('Roles permitidos:', allowedRoles);
  console.log('========================');

  // Si no hay usuario válido, redirigir al login
  if (!user || !user.rol) {
    console.log('No hay usuario válido, redirigiendo a login');
    clearUserData(); // Limpiar cualquier dato corrupto
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificación específica para rutas de admin
  if (location.pathname.includes('dashboardadmin')) {
    console.log('Ruta de admin detectada');
    if (user.rol !== 'admin') {
      console.log('Redirigiendo a LoginAdmin - Acceso no autorizado a ruta de admin');
      clearUserData(); // Limpiar datos si no es admin
      return <Navigate to="/LoginAdmin" state={{ from: location }} replace />;
    }
  }

  // Verificación de roles permitidos
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    console.log('Usuario no tiene rol permitido:', user.rol);
    clearUserData(); // Limpiar datos si el rol no está permitido
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si todo está bien, renderizar el componente
  console.log('Acceso permitido para usuario:', user);
  return children;
};

export default ProtectedRoute; 