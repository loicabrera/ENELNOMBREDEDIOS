import React, { useEffect, useState } from 'react';
import { BuildingStorefrontIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';

const Negocios = () => {
  const [negocios, setNegocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [negocioToDelete, setNegocioToDelete] = useState(null);
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

  const handleDeleteClick = (negocio) => {
    setNegocioToDelete(negocio);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/proveedores/${negocioToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted business from the state
        setNegocios(negocios.filter(n => n.id !== negocioToDelete.id));
        setShowDeleteModal(false);
        setNegocioToDelete(null);
      } else {
        console.error('Error al eliminar el negocio');
        alert('Error al eliminar el negocio');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el negocio');
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setNegocioToDelete(null);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#fbcbdb]">
        Cargando...
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
          {negocios.map((negocio) => (
            <div
              key={negocio.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between h-full transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl border border-[#e5e7eb] focus-within:ring-2 focus-within:ring-[#fbaccb]"
              tabIndex={0}
              aria-label={`Negocio ${negocio.nombre}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#012e33] truncate max-w-[70%]">{negocio.nombre}</h3>
                  <span className="px-3 py-1 bg-[#cbb4db] text-[#012e33] rounded-full text-sm font-medium">
                    {negocio.estado}
                  </span>
                </div>
                <div className="space-y-2 text-[#012e33] text-base">
                  <p><strong>Tipo:</strong> {negocio.tipo}</p>
                  <p><strong>Dirección:</strong> <span className="break-words">{negocio.direccion}</span></p>
                  <p><strong>Teléfono:</strong> {negocio.telefono}</p>
                  <p><strong>Email:</strong> <span className="break-words">{negocio.email}</span></p>
                  <p><strong>Fecha de creación:</strong> {new Date(negocio.fechaCreacion).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Link
                  to={`/dashboard-proveedor/negocios/${negocio.id}`}
                  className="flex-1 px-4 py-2 border-2 border-[#012e33] text-[#012e33] rounded-lg hover:bg-[#fbcbdb] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#012e33]"
                  onClick={() => localStorage.setItem('negocio_activo', negocio.id)}
                >
                  Activar 
                </Link>
                <button
                  onClick={() => handleDeleteClick(negocio)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-[#012e33] mb-4">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el negocio "{negocioToDelete?.nombre}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border-2 border-[#012e33] text-[#012e33] rounded-lg hover:bg-[#fbcbdb] transition-colors duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Negocios; 