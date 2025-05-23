import React, { useEffect, useState } from 'react';
import { 
  PhotoIcon, 
  MapPinIcon, 
  ClockIcon, 
  LinkIcon 
} from '@heroicons/react/24/outline';

const Profile = () => {
  const [proveedor, setProveedor] = useState(null);
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Fetch proveedores
    fetch('http://localhost:3000/proveedores')
      .then(res => res.json())
      .then(data => {
        const proveedorLogueado = data.find(
          p => p.PERSONA_id_persona === user.PERSONA_id_persona
        );
        setProveedor(proveedorLogueado);
        if (proveedorLogueado) {
          // Fetch persona
          fetch('http://localhost:3000/persona')
            .then(res => res.json())
            .then(personas => {
              const personaLogueada = personas.find(
                per => per.id_persona === proveedorLogueado.PERSONA_id_persona
              );
              setPersona(personaLogueada);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (!proveedor) return <div>No se encontró tu perfil de proveedor.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Perfil del Negocio</h2>
      <div className="space-y-2 mb-6">
        <p><strong>Nombre de la empresa:</strong> {proveedor.nombre_empresa}</p>
        <p><strong>Email de la empresa:</strong> {proveedor.email_empresa}</p>
        <p><strong>Teléfono de la empresa:</strong> {proveedor.telefono_empresa}</p>
        <p><strong>Tipo de servicio:</strong> {proveedor.tipo_servicio}</p>
        <p><strong>Fecha de creación:</strong> {proveedor.fecha_creacion ? new Date(proveedor.fecha_creacion).toLocaleDateString() : ''}</p>
        <p><strong>Dirección:</strong> {proveedor.direccion}</p>
        <p><strong>Descripción:</strong> {proveedor.descripcion}</p>
        <p><strong>Redes sociales:</strong> {proveedor.redes_sociales}</p>
      </div>
      {persona && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold mb-2">Datos Personales</h3>
          <p><strong>Nombre:</strong> {persona.nombre}</p>
          <p><strong>Apellido:</strong> {persona.apellido}</p>
          <p><strong>Teléfono:</strong> {persona.telefono}</p>
          <p><strong>Email:</strong> {persona.email}</p>
          <p><strong>Cédula:</strong> {persona.cedula}</p>
        </div>
      )}
    </div>
  );
};

export default Profile; 