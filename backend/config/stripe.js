import Stripe from 'stripe';

// Inicializar Stripe con tu clave secreta
const stripe = new Stripe('sk_test_51RPQBGH99ZRyC1yofIHLx7g4x9qQV9fPoRNC8bAlxM2kIrUSKvDO5lcuHPINVUQ1PrknbXMbgcZ1CB6aWjYunOIC00PhriOz2t', {
  apiVersion: '2023-10-16', // Usa la versión más reciente de la API
});

export default stripe; 