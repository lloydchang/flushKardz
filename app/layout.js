// app/layout.js
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { CSPostHogProvider } from './providers'

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
