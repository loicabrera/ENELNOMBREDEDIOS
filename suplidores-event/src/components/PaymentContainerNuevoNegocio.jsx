import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';
import PaymentFormNuevoNegocio from './PaymentFormNuevoNegocio';
import { STRIPE_PUBLIC_KEY } from '../config/stripe';

// Inicializar Stripe
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PaymentContainerNuevoNegocio = () => {
  const location = useLocation();
  const { amount, planName, isNewBusiness } = location.state || {};

  if (!amount || !planName) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-red-600 text-center">Error</h2>
            <p className="text-center mt-4">No se encontró la información del plan. Por favor, complete el formulario de proveedor primero.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Elements stripe={stripePromise}>
          <PaymentFormNuevoNegocio amount={amount} planName={planName} isNewBusiness={isNewBusiness} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentContainerNuevoNegocio; 