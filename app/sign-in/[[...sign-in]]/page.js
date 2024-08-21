// flushKardz/app/sign-out/[[...sign-in]]/page.js

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

  // Determine if the user is signed in
  const isSignedIn = isLoaded && user;

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

  const handleSubmit = () => {
    // Define what should happen when the button is clicked
    console.log('Buy-In Stripe button clicked');
    // You can perform additional actions here, such as redirecting or making API calls
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
          {/* <Button
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
          </Button> */}
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
          position: 'relative',
          filter: 'saturate(50%)', // Reducing the saturation of the background image
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adding the semi-transparent overlay
            zIndex: 1,
            animation: 'pulseOverlay 1s infinite',
          },
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            alignItems: 'center',   
            justifyContent: 'center',   
            minHeight: '100vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',            
            height: '100%',
            p: 20,
            position: 'relative',
            '&::-webkit-scrollbar': { display: 'none' }, // Hiding the scrollbar
            zIndex: 2, // Ensuring content is above the overlay
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
      <style jsx global>{`
        @keyframes pulseOverlay {
          0% {
            background-color: rgba(0, 0, 0, 0.5);
          }
          50% {
            background-color: rgba(0, 0, 0, 0.2);
          }
          100% {
            background-color: rgba(0, 0, 0, 0.5);
          }
        }
      `}</style>
    </>
  );
}
