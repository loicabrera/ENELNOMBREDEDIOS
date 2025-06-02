import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IMAGEN_DEFAULT = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; // Imagen predeterminada

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [imagenesServicios, setImagenesServicios] = useState({}); // { id_servicio: [imagenes] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://spectacular-recreation-production.up.railway.app/api/servicios')
      .then(res => res.json())
      .then(async data => {
        // Filtrar servicios de negocios activos
        const serviciosFiltrados = await Promise.all(
          data.map(async (servicio) => {
            const membresiaRes = await fetch(`https://spectacular-recreation-production.up.railway.app/membresia/${servicio.provedor_negocio_id_provedor}`);
            const membresiaData = await membresiaRes.json();
            return membresiaData.estado !== 'inactiva' ? servicio : null;
          })
        );
        
        const serviciosActivos = serviciosFiltrados.filter(s => s !== null);
        setServicios(serviciosActivos);

        // Obtener imágenes para cada servicio
        const imagenesObj = {};
        await Promise.all(
          serviciosActivos.map(async (servicio) => {
            const resImg = await fetch(`https://spectacular-recreation-production.up.railway.app/api/imagenes_servicio/por-servicio/${servicio.id_servicio}`);
            if (resImg.ok) {
              const imgs = await resImg.json();
              imagenesObj[servicio.id_servicio] = imgs;
            } else {
              imagenesObj[servicio.id_servicio] = [];
            }
          })
        );
        setImagenesServicios(imagenesObj);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar los servicios');
        setLoading(false);
      });
  }, []);

  const serviciosFiltrados = filtroTipo ? servicios.filter(s => s.tipo_servicio === filtroTipo) : servicios;

  if (loading) return <div className="p-8 text-center">Cargando servicios...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#cbb4db' }}>Servicios disponibles</h2>
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#cbb4db] focus:border-[#cbb4db]"
        >
          <option value="">Todas las categorías</option>
          <option value="Comida y Bebidas">Comida y Bebidas</option>
          <option value="Catering">Catering</option>
          <option value="Decoración">Decoración</option>
          <option value="Entretenimiento">Entretenimiento</option>
          <option value="Fotografía y Video">Fotografía y Video</option>
          <option value="Música">Música</option>
          <option value="Coordinación de Eventos">Coordinación de Eventos</option>
          <option value="Lugar y Espacio">Lugar y Espacio</option>
          <option value="Mobiliario y Equipos">Mobiliario y Equipos</option>
          <option value="Transporte">Transporte</option>
          <option value="Otros">Otros</option>
        </select>
      </div>
      {serviciosFiltrados.length === 0 ? (
        <div className="text-gray-600">No hay servicios publicados.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {serviciosFiltrados.map(servicio => {
            const imagenes = imagenesServicios[servicio.id_servicio] || [];
            const imagenReal = imagenes.length > 0 ? `https://spectacular-recreation-production.up.railway.app/api/imagenes_servicio/${imagenes[0].id_imagenes}` : null;
            return (
              <div
                key={servicio.id_servicio}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-200 cursor-pointer"
                onClick={() => navigate(`/servicios/${servicio.id_servicio}`)}
              >
                {imagenReal && (
                  <img
                    src={imagenReal}
                    alt={servicio.nombre}
                    className="w-full h-48 object-cover bg-gray-100"
                  />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-semibold" style={{ color: '#cbb4db' }}>{servicio.nombre}</h3>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Servicios;
