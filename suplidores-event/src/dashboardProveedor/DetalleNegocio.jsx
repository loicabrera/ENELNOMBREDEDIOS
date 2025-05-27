import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetalleNegocio = () => {
  const { id } = useParams();
  const [negocio, setNegocio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/proveedores/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No se encontró el negocio');
        return res.json();
      })
      .then(data => {
        setNegocio(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center">Cargando negocio...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!negocio) return <div className="p-8 text-center">No se encontró el negocio.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-4" style={{ color: '#012e33' }}>{negocio.nombre_empresa}</h1>
      <div className="mb-2"><b>Tipo:</b> {negocio.tipo_servicio}</div>
      <div className="mb-2"><b>Dirección:</b> {negocio.direccion}</div>
      <div className="mb-2"><b>Teléfono:</b> {negocio.telefono_empresa}</div>
      <div className="mb-2"><b>Email:</b> {negocio.email_empresa}</div>
      <div className="mb-2"><b>Fecha de creación:</b> {negocio.fecha_creacion}</div>
      {negocio.descripcion && <div className="mb-2"><b>Descripción:</b> {negocio.descripcion}</div>}
      {negocio.redes_sociales && <div className="mb-2"><b>Redes sociales:</b> {negocio.redes_sociales}</div>}
    </div>
  );
};

export default DetalleNegocio; 