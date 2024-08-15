// flushKardz/app/flushKardz/page.js

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

// Function to create a flush hand
const dealFlush = (deck, numCards) => {
  // Get all cards from the same suit
  const suits = ['♠', '♦', '♣', '♥']
  const selectedSuit = suits[Math.floor(Math.random() * suits.length)];
  const flushCards = deck.filter(card => card.suit === selectedSuit);

  // Ensure we have enough cards to deal
  if (flushCards.length < numCards) {
    throw new Error('Not enough cards to deal a flush');
  }

  // Shuffle and deal the required number of cards
  const shuffledFlushCards = shuffleDeck(flushCards);
  return shuffledFlushCards.slice(0, numCards);
}

const getCardColor = (suit) => {
  return ['♠', '♣'].includes(suit) ? 'black' : 'red'
}

// New function to generate unique community cards
// const generateCommunityCards = (deck, numCards) => {
//   const communityCards = [];
//   let remainingDeck = [...deck];

//   for (let i = 0; i < numCards; i++) {
//     if (remainingDeck.length === 0) break;
//     const randomIndex = Math.floor(Math.random() * remainingDeck.length);
//     const card = remainingDeck[randomIndex];
//     communityCards.push({
//       rank: card.rank,
//       suit: card.suit,
//       front: `Community Card ${i + 1}`,
//       back: 'BACK SIDE TEXT',
//       flipped: false
//     });
//     remainingDeck = remainingDeck.filter((_, index) => index !== randomIndex);
//   }

//   return communityCards;
// }

export default function HitMeWithFlushKardz() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [text, setText] = useState('Type words here to change community\'s flushKardz')
  const [flushKardz, setFlushKardz] = useState([])
  const [handName, sethandName] = useState('')
  const [userHand, setUserHand] = useState([])
  const [artificialIntelligenceHand, setArtificialIntelligenceHand] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const deck = shuffleDeck(createDeck());
    
    // Deal user hand
    const userFlush = dealFlush(deck, 5);
    
    // Remove user hand cards from the deck
    let remainingDeck = deck.filter(card => !userFlush.some(userCard => card.rank === userCard.rank && card.suit === userCard.suit));
    
    // Deal artificial intelligence hand
    const artificialIntelligenceFlush = dealFlush(remainingDeck, 5);
  
    setUserHand(userFlush);
    setArtificialIntelligenceHand(artificialIntelligenceFlush);
  }, []);  

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/hit_me_with_flushKardz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
  
      if (!response.ok) throw new Error('Failed to hit me with flushKardz')
  
      const data = await response.json()
      console.log('Received data:', data);
  
      // Use the received data for front and back, generate separate rank and suit
      const usedCards = [...userHand, ...artificialIntelligenceHand];
      const remainingDeck = createDeck().filter(card => 
        !usedCards.some(usedCard => usedCard.rank === card.rank && usedCard.suit === card.suit)
      );

//      const communityCards = generateCommunityCards(remainingDeck, data.length);
      const communityCards = dealFlush(remainingDeck, data.length);
      
      const updatedData = data.map((item, index) => ({
        ...communityCards[index],
        front: item.front || `Community Card ${index + 1}`,
        back: item.back || 'BACK SIDE TEXT',
      }));
  
      setFlushKardz(updatedData)
    } catch (error) {
      console.error('Error generating flushKardz:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Function to handle card flip
  const handleCardFlip = (index) => {
    const updatedFlushKardz = [...flushKardz]
    updatedFlushKardz[index].flipped = !updatedFlushKardz[index].flipped
    setFlushKardz(updatedFlushKardz)
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
            Buy-In Stripe
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
            Sign-In Twitch
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
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold', fontSize: '3rem' }}>
              hit me with flushKardz
            </Typography>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', mb: 13 }}
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
              {isLoading ? 'Shuffling...' : 'Play'}
            </Button>
          </Box>

          {/* <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
              community's flushKardz (flashcards / flush cards)
            </Typography>
            <Grid container spacing={2}>
              {flushKardz.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 1)', 
                      // backgroundColor: card.flipped ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 1)',
                      border: '2px solid black', 
                      borderRadius: '8px',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleCardFlip(index)}
                  >
                    <CardContent sx={{ color: 'black', display: card.flipped ? 'none' : 'block' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {card.front}
                      </Typography>
                    </CardContent>
                    <CardContent sx={{ color: 'black', display: card.flipped ? 'block' : 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.3)', border: '2px solid black', borderRadius: '8px' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {card.back}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box> */}

          <Box sx={{ my: 4 }}>
            <Typography variant="h5" component="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
              community's flushKardz / flash cards
            </Typography>
            <Grid container spacing={2}>
              {flushKardz.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      border: '2px solid black',
                      borderRadius: '8px',
                      position: 'relative',
                      cursor: 'pointer',
                      overflow: 'hidden', // Ensure no content overflow
                      height: '200px', // Set a fixed height for consistency
                      width: '100%', // Ensure the card takes full width of its container
                    }}
                    onClick={() => handleCardFlip(index)}
                  >
                    <CardContent
                      sx={{
                        color: 'black',
                        display: card.flipped ? 'none' : 'block',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 1)', // Ensure the front side has a solid background
                        zIndex: 1, // Ensure the front side is on top
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {card.front}
                      </Typography>
                    </CardContent>
                    <CardContent
                      sx={{
                        color: 'black',
                        display: card.flipped ? 'block' : 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent background for the back side
                        border: '2px solid black',
                        borderRadius: '8px',
                        zIndex: 0, // Ensure the back side is behind the front side
                        display: 'flex', // Center the text
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {card.back}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            {flushKardz.map((card, index) => (
              <Grid item xs={2} sm={2} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: card.flipped ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 1)',
                    border: '2px solid black',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleCardFlip(index)}
                >
                  <CardContent sx={{ color: card.flipped ? 'black' : 'white' }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: getCardColor(card.suit) }}
                    >
                      {card.flipped ? `${card.rank} ${card.suit}` : card.back}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
              your flush cards
            </Typography>
            <Grid container spacing={2} direction="row">
              {renderHand(userHand)}
            </Grid>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
              AI's flush cards
            </Typography>
            <Grid container spacing={2} direction="row">
              {renderHand(artificialIntelligenceHand)}
            </Grid>
          </Box>

        </Container>
      </Box>
    </>
  )
}
