import { useEffect, useState } from 'react';

export default function useNegocioActivo() {
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setError('No hay usuario logueado');
      setLoading(false);
      return;
    }

    const negocioActivoId = localStorage.getItem('negocio_activo');

    fetch('https://spectacular-recreation-production.up.railway.app/proveedores')
      .then(res => res.json())
      .then(data => {
        let proveedorLogueado;
        
        // Primero buscar el negocio activo
        if (negocioActivoId) {
          proveedorLogueado = data.find(p => 
            p.id_provedor === Number(negocioActivoId) && 
            p.PERSONA_id_persona === user.PERSONA_id_persona
          );
        }
        
        // Si no se encuentra el negocio activo o no pertenece al usuario actual,
        // buscar el primer negocio del usuario
        if (!proveedorLogueado) {
          proveedorLogueado = data.find(p => p.PERSONA_id_persona === user.PERSONA_id_persona);
          // Si se encuentra un negocio del usuario, actualizar el negocio activo
          if (proveedorLogueado) {
            localStorage.setItem('negocio_activo', proveedorLogueado.id_provedor);
          }
        }

        if (proveedorLogueado) {
          setProveedor(proveedorLogueado);
        } else {
          setError('No se encontró tu perfil de proveedor');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar los datos del proveedor');
        setLoading(false);
      });
  }, []);

  return { proveedor, loading, error };
}
