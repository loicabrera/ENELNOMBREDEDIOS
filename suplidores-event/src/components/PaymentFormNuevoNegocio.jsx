import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentFormNuevoNegocio = ({ amount, planName }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

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
        personaId: user.personaId,
        provedor_negocio_id_provedor: location.state?.proveedorId
      };

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
        navigate('/confirmacion-nuevo-negocio', { 
          state: { 
            success: true, 
            planName: planName,
            amount: amount
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Pago de Registro de Negocio</h2>
      
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Detalles del Pago</h3>
          <p>Plan: {planName}</p>
          <p>Monto: RD${amount}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Información de la Tarjeta
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            processing || !stripe
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {processing ? 'Procesando...' : 'Pagar RD$' + amount}
        </button>
      </div>
    </form>
  );
};

export default PaymentFormNuevoNegocio; 