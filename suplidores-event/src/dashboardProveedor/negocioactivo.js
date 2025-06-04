import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function useNegocioActivo() {
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchProveedor = async () => {
      if (authLoading) return;

      if (!isAuthenticated || !user || !user.provedorId) {
        setError('No hay usuario proveedor logueado o información insuficiente.');
        setLoading(false);
        localStorage.removeItem('user');
        localStorage.removeItem('negocio_activo');
        localStorage.removeItem('provedor_negocio_id_provedor');
        localStorage.removeItem('PERSONA_id_persona');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const provedorId = user.provedorId;
        const personaId = user.personaId;

        const response = await fetch('https://spectacular-recreation-production.up.railway.app/proveedores', { credentials: 'include' });
        if (!response.ok) throw new Error('Error al obtener proveedores');
        const data = await response.json();

        const proveedorLogueado = data.find(p => p.id_provedor === Number(provedorId));

        if (proveedorLogueado) {
          setProveedor(proveedorLogueado);
        } else {
          setError('No se encontró tu perfil de proveedor asociado.');
        }

      } catch (err) {
        console.error('Error al cargar los datos del proveedor:', err);
        setError('Error al cargar los datos del proveedor');
      } finally {
        setLoading(false);
      }
    };

    fetchProveedor();

  }, [isAuthenticated, user, authLoading]);

  return { proveedor, loading, error };
}
