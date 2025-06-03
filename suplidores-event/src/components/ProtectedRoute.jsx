import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);
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

  useEffect(() => {
    // Verificación inmediata para proveedores
    if (user && user.rol === 'proveedor') {
      const rutasPermitidas = ['/dashboard-proveedor', '/pago-cambio-plan'];
      const rutaActual = location.pathname;
      
      // Si la ruta actual no está en las rutas permitidas
      if (!rutasPermitidas.some(ruta => rutaActual.startsWith(ruta))) {
        console.log('Proveedor intentando acceder a ruta no permitida:', rutaActual);
        setRedirectPath('/dashboard-proveedor');
        setShouldRedirect(true);
        return;
      }
    }

    // Verificación específica para admin
    if (user && user.rol === 'admin') {
      const rutasAdmin = ['/dashboardadmin', '/enelnombrededios'];
      const rutaActual = location.pathname;
      
      // Si el admin intenta salir de sus rutas permitidas o acceder al login de proveedor
      if (!rutasAdmin.some(ruta => rutaActual.startsWith(ruta)) || rutaActual === '/login') {
        console.log('Admin intentando acceder a ruta no permitida:', rutaActual);
        setRedirectPath('/dashboardadmin');
        setShouldRedirect(true);
        return;
      }
    }

    if (!user || !user.rol) {
      console.log('No hay usuario válido, redirigiendo a login');
      clearUserData();
      if (location.pathname.includes('dashboardadmin') || location.pathname.includes('enelnombrededios')) {
        setRedirectPath('/enelnombrededios');
      } else {
        setRedirectPath('/login');
      }
      setShouldRedirect(true);
      return;
    }

    // Verificación específica para rutas de admin
    if (location.pathname.includes('dashboardadmin') || location.pathname.includes('enelnombrededios')) {
      if (user.rol !== 'admin') {
        if (user.rol === 'proveedor') {
          setRedirectPath('/dashboard-proveedor');
        } else {
          clearUserData();
          setRedirectPath('/enelnombrededios');
        }
        setShouldRedirect(true);
        return;
      }
    }

    // Verificación específica para clientes
    if (user.rol === 'cliente') {
      if (location.pathname.includes('dashboard-proveedor') || 
          location.pathname.includes('dashboardadmin') ||
          location.pathname.includes('enelnombrededios')) {
        setRedirectPath('/');
        setShouldRedirect(true);
        return;
      }
    }

    // Verificación específica para rutas de proveedor
    if (location.pathname === '/login') {
      if (user && user.rol === 'admin') {
        setRedirectPath('/dashboardadmin');
        setShouldRedirect(true);
        return;
      }
    }

    // Verificación de roles permitidos
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
      if (user.rol === 'proveedor') {
        setRedirectPath('/dashboard-proveedor');
      } else if (user.rol === 'admin') {
        setRedirectPath('/dashboardadmin');
      } else {
        setRedirectPath('/');
      }
      setShouldRedirect(true);
      return;
    }

    setShouldRedirect(false);
  }, [location.pathname, user, allowedRoles]);

  useEffect(() => {
    if (shouldRedirect && redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [shouldRedirect, redirectPath, navigate]);

  // Si todo está bien, renderizar el componente
  if (!shouldRedirect) {
    return children;
  }

  return null;
};

export default ProtectedRoute; 