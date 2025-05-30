import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import PaymentFormPlanChange from './PaymentFormPlanChange';
import { STRIPE_PUBLIC_KEY } from '../config/stripe';

// Inicializar Stripe
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PaymentContainerPlanChange = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return;
    }

    const storedData = localStorage.getItem('pending_plan_change');
    if (!storedData) {
      navigate('/dashboard-proveedor/membresia');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setPaymentData(parsedData);
    } catch (error) {
      console.error('Error parsing payment data:', error);
      navigate('/dashboard-proveedor/membresia');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-red-600 text-center">Error</h2>
            <p className="text-center mt-4">No se encontró la información del plan. Por favor, seleccione un plan primero.</p>
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/dashboard-proveedor/membresia')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Volver a Membresía
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Elements stripe={stripePromise}>
          <PaymentFormPlanChange 
            amount={paymentData.amount} 
            planName={paymentData.planName}
            currentPlanId={paymentData.currentPlanId}
            newPlanId={paymentData.newPlanId}
            proveedorId={paymentData.proveedorId}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentContainerPlanChange; 