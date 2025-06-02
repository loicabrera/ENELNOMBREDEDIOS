import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditarServicio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', tipo_servicio: '', precio: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  const [imagenesEliminadas, setImagenesEliminadas] = useState([]);
  const [limiteFotos, setLimiteFotos] = useState(8);

  useEffect(() => {
    fetch('https://spectacular-recreation-production.up.railway.app/api/servicios')
      .then(res => res.json())
      .then(servicios => {
        const serv = servicios.find(s => s.id_servicio === Number(id));
        if (!serv) {
          setError('Servicio no encontrado');
          setLoading(false);
          return;
        }
        setServicio(serv);
        setForm({
          nombre: serv.nombre,
          descripcion: serv.descripcion,
          tipo_servicio: serv.tipo_servicio || '',
          precio: serv.precio
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar el servicio');
        setLoading(false);
      });
    // Cargar imágenes actuales
    fetch(`https://spectacular-recreation-production.up.railway.app/api/imagenes_servicio/por-servicio/${id}`)
      .then(res => res.json())
      .then(setImagenes);
    // Cargar límite de fotos (opcional)
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEliminarImagen = (imgId) => {
    setImagenesEliminadas(prev => [...prev, imgId]);
    setImagenes(prev => prev.filter(img => img.id_imagenes !== imgId));
  };

  const handleImagenesNuevas = (e) => {
    const files = Array.from(e.target.files);
    if (imagenes.length + imagenesNuevas.length + files.length > limiteFotos) {
      alert(`Solo puedes tener hasta ${limiteFotos} imágenes en total.`);
      return;
    }
    setImagenesNuevas(prev => [...prev, ...files]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // 1. Actualizar datos del servicio
      const res = await fetch(`https://spectacular-recreation-production.up.railway.app/api/servicios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        setError('Error al guardar los cambios');
        return;
      }
      // 2. Eliminar imágenes marcadas
      for (let imgId of imagenesEliminadas) {
        await fetch(`https://spectacular-recreation-production.up.railway.app/api/imagenes_servicio/${imgId}`, { method: 'DELETE' });
      }
      // 3. Subir nuevas imágenes
      for (let img of imagenesNuevas) {
        const formData = new FormData();
        formData.append('imagen', img);
        formData.append('SERVICIO_id_servicio', id);
        await fetch('https://spectacular-recreation-production.up.railway.app/api/imagenes_servicio', {
          method: 'POST',
          body: formData
        });
      }
      navigate('/dashboard-proveedor/publicaciones');
    } catch {
      setError('Error de conexión');
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando servicio...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#cbb4db' }}>Editar Servicio</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Nombre del servicio</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del servicio"
              className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#cbb4db] focus:border-[#cbb4db] text-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción"
              className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#cbb4db] focus:border-[#cbb4db] text-lg min-h-[100px]"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Tipo de servicio</label>
              <select
                name="tipo_servicio"
                value={form.tipo_servicio}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#cbb4db] focus:border-[#cbb4db] text-lg"
                required
              >
                <option value="">Seleccione una categoría</option>
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
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-gray-700">Precio</label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Precio"
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#cbb4db] focus:border-[#cbb4db] text-lg"
                required
              />
            </div>
          </div>

          {/* Imágenes actuales */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Imágenes actuales</label>
            <div className="flex flex-wrap gap-4">
              {imagenes.map(img => (
                <div key={img.id_imagenes} className="relative group">
                  <img
                    src={`https://spectacular-recreation-production.up.railway.app/api/imagenes_servicio/${img.id_imagenes}`}
                    alt="Imagen servicio"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => handleEliminarImagen(img.id_imagenes)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs opacity-80 group-hover:opacity-100"
                    title="Eliminar imagen"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subir nuevas imágenes */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Agregar nuevas imágenes</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagenesNuevas}
              className="block w-full text-sm text-gray-500"
            />
            {imagenesNuevas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imagenesNuevas.map((img, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={img.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="text-xs mt-1">{img.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="mt-6 bg-[#cbb4db] hover:bg-[#b39cc9] text-white font-bold py-3 rounded-lg text-lg shadow transition-all duration-200">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default EditarServicio; 