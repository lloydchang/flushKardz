// flushKardz/page.js

/* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the AGPLv3 license.
 *
 * You should have received a copy of the AGPLv3 license with
 * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import getStripe from '../utils/get-stripe';
import '../styles/globals.css';

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    // Check if the window is in landscape mode
    const handleOrientationChange = () => {
      const isCurrentlyLandscape = window.matchMedia('(orientation: landscape)').matches;
      setIsLandscape(isCurrentlyLandscape);
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);

    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = new URLSearchParams(window.location.search);
      const redirectTo = queryParams.get('redirectTo') || '/';

      if (redirectTo && redirectTo !== '/') {
        router.push(redirectTo);
      }
    }
  }, [router]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const checkoutSessionJson = await response.json();

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error('Error during checkout process:', error);
    }
  };

  const buttonStyle = {
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
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!isLandscape && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            textAlign: 'center',
            padding: '1rem',
          }}
        >
          <Typography variant="h6">
            Please rotate your device to landscape mode for the best experience.
          </Typography>
        </Box>
      )}

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
            onClick={handleSubmit}
            sx={{ 
              ...buttonStyle,
              fontSize: '1rem', 
              px: 2, 
              py: 1,
              position: 'absolute',
              top: 16,
              left: '25%',
              transform: 'translateX(-50%)',
              zIndex: 1200,
            }}
          >
            Buy-In Stripe
          </Button>
          <Button
            component={Link}
            href="/play"
            sx={{ 
              ...buttonStyle,
              fontSize: '1rem', 
              px: 2, 
              py: 1,
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1200,
            }}
          >
            Play
          </Button>
          <Button
            component={Link}
            href={isSignedIn ? "/sign-out" : "/sign-in"}
            color="inherit"
            sx={{ 
              ...buttonStyle,
              fontSize: '1rem', 
              px: 2, 
              py: 1,
              position: 'absolute',
              top: 16,
              right: '25%',
              transform: 'translateX(50%)',
              zIndex: 1200,
            }}
          >
            {isSignedIn ? 'Sign-Out Twitch' : 'Sign-In Twitch'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(home.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
        }}
      >
        <Container 
          maxWidth="md"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 2,
            position: 'relative',
          }}
        >
          <Box 
            sx={{
              textAlign: 'center',
              width: '100%',
              maxWidth: '90%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: 2,
              p: 2,
              position: 'relative',
              marginTop: '15%',
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ color: 'white', animation: 'flash 2s infinite' }}
            >
              flushKardz
            </Typography>
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
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
        >
          <Typography>© 2024 Lloyd Chang</Typography>
        </Link>
      </Box>
    </>
  );
}
