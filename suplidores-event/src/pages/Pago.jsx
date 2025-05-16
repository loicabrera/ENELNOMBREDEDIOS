import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Pago() {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, email } = location.state || {};
  const [loading, setLoading] = useState(false);

  const handlePagar = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:4242/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, email }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.url) {
      window.location.href = data.url; // Redirige a Stripe Checkout
    } else {
      alert("Error al crear la sesión de pago");
    }
  };

  if (!plan || !email) {
    return <div>Faltan datos para el pago.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Pago de membresía</h1>
      <p className="mb-2">Plan seleccionado: <strong>{plan}</strong></p>
      <p className="mb-6">Email: <strong>{email}</strong></p>
      <button
        onClick={handlePagar}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold"
        disabled={loading}
      >
        {loading ? "Redirigiendo a Stripe..." : "Pagar con tarjeta"}
      </button>
    </div>
  );
}