import Stripe from 'stripe';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Inicializar Stripe con tu clave secreta desde variables de entorno
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Usa la versión más reciente de la API
});

export default stripe; 