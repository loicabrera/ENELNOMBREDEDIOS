import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const PaymentFormNuevoNegocio = ({ amount, planName, isNewBusiness, businessName, proveedorId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      const response = await fetch('http://localhost:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: amount,
          planName: planName,
          proveedorId: proveedorId,
          businessName: businessName
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setSucceeded(true);
        navigate('/confirmacion-nuevo-negocio', {
          state: {
            businessName: businessName,
            planName: planName,
            amount: amount,
            success: true
          }
        });
      }
    } catch (err) {
      setError('Error al procesar el pago. Por favor, intente nuevamente.');
    }

    setProcessing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-12 w-full max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold text-[#012e33] mb-8 text-center">Pago para Nuevo Negocio</h2>
      
      <div className="mb-8">
        <div className="bg-gray-50 p-8 rounded-xl mb-6 border border-gray-200">
          <h3 className="text-2xl font-semibold text-[#012e33] mb-6">Detalles del Pago</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-lg font-semibold text-gray-600">Negocio</p>
              <p className="text-xl mt-2">{businessName}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-lg font-semibold text-gray-600">Plan</p>
              <p className="text-xl mt-2">{planName}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-lg font-semibold text-gray-600">Monto</p>
              <p className="text-xl mt-2">${amount}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-2xl font-medium text-gray-700 mb-4">
            Detalles de la Tarjeta
          </label>
          <div className="border-2 border-gray-300 rounded-xl p-8 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '20px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    padding: '12px',
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
          <div className="text-red-600 text-xl bg-red-50 p-6 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing || succeeded}
          className={`w-full py-5 px-8 rounded-xl text-white text-2xl font-semibold ${
            processing || succeeded
              ? 'bg-gray-400'
              : 'bg-[#012e33] hover:bg-[#fbaccb] hover:text-[#012e33]'
          } transition-colors duration-300 shadow-lg hover:shadow-xl`}
        >
          {processing ? 'Procesando...' : 'Pagar Ahora'}
        </button>
      </form>
    </div>
  );
};

export default PaymentFormNuevoNegocio; 