// flushKardz/global.css

/* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the AGPLv3 license.
 *
 * You should have received a copy of the AGPLv3 license with
 * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
 */

import { ClerkProvider } from '@clerk/nextjs';
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
