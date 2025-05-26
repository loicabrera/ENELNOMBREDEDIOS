import React, { useEffect, useState } from 'react';
import { 
  PhotoIcon, 
  MapPinIcon, 
  ClockIcon, 
  LinkIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const [proveedor, setProveedor] = useState(null);
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [membresia, setMembresia] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

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
              // Fetch membresía activa
              fetch(`http://localhost:3000/membresia/${proveedorLogueado.id_provedor}`)
                .then(res => res.json())
                .then(membresiaData => {
                  setMembresia(membresiaData);
                  setLoading(false);
                });
            });
        } else {
          setLoading(false);
        }
      });
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    const user_name = user.user_name; // Asegúrate de guardar el user_name en localStorage al hacer login
    const res = await fetch('http://localhost:3000/api/cambiar-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_name, oldPassword, newPassword })
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

  if (loading) return <div className="w-full min-h-screen flex justify-center items-center bg-[#fbcbdb]">Cargando...</div>;
  if (!proveedor) return <div className="w-full min-h-screen flex justify-center items-center bg-[#fbcbdb]">No se encontró tu perfil de proveedor.</div>;

  return (
    <div className="w-full min-h-screen bg-[#fbcbdb] py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-[#012e33]">Perfil del Negocio</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda: Negocio y Membresía */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-6">
                <div>
                  <p className="text-2xl font-semibold text-[#012e33]">{proveedor.nombre_empresa}</p>
                  <p className="text-[#9CAF88] text-lg">{proveedor.tipo_servicio}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <p className="text-[#012e33]"><strong>Email de la empresa:</strong> {proveedor.email_empresa}</p>
                <p className="text-[#012e33]"><strong>Teléfono de la empresa:</strong> {proveedor.telefono_empresa}</p>
                <p className="text-[#012e33]"><strong>Fecha de creación:</strong> {proveedor.fecha_creacion ? new Date(proveedor.fecha_creacion).toLocaleDateString() : ''}</p>
                <p className="text-[#012e33]"><strong>Dirección:</strong> {proveedor.direccion}</p>
                <p className="text-[#012e33]"><strong>Descripción:</strong> {proveedor.descripcion}</p>
                <p className="text-[#012e33]"><strong>Redes sociales:</strong> {proveedor.redes_sociales}</p>
              </div>
            </div>
            {membresia && (
              <div className="mb-6 p-6 bg-[#cbb4db] rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-[#012e33]">Membresía Actual</h3>
                <div className="space-y-2">
                  <p className="text-[#012e33]"><strong>Plan:</strong> {membresia.nombre_pla}</p>
                  <p className="text-[#012e33]"><strong>Estado:</strong> {membresia.estado}</p>
                  <p className="text-[#012e33]"><strong>Fecha de vencimiento:</strong> {membresia.fecha_fin ? new Date(membresia.fecha_fin).toLocaleDateString() : 'No disponible'}</p>
                  <p className="text-[#012e33]"><strong>Límite de productos:</strong> {membresia.limite_productos}</p>
                  <p className="text-[#012e33]"><strong>Límite de servicios:</strong> {membresia.limite_servicios}</p>
                  <p className="text-[#012e33]"><strong>Límite de fotos por producto/servicio:</strong> {membresia.limite_fotos}</p>
                </div>
              </div>
            )}
          </div>
          {/* Columna derecha: Datos personales y Cambio de contraseña */}
          <div className="flex-1">
            {persona && (
              <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <h3 className="text-2xl font-semibold mb-6 text-[#012e33]">Datos Personales</h3>
                <div className="space-y-3">
                  <p className="text-[#012e33]"><strong>Nombre:</strong> {persona.nombre}</p>
                  <p className="text-[#012e33]"><strong>Apellido:</strong> {persona.apellido}</p>
                  <p className="text-[#012e33]"><strong>Teléfono:</strong> {persona.telefono}</p>
                  <p className="text-[#012e33]"><strong>Email:</strong> {persona.email}</p>
                  <p className="text-[#012e33]"><strong>Cédula:</strong> {persona.cedula}</p>
                </div>
              </div>
            )}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <button
                className="w-full px-6 py-3 bg-[#012e33] text-black rounded-xl hover:bg-[#fbaccb] transition-colors duration-300 font-semibold mb-4 flex items-center justify-center gap-2"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                <LockClosedIcon className="h-5 w-5" />
                {showPasswordForm ? 'Cancelar' : 'Cambiar Contraseña'}
              </button>
              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#012e33] mb-2">Contraseña actual</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#fbcbdb] rounded-lg focus:border-[#012e33] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#012e33] mb-2">Nueva contraseña</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-[#fbcbdb] rounded-lg focus:border-[#012e33] focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-[#012e33] text-white rounded-xl hover:bg-[#fbaccb] transition-colors duration-300 font-semibold"
                  >
                    Guardar nueva contraseña
                  </button>
                  {passwordMsg && (
                    <div className="mt-4 text-sm text-center text-[#012e33] font-medium">{passwordMsg}</div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 