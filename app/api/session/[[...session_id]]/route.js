// flushKardz/app/api/session/[[...session_id]]/route.js

/* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the AGPLv3 license.
 *
 * You should have received a copy of the AGPLv3 license with
 * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    // Extract session_id from URL path parameters
    const { pathname } = new URL(req.url);
    const sessionId = pathname.split('/').pop(); // Get the last segment as session_id

    if (!sessionId || sessionId === 'route.js') {
      console.error('Invalid or missing session ID');
      return NextResponse.json({ error: 'Invalid or missing session ID' }, { status: 400 });
    }

    console.log('Fetching session data for session_id:', sessionId);

    // Log the request URL and headers
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Log the retrieved session details
    console.log('Fetched Session Data:', session);

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session data:', error);
    
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
