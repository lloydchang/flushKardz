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
  const suits = ['♠', '♦', '♣', '♥']
  const selectedSuit = suits[Math.floor(Math.random() * suits.length)];
  const flushCards = deck.filter(card => card.suit === selectedSuit);

  if (flushCards.length < numCards) {
    throw new Error('Not enough cards to deal a flush');
  }

  const shuffledFlushCards = shuffleDeck(flushCards);
  return shuffledFlushCards.slice(0, numCards);
}

const getCardColor = (suit) => {
  return ['♠', '♣'].includes(suit) ? 'black' : 'red'
}

export default function HitMeWithFlushKardz() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [text, setText] = useState('')
  const [flushKardz, setFlushKardz] = useState([])
  const [handName, sethandName] = useState('')
  const [userHand, setUserHand] = useState([])
  const [botHand, setBotHand] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const deck = shuffleDeck(createDeck());

    // Deal user hand
    const userFlush = dealFlush(deck, 5);

    // Remove user hand cards from the deck
    let remainingDeck = deck.filter(card => !userFlush.some(userCard => card.rank === userCard.rank && card.suit === userCard.suit));

    // Deal bot hand
    const botFlush = dealFlush(remainingDeck, 5);

    setUserHand(userFlush);
    setBotHand(botFlush);
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
      console.log('Received data:', data); // Log the data

      // Generate independent ranks and suits for community flashKardz
      const communityDeck = shuffleDeck(createDeck());
      const communityFlush = dealFlush(communityDeck, data.length);

      // Add front, back, and flipped properties to each card
      const updatedData = data.map((card, index) => ({
        front: communityFlush[index].rank + ' ' + communityFlush[index].suit,
        back: card.someField || 'BACK SIDE TEXT', // Use the appropriate field from the API response
        flipped: false
      }))

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
      {/* AppBar and other components */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
          community's flushKardz
        </Typography>
        <Grid container spacing={2}>
          {flushKardz.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
          your flushKardz
        </Typography>
        <Grid container spacing={2} direction="row">
          {renderHand(userHand)}
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
          bot's flushKardz
        </Typography>
        <Grid container spacing={2} direction="row">
          {renderHand(botHand)}
        </Grid>
      </Box>
    </>
  )
}
