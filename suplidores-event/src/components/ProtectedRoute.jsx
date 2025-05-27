import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Si no hay usuario o el usuario no tiene el rol permitido, redirigir al login
  if (!user || (allowedRoles && !allowedRoles.includes(user.rol))) {
    return <Navigate to="/login" replace />;
  }

  // Si todo está bien, renderizar el componente
  return children;
};

export default ProtectedRoute;