import React, { useEffect, useState } from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import { FaStore, FaCalendarAlt, FaClock, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const Negocios = () => {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedNegocio, setSelectedNegocio] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNegocios();
  }, []);

  const fetchNegocios = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:3000/proveedores');
      const data = await response.json();
      const negociosFiltrados = data.filter(p => p.PERSONA_id_persona === user.PERSONA_id_persona);
      
      // Obtener el estado de membresía para cada negocio
      const negociosConEstado = await Promise.all(
        negociosFiltrados.map(async (negocio) => {
          const membresiaRes = await fetch(`http://localhost:3000/membresia/${negocio.id_provedor}`);
          const membresiaData = await membresiaRes.json();
          return {
            ...negocio,
            estado: membresiaData.estado,
            razon_inactivacion: membresiaData.razon_inactivacion
          };
        })
      );

      setNegocios(negociosConEstado);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener negocios:', error);
      setLoading(false);
    }
  };

  const handleNegocioClick = (negocio) => {
    if (negocio.estado === 'inactiva') {
      setSelectedNegocio(negocio);
      setShowModal(true);
    } else {
      localStorage.setItem('negocio_activo', negocio.id_provedor);
      navigate(`/dashboard-proveedor/negocios/${negocio.id_provedor}`);
    }
  };

  const handleActivarNegocio = () => {
    setShowModal(false);
    navigate('/dashboard-proveedor/membresia');
  };

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
        plan: 'basico',
        isNewBusiness: true
      }
    });
  };

  const handleVerDetalles = (negocio) => {
    localStorage.setItem('empresa_activa', negocio.id_provedor);
    navigate('/dashboard-proveedor'); // O la ruta de tu dashboard
  };

  const handleEliminarNegocio = async (idNegocio) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este negocio? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`http://localhost:3000/proveedores/${idNegocio}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setNegocios(negocios.filter(n => n.id_provedor !== idNegocio));
        alert('Negocio eliminado correctamente');
      } else {
        alert('Error al eliminar el negocio');
      }
    } catch (error) {
      alert('Error al eliminar el negocio');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#fbcbdb]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fbcbdb] py-8 flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-4xl font-bold text-[#012e33] text-center md:text-left w-full md:w-auto">Mis Negocios</h2>
          <button 
            onClick={handleAgregarNegocio}
            className="px-6 py-3 bg-[#012e33] text-black rounded-xl hover:bg-[#fbaccb] hover:text-[#012e33] transition-colors duration-300 font-semibold flex items-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-[#012e33] focus:ring-offset-2"
          >
            <BuildingStorefrontIcon className="h-5 w-5" />
            Agregar Negocio
          </button>
        </div>

        {/* Modal para negocios inactivos */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-500 text-xl" />
                  <h3 className="text-xl font-semibold text-[#012e33]">¡Error!</h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  No puedes seleccionar el negocio <span className="font-semibold">"{selectedNegocio?.nombre_empresa}"</span> porque está inactivo.
                </p>
                <p className="text-gray-700">
                  Para activar tu negocio, necesitas renovar tu membresía.
                </p>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleActivarNegocio}
                  className="px-4 py-2 bg-[#012e33] text-white rounded-lg hover:bg-[#fbaccb] hover:text-[#012e33] transition-colors duration-300"
                >
                  Ir a Renovar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
          {negocios.map((negocio) => (
            <div
              key={negocio.id_provedor}
              className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between h-full transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl border ${
                negocio.estado === 'inactiva' ? 'border-2 border-red-500' : 'border-[#e5e7eb]'
              }`}
              tabIndex={0}
              aria-label={`Negocio ${negocio.nombre_empresa}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#012e33] truncate max-w-[70%]">{negocio.nombre_empresa}</h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    negocio.estado === 'activa' ? 'bg-green-100 text-green-800' :
                    negocio.estado === 'por vencer' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {negocio.estado === 'activa' ? 'Activo' :
                     negocio.estado === 'por vencer' ? 'Por vencer' :
                     'Inactivo'}
                  </span>
                </div>
                <div className="space-y-2 text-[#012e33] text-base">
                  <p><strong>Tipo:</strong> {negocio.tipo_servicio}</p>
                  <p><strong>Dirección:</strong> <span className="break-words">{negocio.direccion}</span></p>
                  <p><strong>Teléfono:</strong> {negocio.telefono_empresa}</p>
                  <p><strong>Email:</strong> <span className="break-words">{negocio.email_empresa}</span></p>
                  <p><strong>Fecha de creación:</strong> {new Date(negocio.fecha_creacion).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => handleNegocioClick(negocio)}
                  className="w-full px-4 py-2 bg-[#012e33] text-white rounded-lg hover:bg-[#fbaccb] hover:text-[#012e33] transition-colors duration-300"
                >
                  Seleccionar Negocio
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