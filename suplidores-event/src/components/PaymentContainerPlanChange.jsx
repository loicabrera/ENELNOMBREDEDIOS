import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import PaymentFormPlanChange from './PaymentFormPlanChange';
import { STRIPE_PUBLIC_KEY } from '../config/stripe';
import { useAuth } from '../context/AuthContext';

// Inicializar Stripe
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PaymentContainerPlanChange = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
        console.log('PaymentContainerPlanChange useEffect: authLoading es true, esperando...');
        return;
    }
    console.log('PaymentContainerPlanChange useEffect: authLoading es false.');

    if (!isAuthenticated || !user || !user.provedorId || !user.personaId) {
      console.log('Usuario no autenticado o sin datos esenciales, redirigiendo a login.');
      navigate('/login');
      return;
    }
    console.log('Usuario autenticado en PaymentContainerPlanChange.', user);

    const pendingPlanChangeData = location.state;
    console.log('Datos de cambio de plan del state:', pendingPlanChangeData);

    if (!pendingPlanChangeData || !pendingPlanChangeData.amount || !pendingPlanChangeData.newPlanId || !pendingPlanChangeData.proveedorId) {
      console.log('No se encontraron datos válidos para el cambio de plan en el state, redirigiendo a membresía.');
      navigate('/dashboard-proveedor/membresia');
      return;
    }
    console.log('Datos de cambio de plan válidos encontrados.');

    try {
      setPaymentData(pendingPlanChangeData);
      console.log('Payment data set.', pendingPlanChangeData);
    } catch (error) {
      console.error('Error al procesar datos de pago del state:', error);
      navigate('/dashboard-proveedor/membresia');
    } finally {
      setLoading(false);
      console.log('Loading set to false.');
    }
  }, [navigate, location.state, isAuthenticated, user, authLoading]);

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