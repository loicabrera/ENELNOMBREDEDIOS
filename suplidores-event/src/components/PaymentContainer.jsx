import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import { STRIPE_PUBLIC_KEY } from '../config/stripe';

// Inicializar Stripe
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PaymentContainer = ({ amount, planName }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Elements stripe={stripePromise}>
          <PaymentForm amount={amount} planName={planName} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentContainer; 