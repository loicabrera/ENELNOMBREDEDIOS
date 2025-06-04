import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Almacenará datos básicos del usuario (provedorId, personaId, etc.)

  // Función para verificar la autenticación
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
          console.log('AuthContext: verifyAuth exitoso. Estableciendo estado autenticado.', data.user);
          setIsAuthenticated(true);
          // Guarda los datos básicos del usuario que el backend envía en el payload del JWT
          setUser(data.user);
          console.log('AuthContext: Estado después de verifyAuth exitoso - isAuthenticated:', true, 'user:', data.user);
        } else {
          // Autenticación fallida según el backend
          console.log('AuthContext: verifyAuth fallido (backend dice no autenticado).');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // Respuesta no OK (ej. 401, 403), autenticación fallida
        console.log('AuthContext: verifyAuth fallido (respuesta no OK). Status:', response.status);
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error al verificar autenticación en AuthContext:', error);
      // En caso de error de red u otro, asumir no autenticado por seguridad
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      console.log('AuthContext: verifyAuth finalizado. Estado final - isAuthenticated:', isAuthenticated, 'loading:', loading);
      setLoading(false);
    }
  };

  // Nueva función de login para ser llamada por los componentes de login
  const login = async (username, password) => {
    setLoading(true); // Opcional: mostrar carga durante el proceso de login
    try {
      const response = await fetch('https://spectacular-recreation-production.up.railway.app/login_proveedor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar sesión en el backend');
      }

      // Si el login fue exitoso, forzamos una verificación de autenticación
      // para que el contexto se actualice con los datos del usuario de la cookie.
      await verifyAuth(); 
      
      // Después de verifyAuth(), el estado isAuthenticated debería ser true si todo salió bien.
      // No necesitamos retornar el user aquí, ya que verifyAuth lo actualiza en el estado del contexto.

    } catch (error) {
      console.error('Error en la función login del AuthContext:', error);
      // Es importante resetear el estado si el login falla para no quedarse en un estado inconsistente
      setIsAuthenticated(false);
      setUser(null);
      // Propagamos el error para que el componente Login pueda mostrarlo al usuario
      throw error; 
    } finally {
      // setLoading(false); // verifyAuth ya maneja el final del loading
    }
  };

  useEffect(() => {
    verifyAuth();
    // La verificación se realiza una vez al cargar la aplicación o al montar el proveedor.
    // Si necesitas re-verificar en cambios de ruta, podrías añadir location.pathname como dependencia, 
    // pero ProtectedRoute ya maneja la redirección basada en el estado de este contexto.
  }, []); 

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, setIsAuthenticated, setUser, login }}>
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