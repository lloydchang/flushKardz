// flushKardz/utils/get-stripe.js

/* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the AGPLv3 license.
 *
 * You should have received a copy of the AGPLv3 license with
 * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
 */

import { loadStripe } from '@stripe/stripe-js';

// Initialize a cache for the Stripe instance
let stripePromise;

/**
 * Get the Stripe instance. This function ensures that the Stripe object is only
 * created once and reused in subsequent calls.
 * 
 * @returns {Promise<Stripe | null>} The Stripe instance.
 */
const getStripe = () => {
  // If the Stripe instance has not been created yet, create it
  if (!stripePromise) {
    // Load Stripe using the public key from environment variables
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  // Return the cached Stripe instance
  return stripePromise;
};

export default getStripe;
