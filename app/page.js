'use client';

import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button, Grid } from '@mui/material'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import '../styles/globals.css'
import getStripe from '../utils/get-stripe'

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}
          >
            flushKardz
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="md"
        sx={{
          backgroundImage: 'url(flushKardz.jpg)', // Ensure the path is correct
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          p: 4,
          border: '1px solid red', // Debugging border to ensure container is visible
        }}
      >
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            <span className="flash">flushKardz</span>
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="/hit_me_with_flushKardz">
            Go
          </Button>
        </Box>

        <Box sx={{ my: 6, textAlign: 'center' }}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Buy-In
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}
