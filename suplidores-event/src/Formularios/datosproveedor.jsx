import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar';


const DatosProveedor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ...location.state?.formData,
    nombre_empresa: '',
    email_empresa: '',
    telefono_empresa: '',
    tipo_servicio: '',
    fecha_creacion: '',
    direccion: '',
    descripcion: '',
    redes_sociales: '',
    PERSONA_id_persona: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del proveedor:', formData);
    navigate('/registro/confirmacion', { state: { formData } });
  };

  return (
    <>
      <ProgressBar currentStep={1} />
      <form onSubmit={handleSubmit}>
        <h2>Datos del Proveedor</h2>

        <label>
          Nombre de la empresa:
          <input type="text" name="nombre_empresa" value={formData.nombre_empresa} onChange={handleChange} required />
        </label>

        <label>
          Email de la empresa:
          <input type="email" name="email_empresa" value={formData.email_empresa} onChange={handleChange} required />
        </label>

        <label>
          Teléfono de la empresa:
          <input type="text" name="telefono_empresa" value={formData.telefono_empresa} onChange={handleChange} required />
        </label>

        <label>
          Tipo de servicio:
          <input type="text" name="tipo_servicio" value={formData.tipo_servicio} onChange={handleChange} required />
        </label>

        <label>
          Fecha de creación:
          <input type="datetime-local" name="fecha_creacion" value={formData.fecha_creacion} onChange={handleChange} required />
        </label>

        <label>
          Dirección:
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
        </label>

        <label>
          Descripción:
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required></textarea>
        </label>

        <label>
          Redes sociales:
          <input type="text" name="redes_sociales" value={formData.redes_sociales} onChange={handleChange} required />
        </label>

        <button type="submit">Siguiente</button>
      </form>
    </>
  );
};

export default DatosProveedor;
