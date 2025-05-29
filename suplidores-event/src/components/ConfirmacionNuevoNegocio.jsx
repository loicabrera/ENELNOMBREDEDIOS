import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar';

const ConfirmacionNuevoNegocio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, planName, amount } = location.state || {};

  if (!success) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] via-[#f3e8ff] to-[#e0e7ff]">
      <div className="flex-1 flex flex-col justify-center py-12">
        <div className="max-w-5xl mx-auto w-full">
          <ProgressBar currentStep={4} />
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl mx-auto mt-12 mb-12 flex flex-col justify-center items-center">
            <div className="text-center w-full">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">¡Pago Completado!</h2>
              <p className="text-gray-600 mb-6">
                El pago de tu nuevo negocio ha sido procesado correctamente.
              </p>

              <div className="bg-[#fbcbdb] rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-4 text-[#012e33]">Detalles del pago:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#012e33]">Plan:</span>
                    <span className="font-medium">{planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#012e33]">Monto pagado:</span>
                    <span className="font-medium">${amount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate('/dashboard-proveedor')}
                  className="w-full py-3 px-4 rounded-xl font-semibold transition duration-300 text-[#012e33] shadow-lg bg-[#cbb4db] hover:bg-[#fbaccb] hover:scale-[1.02] active:scale-100"
                >
                  Ir a mi panel de negocios
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionNuevoNegocio; 