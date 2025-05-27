import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditarServicio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', tipo_servicio: '', precio: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/servicios')
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
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/servicios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        navigate('/dashboard-proveedor/publicaciones');
      } else {
        setError('Error al guardar los cambios');
      }
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
              <input
                type="text"
                name="tipo_servicio"
                value={form.tipo_servicio}
                onChange={handleChange}
                placeholder="Tipo de servicio"
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-[#cbb4db] focus:border-[#cbb4db] text-lg"
                required
              />
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
          <button type="submit" className="mt-6 bg-[#cbb4db] hover:bg-[#b39cc9] text-white font-bold py-3 rounded-lg text-lg shadow transition-all duration-200">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default EditarServicio; 