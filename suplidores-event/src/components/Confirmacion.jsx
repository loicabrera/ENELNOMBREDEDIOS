import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar';

const Confirmacion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, planName, amount, credenciales } = location.state || {};
  const [credentials, setCredentials] = useState(credenciales || null);
  const [loading, setLoading] = useState(!credenciales);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!success) {
      navigate('/');
      return;
    }

    // Si ya tenemos credenciales en location.state, no hace falta generarlas
    if (credenciales) {
      setLoading(false);
      return;
    }

    // Obtener el ID de la persona del estado de navegación en lugar de localStorage
    const personaId = location.state?.id_persona; // Obtener del estado de navegación

    if (!personaId) {
      setError('No se encontró el ID de la persona en el estado de navegación.');
      setLoading(false);
      return;
    }

    // Generar credenciales
    const generarCredenciales = async () => {
      try {
        const response = await fetch('https://spectacular-recreation-production.up.railway.app/generar_credenciales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_persona: personaId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al generar credenciales');
        }

        setCredentials(data.credentials);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    generarCredenciales();
  }, [success, navigate, credenciales, location.state?.id_persona]); // Agregar dependencia de id_persona en location.state

  if (!success) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f3e8ff] to-[#e0e7ff] flex flex-col justify-center items-center py-12">
      {/* Contenedor principal */}
      <div className="max-w-4xl mx-auto w-full px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-[#cbb4db]" style={{ boxShadow: '0 8px 32px 0 rgba(203, 180, 219, 0.2)' }}>
          <div className="p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              {/* Ícono de confirmación o logo */}
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-md text-white text-center" style={{ background: '#ff6b6b' }}>
                {error}
              </div>
            )}

            <h2 className="text-3xl font-bold text-center text-[#012e33] mb-4">¡Confirmación Exitosa!</h2>
            <p className="text-center text-gray-600 mb-8">Tu registro y pago del plan <span className="font-semibold">{planName}</span> han sido procesados.</p>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : credentials ? (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-[#cbb4db]">
                <h3 className="text-xl font-semibold text-[#012e33] mb-4">Tus Credenciales de Acceso:</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm">Usuario:</p>
                    <p className="font-mono text-[#012e33] text-lg select-text break-all">{credentials.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Contraseña:</p>
                    <p className="font-mono text-[#012e33] text-lg select-text break-all">{credentials.password}</p>
                  </div>
                  {credentials.email && (
                    <div>
                      <p className="text-gray-600 text-sm">Email:</p>
                      <p className="font-mono text-[#012e33] text-lg select-text break-all">{credentials.email}</p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-4">Guarda esta información en un lugar seguro. La necesitarás para iniciar sesión.</p>
              </div>
            ) : ( !error &&
              <div className="mb-6 p-4 rounded-md text-center" style={{ background: '#ffecb3', color: '#663c00' }}>
                 <p>Credenciales no disponibles. Por favor, contacta al soporte o intenta iniciar sesión directamente con el usuario y contraseña que usaste para registrarte (si aplica).</p>
              </div>
            )}

            {/* Botón Ir a iniciar sesión (ya no limpia localStorage) */}
            <div className="mt-6">
              <button
                onClick={() => {
                  // Eliminamos la limpieza de localStorage aquí
                  // localStorage.removeItem('user');
                  // localStorage.removeItem('negocio_activo');
                  // localStorage.removeItem('provedor_negocio_id_provedor');
                  // localStorage.removeItem('MEMBRESIA_id_membresia');
                  // localStorage.removeItem('PERSONA_id_persona');
                  // Puedes agregar más claves si tu app guarda otras de sesión
                  navigate('/login');
                }}
                className="w-full py-3 px-4 rounded-xl font-semibold transition duration-300 text-[#012e33] shadow-lg bg-[#cbb4db] hover:bg-[#fbaccb] hover:scale-[1.02] active:scale-100"
              >
                Ir a iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmacion; 