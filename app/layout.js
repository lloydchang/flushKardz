// app/layout.js
import { ClerkProvider, RedirectToSignIn } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';
import PostHogInitializer from './PostHogInitializer'; // Import the client component

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <PostHogInitializer /> {/* Initialize PostHog */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

export const metadata = {
  title: 'flushKardz',
  description: 'flushKardz',
};
