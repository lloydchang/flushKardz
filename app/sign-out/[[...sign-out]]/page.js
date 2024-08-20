// flushKardz/app/sign-in/[[...sign-in]]/page.js

/* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the AGPLv3 license.
 *
 * You should have received a copy of the AGPLv3 license with
 * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography
} from '@mui/material';
import { SignIn, useClerk, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Add event listener for orientation changes
    window.addEventListener('resize', handleOrientationChange);
    handleOrientationChange(); // Check initial orientation

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      // User is signed in, sign them out and redirect
      signOut().then(() => {
        // Preserve the intended redirect URL
        const redirectTo = new URLSearchParams(window.location.search).get('redirectTo') || '/';
        router.push(redirectTo);
      });
    }
  }, [isLoaded, user, signOut, router]);

  if (!isLoaded || user) {
    // Render nothing or a loading state while checking authentication status
    return null;
  }

  return (
    <>
      <AppBar 
        position="absolute" 
        sx={{ 
          backgroundColor: 'transparent', 
          boxShadow: 'none', 
          backdropFilter: 'none', 
          zIndex: 1201, 
          width: '100%',
        }}
      >
        <Toolbar sx={{ width: '100%', justifyContent: 'center', position: 'relative' }}>
          <Button
            component={Link}
            href={`/play?redirectTo=${encodeURIComponent('/play')}`} // Pass the redirect URL as a query parameter
            sx={{ 
              background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
              borderRadius: 50, 
              px: 4, 
              py: 2, 
              fontSize: '1.5rem', 
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              transition: '0.3s',
              '&:hover': {
                background: 'linear-gradient(45deg, #0072ff, #00c6ff)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              },
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1200,
            }}
          >
            Play
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(signed-in.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          overflow: 'hidden',
        }}
      >
        <Container 
          maxWidth="sm" 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%', 
            p: 2, 
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box sx={{ flexGrow: 1 }} /> {/* Pushes SignIn component to the bottom */}
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 2, // Adds margin-bottom if needed
          }}>
            <SignIn />
          </Box>
        </Container>
      </Box>

      <Box 
        sx={{ 
          width: '100%', 
          position: 'absolute', 
          bottom: 0, 
          textAlign: 'center', 
          py: 1, 
          backgroundColor: 'rgba(0, 0, 0, 0)',
          color: 'white',
          fontSize: '0.75rem',
        }}
      >
      <Link
        href="https://github.com/lloydchang/flushKardz/blob/main/public/flushKardz.vercel.app%20%C2%A9%202024%20Lloyd%20Chang.pdf"
        target="_blank" // Opens the link in a new tab
        rel="noopener noreferrer" // Adds security by preventing the new page from accessing the window object
        underline="none" // Removes the underline from the link (optional)
      >
        <Typography>© 2024 Lloyd Chang</Typography>
      </Link>
      </Box>
    </>
  );
}
