import Stripe from "stripe";

// create new cliet for stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
  typescript: true,
});

//create session
export const getStripeSession = async ({
  priceId,
  domainUrl,
  customerId,
}: {
  priceId: string;
  domainUrl: string;
  customerId: string;
}) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [{ price: priceId, quantity: 1 }],
    payment_method_types: ["card"],
    customer_update: {
      address: "auto",
      name: "auto",
    },
    success_url: `${domainUrl}/payment/success`,
    cancel_url: `${domainUrl}/payment/cancelled`,
  });

  return session.url as string;
};
