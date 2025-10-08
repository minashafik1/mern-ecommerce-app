import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const payWithStripe = async (amount, email) => {
  // Stripe expects amount in cents
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    receipt_email: email,
    description: "Order payment",
  });
};