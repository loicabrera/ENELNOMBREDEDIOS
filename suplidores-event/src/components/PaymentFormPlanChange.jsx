import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const PaymentFormPlanChange = ({ amount, planName, currentPlanId, newPlanId, proveedorId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('El sistema de pago no está disponible. Por favor, intente nuevamente.');
      setLoading(false);
      return;
    }

    try {
      // Verificar que el servidor esté disponible
      try {
        const serverCheck = await fetch('http://localhost:3000');
        if (!serverCheck.ok) {
          throw new Error('El servidor no está respondiendo correctamente');
        }
      } catch (error) {
        throw new Error('No se puede conectar con el servidor. Por favor, verifique que el servidor esté en ejecución.');
      }

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el intent de pago');
      }

      const { clientSecret } = await response.json();

      // Confirmar el pago con Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Obtener el ID de persona desde localStorage
        const personaId = localStorage.getItem('PERSONA_id_persona');
        const pendingPlanChange = JSON.parse(localStorage.getItem('pending_plan_change'));

        if (!personaId || !pendingPlanChange) {
          throw new Error('No se encontró la información necesaria del usuario. Por favor, inicie sesión nuevamente.');
        }

        // Preparar los datos para el pago
        const paymentData = {
          monto: pendingPlanChange.amount,
          fecha_pago: new Date().toISOString(),
          monto_pago: pendingPlanChange.amount,
          newPlanId: pendingPlanChange.newPlanId,
          proveedorId: pendingPlanChange.proveedorId
        };

        console.log('Enviando datos de pago:', paymentData);

        // Llamar al backend para registrar el pago y actualizar el plan
        const pagoResponse = await fetch('http://localhost:3000/registrar_pago_cambio_plan', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(paymentData)
        });

        if (!pagoResponse.ok) {
          const errorData = await pagoResponse.json();
          throw new Error(errorData.error || 'Error al procesar el pago');
        }

        const pagoData = await pagoResponse.json();

        if (pagoData.success) {
          setPaymentSuccess(true);
          // Limpiar los datos del localStorage
          localStorage.removeItem('pending_plan_change');
          // Esperar un momento antes de redirigir para mostrar el mensaje de éxito
          setTimeout(() => {
            window.location.href = '/dashboard-proveedor/membresia';
          }, 2000);
        } else {
          throw new Error(pagoData.error || 'Error al actualizar el plan. Por favor, contacte al soporte.');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al procesar el pago. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Pago de diferencia - Plan {planName}</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {paymentSuccess ? (
            <div className="text-center">
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
                <p className="text-lg font-semibold">¡Pago realizado con éxito!</p>
                <p className="mt-2">Tu plan ha sido actualizado correctamente.</p>
              </div>
              <p className="text-gray-600">Redirigiendo al dashboard...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Plan seleccionado:</span>
                  <span className="font-semibold">{planName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Diferencia a pagar:</span>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentFormPlanChange; 