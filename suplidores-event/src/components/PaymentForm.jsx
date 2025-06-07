import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from '../ProgressBar';

const PaymentForm = ({ amount, planName }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      const paymentData = {
        paymentMethodId: paymentMethod.id,
        amount: amount,
        planName: planName,
        personaId: location.state?.id_persona
      };

      if (!paymentData.personaId) {
        setError('No se encontró el ID de persona necesario para el pago.');
        setProcessing(false);
        console.error('Error: personaId no encontrado en location state para el pago.', location.state);
        return;
      }

      const response = await fetch('https://spectacular-recreation-production.up.railway.app/api/pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
        credentials: 'include'
      });

      const result = await response.json();

      if (result.success) {
        navigate('/confirmacion', { 
          state: { 
            success: true, 
            planName: planName,
            amount: amount,
            id_persona: location.state?.id_persona
          }
        });
      } else {
        setError(result.error || 'Error al procesar el pago');
      }
    } catch (err) {
      setError('Error al procesar el pago. Por favor, intente nuevamente.');
    }

    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <ProgressBar currentStep={3} />
        
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Pago del Plan {planName}</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Plan seleccionado:</span>
              <span className="font-semibold">{planName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monto total:</span>
              <span className="text-xl font-bold">${amount.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detalles de la tarjeta
              </label>
              <div className="p-3 border border-gray-300 rounded-md">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!stripe || processing}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                processing || !stripe
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {processing ? 'Procesando...' : `Pagar $${amount.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 