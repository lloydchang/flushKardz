// flushKardz/app/sign-in/[[...sign-in]]/page.js

'use client';

import React from 'react'
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography
} from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignInPage() {
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
            href="/play"
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
        <Typography>© 2024 Lloyd Chang</Typography>
      </Box>
    </>
  )
}
