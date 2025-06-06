import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importar useAuth

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useAuth(); // Usar el hook useAuth para obtener el estado de autenticación
  const [adminAuth, setAdminAuth] = useState({ checked: false, isAuthenticated: false, user: null });

  // Verificar sesión de admin si la ruta es de admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (location.pathname.includes('dashboardadmin') || location.pathname.includes('enelnombrededios')) {
        try {
          const res = await fetch('https://spectacular-recreation-production.up.railway.app/api/verify-auth-admin', { credentials: 'include' });
          if (res.ok) {
            const data = await res.json();
            setAdminAuth({ checked: true, isAuthenticated: data.isAuthenticated, user: data.user });
          } else {
            setAdminAuth({ checked: true, isAuthenticated: false, user: null });
          }
        } catch {
          setAdminAuth({ checked: true, isAuthenticated: false, user: null });
        }
      } else {
        setAdminAuth({ checked: true, isAuthenticated: false, user: null });
      }
    };
    checkAdmin();
  }, [location.pathname]);

  // Permitir acceso a rutas de admin si isAdmin está en localStorage
  const isAdminLocal = localStorage.getItem('isAdmin') === 'true';

  // Mientras carga la verificación, puedes mostrar un spinner o un mensaje
  if ((loading && !adminAuth.checked) || (location.pathname.includes('dashboardadmin') && !adminAuth.checked)) {
    return <div>Cargando autenticación...</div>; // O un spinner más elaborado
  }

  // Determinar el rol del usuario autenticado (si existe)
  const userRole = user?.provedorId ? 'proveedor' : user?.adminId ? 'admin' : null;

  // Lógica de redirección basada en el estado del contexto y roles
  const requiresAdmin = location.pathname.includes('dashboardadmin') || location.pathname.includes('enelnombrededios');
  const requiresProveedor = allowedRoles && allowedRoles.includes('proveedor');

  if (requiresAdmin) {
    if (!adminAuth.isAuthenticated || adminAuth.user?.rol !== 'admin') {
      return <Navigate to="/enelnombrededios" state={{ from: location }} replace />;
    }
    // Si está autenticado como admin, permitir acceso
    return children;
  }

  if (!isAuthenticated || userRole === null) {
    if (location.pathname.includes('dashboardadmin') || location.pathname.includes('enelnombrededios')) {
      return <Navigate to="/enelnombrededios" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  if (isAuthenticated) {
    if (requiresProveedor && userRole !== 'proveedor') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else if (location.pathname === '/login' || location.pathname === '/enelnombrededios') {
      if(userRole === 'admin') return <Navigate to="/dashboardadmin" state={{ from: location }} replace />;
      if(userRole === 'proveedor') return <Navigate to="/dashboard-proveedor" state={{ from: location }} replace />;
      return <Navigate to="/" state={{ from: location }} replace />;
    } else {
      return children;
    }
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute; 