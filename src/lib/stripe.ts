import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('A variável de ambiente STRIPE_SECRET_KEY não está definida.');
}

export const stripe = new Stripe(stripeSecretKey, {
apiVersion: '2023-10-16',
appInfo: {
    name: "Ingnite Shop Isra"
}
}) 
