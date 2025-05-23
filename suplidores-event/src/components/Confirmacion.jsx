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

    // Obtener el ID de la persona del localStorage
    const personaId = localStorage.getItem('id_persona');
    if (!personaId) {
      setError('No se encontró el ID de la persona');
      setLoading(false);
      return;
    }

    // Generar credenciales
    const generarCredenciales = async () => {
      try {
        const response = await fetch('http://localhost:3000/generar_credenciales', {
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
  }, [success, navigate, credenciales]);

  if (!success) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <ProgressBar currentStep={4} />
        
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto mt-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">¡Registro Completado!</h2>
            <p className="text-gray-600 mb-6">
              Gracias por registrarte como proveedor. Tu pago ha sido procesado correctamente.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Detalles del pago:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto pagado:</span>
                  <span className="font-medium">${amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            ) : credentials ? (
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4">Tus credenciales de acceso:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuario:</span>
                    <span className="font-medium">{credentials.user_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contraseña:</span>
                    <span className="font-medium">{credentials.password}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-blue-600">
                  Por favor, guarda estas credenciales en un lugar seguro. Las necesitarás para iniciar sesión.
                </p>
              </div>
            ) : null}

            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
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