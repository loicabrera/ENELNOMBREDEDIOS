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

    fetch('http://localhost:3000/proveedores')
      .then(res => res.json())
      .then(data => {
        let proveedorLogueado;
        if (negocioActivoId) {
          proveedorLogueado = data.find(p => p.id_provedor === Number(negocioActivoId));
        }
        if (!proveedorLogueado) {
          proveedorLogueado = data.find(p => p.PERSONA_id_persona === user.PERSONA_id_persona);
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
