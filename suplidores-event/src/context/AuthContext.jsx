import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Almacenará datos básicos del usuario (provedorId, personaId, etc.)

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      try {
        // Llama a la ruta del backend que verifica el JWT en la cookie
        const response = await fetch('https://spectacular-recreation-production.up.railway.app/api/verify-auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Importante: Incluir credenciales para que el navegador envíe la HttpOnly cookie
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          // Si el backend verifica la autenticación
          if (data.isAuthenticated) {
            setIsAuthenticated(true);
            // Guarda los datos básicos del usuario que el backend envía en el payload del JWT
            setUser(data.user); 
          } else {
            // Autenticación fallida según el backend
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          // Respuesta no OK (ej. 401, 403), autenticación fallida
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error al verificar autenticación en AuthContext:', error);
        // En caso de error de red u otro, asumir no autenticado por seguridad
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
    // La verificación se realiza una vez al cargar la aplicación o al montar el proveedor.
    // Si necesitas re-verificar en cambios de ruta, podrías añadir location.pathname como dependencia, 
    // pero ProtectedRoute ya maneja la redirección basada en el estado de este contexto.
  }, []); 

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, setIsAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 