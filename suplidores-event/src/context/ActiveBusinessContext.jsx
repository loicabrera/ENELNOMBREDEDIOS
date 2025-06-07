import React, { createContext, useContext, useState, useEffect } from 'react';

const ActiveBusinessContext = createContext();

export const ActiveBusinessProvider = ({ children }) => {
  // Intenta cargar el negocio activo de sessionStorage al iniciar
  const [activeBusiness, setActiveBusiness] = useState(() => {
    const stored = sessionStorage.getItem('activeBusiness');
    return stored ? JSON.parse(stored) : null;
  });

  // Cuando cambie el negocio activo, guárdalo en sessionStorage
  useEffect(() => {
    if (activeBusiness) {
      sessionStorage.setItem('activeBusiness', JSON.stringify(activeBusiness));
    } else {
      sessionStorage.removeItem('activeBusiness');
    }
  }, [activeBusiness]);

  // Nueva función para limpiar el negocio activo
  const clearActiveBusiness = () => {
    setActiveBusiness(null);
    sessionStorage.removeItem('activeBusiness');
  };

  return (
    <ActiveBusinessContext.Provider value={{ activeBusiness, setActiveBusiness, clearActiveBusiness }}>
      {children}
    </ActiveBusinessContext.Provider>
  );
};

export const useActiveBusiness = () => {
  const context = useContext(ActiveBusinessContext);
  if (!context) {
    throw new Error('useActiveBusiness must be used within an ActiveBusinessProvider');
  }
  return context;
}; 