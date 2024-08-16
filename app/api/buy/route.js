// flushKardz/app/api/checkout_sessions.js

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Function to format the amount for Stripe (Stripe uses cents)
const formatAmountForStripe = (amount, currency) => {
  return Math.round(amount * 100); // Convert dollars to cents
};

export async function POST(req) {
  try {
    // Retrieve the referer URL to construct success and cancel URLs
    const referer = req.headers.get('referer') || 'http://localhost:3000';

    const params = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'flushKardz.vercel.app',
            },
            unit_amount: formatAmountForStripe(9.99, 'usd'),
            recurring: {
              interval: 'day',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${referer}result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${referer}result?session_id={CHECKOUT_SESSION_ID}`,
    };

    // Create a checkout session with Stripe
    const checkoutSession = await stripe.checkout.sessions.create(params);

    // Return the session ID as a JSON response
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse(
      JSON.stringify({ error: { message: error.message } }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Retrieve the session ID from the query parameters
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Return the checkout session details as a JSON response
    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
