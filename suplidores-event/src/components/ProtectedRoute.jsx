import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('Usuario en ProtectedRoute:', user); // Debug log

  // Si no hay usuario, redirigir al login
  if (!user) {
    console.log('No hay usuario, redirigiendo a login'); // Debug log
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos y el usuario no tiene uno de esos roles, redirigir al login
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    console.log('Usuario no tiene rol permitido:', user.rol); // Debug log
    return <Navigate to="/login" replace />;
  }

  // Si todo está bien, renderizar el componente
  console.log('Acceso permitido para usuario:', user); // Debug log
  return children;
};

export default ProtectedRoute;