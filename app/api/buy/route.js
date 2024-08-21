// flushKardz/app/api/buy/route.js

/* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the AGPLv3 license.
 *
 * You should have received a copy of the AGPLv3 license with
 * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
 */

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
    // Log the referer header for debugging
    const referer = req.headers.get('referer') || 'http://localhost:3000';
    console.log('Referer URL:', referer);

    // Log the request method and headers
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);

    const params = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'flushKardz.vercel.app',
              images: ['https://flushkardz.vercel.app/flushKardz.jpg'], // Added product image URL
            },
            unit_amount: formatAmountForStripe(0, 'usd'),
            recurring: {
              interval: 'year',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${referer}?redirectTo=/success`,
      cancel_url: `${referer}?redirectTo=/cancel`,
    };

    // Log params before creating checkout session
    console.log('Checkout Session Params:', params);

    // Create a checkout session with Stripe
    const checkoutSession = await stripe.checkout.sessions.create(params);

    // Log the checkout session details
    console.log('Checkout Session Created:', checkoutSession);

    // Return the session ID as a JSON response
    return NextResponse.json(checkoutSession, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    // Handle specific Stripe error types
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: { message: 'Invalid request parameters' } },
        { status: 400 }
      );
    } else if (error.type === 'StripeConnectionError') {
      return NextResponse.json(
        { error: { message: 'Unable to connect to Stripe' } },
        { status: 500 }
      );
    } else if (error.response && error.response.data) {
      // Handle unexpected responses
      return NextResponse.json(
        { error: { message: 'Unexpected response from Stripe' } },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: { message: 'An unexpected error occurred' } },
        { status: 500 }
      );
    }
  }
}

export async function GET(req) {
  try {
    // Log the query parameters for debugging
    console.log('Query Params:', req.nextUrl.searchParams.toString());

    // Retrieve the session ID from the query parameters
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Log the retrieved checkout session details
    console.log('Checkout Session Retrieved:', checkoutSession);

    // Return the checkout session details as a JSON response
    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);

    // Handle specific Stripe error types
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: { message: 'Invalid request parameters' } },
        { status: 400 }
      );
    } else if (error.type === 'StripeConnectionError') {
      return NextResponse.json(
        { error: { message: 'Unable to connect to Stripe' } },
        { status: 500 }
      );
    } else if (error.response && error.response.data) {
      // Handle unexpected responses
      return NextResponse.json(
        { error: { message: 'Unexpected response from Stripe' } },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: { message: 'An unexpected error occurred' } },
        { status: 500 }
      );
    }
  }
}
