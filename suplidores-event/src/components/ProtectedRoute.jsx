import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();
  let user = null;
  
  // Función para limpiar el localStorage de manera segura
  const clearUserData = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('negocio_activo');
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
           typeof userData.rol === 'string' &&
           userData.expiresAt && 
           new Date(userData.expiresAt) > new Date();
  };

  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user = JSON.parse(userStr);
      // Si el usuario no es válido o la sesión expiró, limpiar el localStorage
      if (!isValidUser(user)) {
        console.log('Usuario inválido o sesión expirada, limpiando...');
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

  // Si no hay usuario válido, redirigir al login correspondiente
  if (!user || !user.rol) {
    console.log('No hay usuario válido, redirigiendo a login');
    clearUserData(); // Limpiar cualquier dato corrupto
    if (location.pathname.includes('dashboardadmin')) {
      navigate('/LoginAdmin', { replace: true });
      return null;
    }
    navigate('/login', { replace: true });
    return null;
  }

  // Verificación específica para rutas de admin
  if (location.pathname.includes('dashboardadmin')) {
    console.log('Ruta de admin detectada');
    if (user.rol !== 'admin') {
      console.log('Redirigiendo a LoginAdmin - Acceso no autorizado a ruta de admin');
      clearUserData(); // Limpiar datos si no es admin
      navigate('/LoginAdmin', { replace: true });
      return null;
    }
  }

  // Verificación de roles permitidos
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    console.log('Usuario no tiene rol permitido:', user.rol);
    clearUserData(); // Limpiar datos si el rol no está permitido
    if (user.rol === 'admin') {
      navigate('/LoginAdmin', { replace: true });
      return null;
    }
    navigate('/login', { replace: true });
    return null;
  }

  // Si todo está bien, renderizar el componente
  console.log('Acceso permitido para usuario:', user);
  return children;
};

export default ProtectedRoute; 