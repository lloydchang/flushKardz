// app/PostHogInitializer.js
'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

const PostHogInitializer = () => {
  useEffect(() => {
    posthog.init('YOUR_POSTHOG_API_KEY', { api_host: 'https://app.posthog.com' });

    // Optional: Track a page view or user event here if needed
    posthog.capture('Page View');

    // Clean up PostHog on component unmount
    return () => {
      // If no shutdown method is available, you can skip this clean-up or perform alternative cleanup
    };
  }, []);

  return null;
};

export default PostHogInitializer;
