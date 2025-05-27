import React, { useEffect, useState } from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Negocios = () => {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }

    // Cargar todos los negocios del usuario
    fetch('http://localhost:3000/proveedores')
      .then(res => res.json())
      .then(data => {
        const negociosUsuario = data
          .filter(p => p.PERSONA_id_persona === user.PERSONA_id_persona)
          .map(proveedor => ({
            id: proveedor.id_provedor,
            nombre: proveedor.nombre_empresa,
            tipo: proveedor.tipo_servicio,
            direccion: proveedor.direccion,
            telefono: proveedor.telefono_empresa,
            email: proveedor.email_empresa,
            estado: 'Activo', // Puedes mejorar esto luego
            fechaCreacion: proveedor.fecha_creacion
          }));
        setNegocios(negociosUsuario);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar los negocios:', error);
        setLoading(false);
      });
  }, []);

  const handleAgregarNegocio = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }
    // Redirigir al formulario de datos proveedor
    navigate('/datosproveedor2', {
      state: {
        id_persona: user.PERSONA_id_persona,
        plan: 'basico'
      }
    });
  };

  const handleVerDetalles = (negocio) => {
    localStorage.setItem('empresa_activa', negocio.id);
    navigate('/dashboard-proveedor'); // O la ruta de tu dashboard
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#fbcbdb]">
        Cargando...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fbcbdb] py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-[#012e33]">Mis Negocios</h2>
          <button 
            onClick={handleAgregarNegocio}
            className="px-6 py-3 bg-[#012e33] text-white rounded-xl hover:bg-[#fbaccb] transition-colors duration-300 font-semibold flex items-center gap-2"
          >
            <BuildingStorefrontIcon className="h-5 w-5" />
            Agregar Negocio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {negocios.map((negocio) => (
            <div key={negocio.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#012e33]">{negocio.nombre}</h3>
                <span className="px-3 py-1 bg-[#cbb4db] text-[#012e33] rounded-full text-sm font-medium">
                  {negocio.estado}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-[#012e33]"><strong>Tipo:</strong> {negocio.tipo}</p>
                <p className="text-[#012e33]"><strong>Dirección:</strong> {negocio.direccion}</p>
                <p className="text-[#012e33]"><strong>Teléfono:</strong> {negocio.telefono}</p>
                <p className="text-[#012e33]"><strong>Email:</strong> {negocio.email}</p>
                <p className="text-[#012e33]"><strong>Fecha de creación:</strong> {new Date(negocio.fechaCreacion).toLocaleDateString()}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-[#012e33] text-white rounded-lg hover:bg-[#fbaccb] transition-colors duration-300">
                  Editar
                </button>
                <button
                  className="flex-1 px-4 py-2 border-2 border-[#012e33] text-[#012e33] rounded-lg hover:bg-[#fbcbdb] transition-colors duration-300"
                  onClick={() => handleVerDetalles(negocio)}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Negocios; 