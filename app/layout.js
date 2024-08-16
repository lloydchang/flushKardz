// app/layout.js
import "posthog-js/dist/recorder"
import "posthog-js/dist/surveys"
import "posthog-js/dist/exception-autocapture"
import "posthog-js/dist/tracing-headers"
import "posthog-js/dist/web-vitals"
import posthog from 'posthog-js'

export const _frontmatter = {}
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { CSPostHogProvider } from './providers'

posthog.init('phc_xR2rBA2lMadIYDcFsWxJO8Ki9JUDBlXkbdFfuVDZ8Rl',
    {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'always' // or 'always' to create profiles for anonymous users as well
    }
)

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <CSPostHogProvider>
      <ClerkProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ClerkProvider>
    </CSPostHogProvider>
  )
}

export const metadata = {
  title: 'flushKardz',
  description: 'flushKardz',
}
