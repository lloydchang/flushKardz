// flushKardz/page.js

'use client';

import React, { useEffect } from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import '../styles/globals.css';
import getStripe from '../utils/get-stripe';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  
  // Capture redirectTo parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const redirectTo = queryParams.get('redirectTo') || '/';
    
    // Redirect to the specified URL if available and not the current page
    if (redirectTo && redirectTo !== '/') {
      router.push(redirectTo);
    }
  }, [router]);

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
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
            onClick={handleSubmit}
            sx={{ 
              ...buttonStyle,
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
            href={isSignedIn ? "/sign-out" : "/sign-in"} // Link to sign-out or sign-in page based on user status
            color="inherit"
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
              right: '25%',
              transform: 'translateX(50%)',
              zIndex: 1200,
            }}
          >
            {isSignedIn ? 'Sign-Out Twitch' : 'Sign-In Twitch'} {/* Display text based on user status */}
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
            p: 4,
            position: 'relative',
          }}
        >
          <Box 
            sx={{
              textAlign: 'center',
              width: '100%',
              maxWidth: '500px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: 2,
              p: 4,
              position: 'relative',
              marginTop: '15%',
            }}
          >
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom 
              sx={{ color: 'white', animation: 'flash 2s infinite' }}  // Apply animation here
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
        <Typography>© 2024 Lloyd Chang</Typography>
      </Box>
    </>
  );
}
