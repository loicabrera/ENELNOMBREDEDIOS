import Stripe from 'stripe';

// Inicializar Stripe con tu clave secreta
const stripe = new Stripe('sk_test_51RPQBGH99ZRyC1yoRCfAm3NKQihUFAAADqK7tv53D6VdiQtrfHgkrzyVbKB01Dhcm5Og9IedJgfH4qQDEo3Bn42W00HeV4UzIU', {
  apiVersion: '2023-10-16', // Usa la versión más reciente de la API
});

export default stripe; 