import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar';

const PaymentFormNuevoNegocio = ({ amount, planName }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Crear el PaymentIntent en el backend
      const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convertir a centavos
          planName,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirmar el pago con Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Obtener los IDs de proveedor, membresía y persona desde localStorage
        const proveedorId = localStorage.getItem('provedor_negocio_id_provedor');
        const membresiaId = localStorage.getItem('MEMBRESIA_id_membresia');
        const personaId = localStorage.getItem('PERSONA_id_persona');

        if (!proveedorId || !membresiaId || !personaId) {
          setError('No se encontró el ID de proveedor, membresía o persona.');
          setLoading(false);
          return;
        }

        // Llamar al backend para registrar el pago (sin credenciales)
        const pagoResponse = await fetch('http://localhost:3000/registrar_pago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monto: amount,
            fecha_pago: new Date().toISOString(),
            monto_pago: amount,
            MEMBRESIA_id_membresia: membresiaId,
            provedor_negocio_id_provedor: proveedorId,
            PERSONA_id_persona: personaId
          })
        });

        const pagoData = await pagoResponse.json();

        navigate('/confirmacion-nuevo-negocio', { 
          state: { 
            success: true,
            planName,
            amount
          }
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al procesar el pago. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
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
              disabled={!stripe || loading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : `Pagar $${amount.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentFormNuevoNegocio; 