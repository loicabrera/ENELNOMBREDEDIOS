import React, { useEffect, useState } from 'react';
import { 
  PhotoIcon, 
  MapPinIcon, 
  ClockIcon, 
  LinkIcon,
  LockClosedIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useActiveBusiness } from '../context/ActiveBusinessContext.jsx';


const Profile = () => {
  const [proveedor, setProveedor] = useState(null);
  const [persona, setPersona] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const { user, isAuthenticated } = useAuth();
  const { activeBusiness } = useActiveBusiness();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!isAuthenticated || !activeBusiness?.id || !user.personaId) {
          setLoading(false);
          return;
        }

        const proveedorId = activeBusiness.id;
        const personaId = user.personaId;

        const resProveedor = await fetch(`https://spectacular-recreation-production.up.railway.app/proveedores/${proveedorId}`, { credentials: 'include' });
        if (!resProveedor.ok) throw new Error('Error al obtener datos del proveedor');
        const dataProveedor = await resProveedor.json();
        setProveedor(dataProveedor);

        const resPersona = await fetch(`https://spectacular-recreation-production.up.railway.app/personas/${personaId}`, { credentials: 'include' });
        if (!resPersona.ok) throw new Error('Error al obtener datos de la persona');
        const dataPersona = await resPersona.json();
        setPersona(dataPersona);

        const resUserName = await fetch(`https://spectacular-recreation-production.up.railway.app/api/obtener-username?personaId=${personaId}`, { credentials: 'include' });
        if (resUserName.ok) {
          const dataUserName = await resUserName.json();
          setUserName(dataUserName.user_name || '');
        }

        setLoading(false);

      } catch (err) {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, user, activeBusiness]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    if (!userName) {
      setPasswordMsg('Error: No se encontró la información del usuario para cambiar la contraseña.');
      return;
    }
    const res = await fetch('https://spectacular-recreation-production.up.railway.app/api/cambiar-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name: userName, oldPassword, newPassword })
    });
    const data = await res.json();
    if (data.success) {
      setPasswordMsg('Contraseña cambiada correctamente.');
      setOldPassword('');
      setNewPassword('');
      setShowPasswordForm(false);
    } else {
      setPasswordMsg(data.error || 'Error al cambiar la contraseña.');
    }
  };

  const handleTextClick = (title, content) => {
    setModalContent({ title, content });
    setShowModal(true);
  };

  if (loading) return <div className="w-full min-h-screen flex justify-center items-center bg-[#fbcbdb]">Cargando...</div>;
  if (!proveedor) return <div className="w-full min-h-screen flex justify-center items-center bg-[#fbcbdb]">No se encontró tu perfil de proveedor.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5E5] via-[#fbcbdb] to-[#FFD1D1] py-12 px-4 sm:px-6 lg:px-8">
      {/* Modal para texto completo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold text-[#2C3E50] mb-4">{modalContent.title}</h3>
            <p className="text-gray-700 whitespace-pre-wrap break-words">{modalContent.content}</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#2C3E50] drop-shadow-sm">Perfil del Negocio</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Tarjeta del Negocio */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#2C3E50] to-[#3498DB] rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
                  <BuildingOfficeIcon className="h-12 w-12 text-black" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-[#2C3E50] break-words">{proveedor.nombre_empresa}</h3>
                  <p className="text-[#7F8C8D] text-base md:text-lg mt-1">{proveedor.tipo_servicio}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#2C3E50]/10 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-[#2C3E50]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">Dirección</p>
                        <p 
                          className="font-medium text-[#2C3E50] truncate cursor-pointer hover:text-[#3498DB] transition-colors"
                          onClick={() => handleTextClick('Dirección', proveedor.direccion)}
                        >
                          {proveedor.direccion}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#2C3E50]/10 rounded-lg">
                        <LinkIcon className="h-5 w-5 text-[#2C3E50]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">Email</p>
                        <p 
                          className="font-medium text-[#2C3E50] truncate cursor-pointer hover:text-[#3498DB] transition-colors"
                          onClick={() => handleTextClick('Email', proveedor.email_empresa)}
                        >
                          {proveedor.email_empresa}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#2C3E50]/10 rounded-lg">
                        <ClockIcon className="h-5 w-5 text-[#2C3E50]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p 
                          className="font-medium text-[#2C3E50] truncate cursor-pointer hover:text-[#3498DB] transition-colors"
                          onClick={() => handleTextClick('Teléfono', proveedor.telefono_empresa)}
                        >
                          {proveedor.telefono_empresa}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#2C3E50]/10 rounded-lg">
                        <ClockIcon className="h-5 w-5 text-[#2C3E50]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500">Fecha de creación</p>
                        <p className="font-medium text-[#2C3E50] truncate">
                          {proveedor.fecha_creacion ? new Date(proveedor.fecha_creacion).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-6 rounded-xl shadow-sm">
                  <h4 className="text-lg font-semibold text-[#2C3E50] mb-3 text-center">Descripción</h4>
                  <p 
                    className="text-gray-700 leading-relaxed break-words cursor-pointer hover:text-[#3498DB] transition-colors text-justify"
                    onClick={() => handleTextClick('Descripción', proveedor.descripcion)}
                  >
                    {proveedor.descripcion}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#2C3E50]/10 rounded-lg">
                      <LinkIcon className="h-5 w-5 text-[#2C3E50]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500">Redes sociales</p>
                      <p 
                        className="font-medium text-[#2C3E50] truncate cursor-pointer hover:text-[#3498DB] transition-colors"
                        onClick={() => handleTextClick('Redes sociales', proveedor.redes_sociales)}
                      >
                        {proveedor.redes_sociales}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Datos Personales */}
          <div className="space-y-8">
            {persona && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#2C3E50] to-[#3498DB] rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
                      <UserCircleIcon className="h-12 w-12 text-black" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl md:text-2xl font-bold text-[#2C3E50]">Datos Personales</h3>
                      <p className="text-[#7F8C8D] text-base md:text-lg mt-1 break-words">{persona.nombre} {persona.apellido}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#2C3E50]/10 rounded-lg">
                          <MapPinIcon className="h-5 w-5 text-[#2C3E50]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-500">Cédula</p>
                          <p 
                            className="font-medium text-[#2C3E50] truncate cursor-pointer hover:text-[#3498DB] transition-colors"
                            onClick={() => handleTextClick('Cédula', persona.cedula)}
                          >
                            {persona.cedula}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#2C3E50]/10 rounded-lg">
                          <LinkIcon className="h-5 w-5 text-[#2C3E50]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-500">Email</p>
                          <p 
                            className="font-medium text-[#2C3E50] truncate cursor-pointer hover:text-[#3498DB] transition-colors"
                            onClick={() => handleTextClick('Email', persona.email)}
                          >
                            {persona.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#2C3E50]/10 rounded-lg">
                          <ClockIcon className="h-5 w-5 text-[#2C3E50]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-500">Teléfono</p>
                          <p 
                            className="font-medium text-[#2C3E50] truncate cursor-pointer hover:text-[#3498DB] transition-colors"
                            onClick={() => handleTextClick('Teléfono', persona.telefono)}
                          >
                            {persona.telefono}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formulario de Cambio de Contraseña */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
              <div className="p-6 md:p-8">
              <button
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-black rounded-xl hover:from-[#3498DB] hover:to-[#2C3E50] transition-all duration-300 font-semibold mb-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                <LockClosedIcon className="h-5 w-5" />
                {showPasswordForm ? 'Cancelar' : 'Cambiar Contraseña'}
              </button>

              {/* Mensaje de éxito o error SIEMPRE visible si existe */}
              {passwordMsg && (
                <div className={`mt-4 p-4 rounded-xl text-center font-medium flex items-center justify-center gap-2 ${passwordMsg.toLowerCase().includes('correctamente') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {passwordMsg.toLowerCase().includes('correctamente') ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  {passwordMsg}
                </div>
              )}

              {showPasswordForm && (
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-4 rounded-xl shadow-sm">
                      <label className="block text-sm font-medium text-[#2C3E50] mb-2">Contraseña actual</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border-2 border-[#E0E0E0] rounded-lg focus:border-[#3498DB] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                    <div className="bg-gradient-to-br from-white to-[#F8F9FA] p-4 rounded-xl shadow-sm">
                      <label className="block text-sm font-medium text-[#2C3E50] mb-2">Nueva contraseña</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border-2 border-[#E0E0E0] rounded-lg focus:border-[#3498DB] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                      className="w-full px-6 py-4 bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white rounded-xl hover:from-[#3498DB] hover:to-[#2C3E50] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Guardar nueva contraseña
                  </button>
                </form>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 