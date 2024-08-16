// flushKardz/providers.js

/* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the AGPLv3 license.
 *
 * You should have received a copy of the AGPLv3 license with
 * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
 */

'use client'
import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const initializePostHog = () => {
  if (typeof window !== 'undefined') {
    try {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: 'always',
      })
      console.log('PostHog initialized successfully.')
    } catch (error) {
      console.error('PostHog initialization failed:', error)
    }
  }
}

export function CSPostHogProvider({ children }) {
  useEffect(() => {
    initializePostHog()
  }, [])
  
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
