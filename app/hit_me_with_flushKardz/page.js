'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  AppBar,
  Toolbar,
} from '@mui/material'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { doc, collection, getDoc, writeBatch } from 'firebase/firestore'
import db from '../../firebase'

// Helper functions
const createDeck = () => {
  const suits = ['♠', '♦', '♣', '♥']
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  return suits.flatMap(suit => ranks.map(rank => ({ suit, rank })))
}

const shuffleDeck = (deck) => {
  let shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

const dealHand = (deck, numCards) => deck.splice(0, numCards)

const getCardColor = (suit) => {
  return ['♠', '♣'].includes(suit) ? 'black' : 'red'
}

export default function HitMeWithFlushKardz() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [text, setText] = useState('')
  const [houseHand, setHouseHand] = useState([])
  const [userHand, setUserHand] = useState([])
  const [flushKardz, setFlushKardz] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const deck = shuffleDeck(createDeck())
    setHouseHand(dealHand(deck, 5))
    setUserHand(dealHand(deck, 5))
  }, [])

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/hit_me_with_flushKardz', {
        method: 'POST',
        body: text,
      })

      if (!response.ok) throw new Error('Failed to hit me with flushKardz')

      const data = await response.json()
      setFlushKardz(data)
    } catch (error) {
      console.error('Error generating flushKardz:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const saveFlushKardz = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flushKard set.')
      return
    }

    try {
      const userDocRef = doc(collection(db, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)

      const batch = writeBatch(db)
      const updatedSets = [...(userDocSnap.data()?.flushKardSets || []), { name: setName }]
      
      userDocSnap.exists()
        ? batch.update(userDocRef, { flushKardSets: updatedSets })
        : batch.set(userDocRef, { flushKardSets: [{ name: setName }] })

      const setDocRef = doc(collection(userDocRef, 'flushKardSets'), setName)
      batch.set(setDocRef, { flushKardz })

      await batch.commit()

      alert('flushKardz saved successfully!')
      handleCloseDialog()
      setSetName('')
    } catch (error) {
      console.error('Error saving flushKardz:', error)
      alert('An error occurred while saving flushKardz. Please try again.')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const renderHand = (hand) => (
    hand.map((card, index) => (
      <Grid item xs={2} sm={2} md={2} key={index}>
        <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', border: '2px solid black', borderRadius: '8px' }}>
          <CardContent sx={{ color: 'black' }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: getCardColor(card.suit) }}
            >
              {card.rank} {card.suit}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))
  )

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
            href="/" // Link to Buy-In
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
              left: '25%',
              transform: 'translateX(-50%)',
              zIndex: 1200,
            }}
          >
            Buy-In
          </Button>
          <Button
            component={Link}
            href="/" // Link to home page
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
            Home
          </Button>
          <Button
            component={Link}
            href="/sign-in"
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
            Sign-In
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundImage: 'url(hit_me_with_flushKardz.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="sm" sx={{ overflow: 'auto', height: '100%', p: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
          <Box sx={{ my: 2, mt: 10 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
              hit me with flushKardz
            </Typography>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              label="Type your query here"
              variant="outlined"
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', mb: 2 }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ 
                fontSize: '1.5rem', 
                px: 4, 
                py: 2, 
                borderRadius: 50, 
                background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
                color: 'white',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                textTransform: 'uppercase',
                letterSpacing: 1.2,
                transition: '0.3s',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0072ff, #00c6ff)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              {isLoading ? 'Loading...' : 'Submit'}
            </Button>
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'white' }}>
              Your Flush Kardz:
            </Typography>
            <Grid container spacing={2}>
              {flushKardz.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', border: '2px solid black', borderRadius: '8px' }}>
                    <CardContent sx={{ color: 'black' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {card.front}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {card.back}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            sx={{ 
              fontSize: '1.5rem', 
              px: 4, 
              py: 2, 
              borderRadius: 50, 
              background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              transition: '0.3s',
              '&:hover': {
                background: 'linear-gradient(45deg, #0072ff, #00c6ff)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Save
          </Button>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
              House
            </Typography>
            <Grid container spacing={2} direction="row">
              {renderHand(houseHand)}
            </Grid>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
              You
            </Typography>
            <Grid container spacing={2} direction="row">
              {renderHand(userHand)}
            </Grid>
          </Box>

          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Save Flush Kardz Set</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter a name for your flushKard set:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Set Name"
                fullWidth
                variant="outlined"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={saveFlushKardz}>Save</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  )
}
