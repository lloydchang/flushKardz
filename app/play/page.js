// flushKardz/app/play/page.js

  /* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
  * You may use, distribute and modify this code under the
  * terms of the AGPLv3 license.
  *
  * You should have received a copy of the AGPLv3 license with
  * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
  */

  'use client'

  import React, { useEffect, useState } from 'react';
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
  import getStripe from '../../utils/get-stripe.js';

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
    const suits = ['♣', '♦', '♥', '♠']
    const selectedSuit = suits[Math.floor(Math.random() * suits.length)];
    const flushCards = deck.filter(card => card.suit === selectedSuit);

    if (flushCards.length < numCards) {
      throw new Error('Not enough cards to deal a flush');
    }

    const shuffledFlushCards = shuffleDeck(flushCards);
    return shuffledFlushCards.slice(0, numCards);
  }

  const getCardColor = (suit) => {
    return ['♣', '♠'].includes(suit) ? 'black' : 'red'
  }

  // New function to compare hands and determine the winner
  const compareHands = (userHand, aiHand) => {
    const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    const sortedUserHand = userHand.sort((a, b) => rankOrder.indexOf(b.rank) - rankOrder.indexOf(a.rank));
    const sortedAIHand = aiHand.sort((a, b) => rankOrder.indexOf(b.rank) - rankOrder.indexOf(a.rank));

    for (let i = 0; i < 5; i++) {
      const userRankIndex = rankOrder.indexOf(sortedUserHand[i].rank);
      const aiRankIndex = rankOrder.indexOf(sortedAIHand[i].rank);
      
      if (userRankIndex > aiRankIndex) {
        return { winner: "User", message: "You win!" };
      } else if (aiRankIndex > userRankIndex) {
        return { winner: "AI", message: "AI wins!" };
      }
    }
    
    return { winner: "Tie", message: "It's a tie!" };
  }

  export default function Play() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [text, setText] = useState('Type words here to change Community’s flash/flushKardz')
    const [flushKardz, setFlushKardz] = useState([])
    const [handName, sethandName] = useState('')
    const [userHand, setUserHand] = useState([])
    const [artificialIntelligenceHand, setArtificialIntelligenceHand] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [winner, setWinner] = useState('')
    const [isLandscape, setIsLandscape] = useState(true);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
      // Check if the window is in landscape mode
      const handleOrientationChange = () => {
        const isCurrentlyLandscape = window.matchMedia('(orientation: landscape)').matches;
        setIsLandscape(isCurrentlyLandscape);

        if (!isCurrentlyLandscape) {
          setShowWarning(true);
          setTimeout(() => {
            setShowWarning(false);
          }, 3000); // 3 seconds
        }
      };

      handleOrientationChange();
      window.addEventListener('resize', handleOrientationChange);

      return () => window.removeEventListener('resize', handleOrientationChange);
    }, []);

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
      const deck = shuffleDeck(createDeck());
      
      const userFlush = dealFlush(deck, 5);
      
      let remainingDeck = deck.filter(card => !userFlush.some(userCard => card.rank === userCard.rank && card.suit === userCard.suit));
      
      const artificialIntelligenceFlush = dealFlush(remainingDeck, 5);
    
      setUserHand(userFlush);
      setArtificialIntelligenceHand(artificialIntelligenceFlush);

      // Determine the winner
      const result = compareHands(userFlush, artificialIntelligenceFlush);
      setWinner(result);
    }, []);

    const handleSubmit = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch('api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
    
        if (!response.ok) throw new Error('Failed to hit me with flushKardz');
    
        const data = await response.json();
        console.log('Received data:', data);

        // Shuffle the deck
        const deck = shuffleDeck(createDeck());
    
        // Deal new flush hands for the user and AI after shuffling is complete
        const userFlush = dealFlush(deck, 5);
    
        let remainingDeck = deck.filter(card => !userFlush.some(userCard => card.rank === userCard.rank && card.suit === userCard.suit));
    
        const artificialIntelligenceFlush = dealFlush(remainingDeck, 5);
    
        // // Simulate shuffling delay
        // setTimeout(() => {
          setUserHand(userFlush);
          setArtificialIntelligenceHand(artificialIntelligenceFlush);
    
          // Determine the winner
          const result = compareHands(userFlush, artificialIntelligenceFlush);
          setWinner(result);
        // }, 1500); // Adjust the delay time as needed
    
        const usedCards = [...userFlush, ...artificialIntelligenceFlush];
        const remainingDeckForCommunity = createDeck().filter(card =>
          !usedCards.some(usedCard => usedCard.rank === card.rank && usedCard.suit === card.suit)
        );
    
        const communityCards = dealFlush(remainingDeckForCommunity, data.length);
    
        const updatedData = data.map((item, index) => ({
          ...communityCards[index],
          front: item.front || `Community Card ${index + 1}`,
          back: item.back || 'BACK SIDE TEXT',
        }));
    
        setFlushKardz(updatedData);
      } catch (error) {
        console.error('Error generating flushKardz:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

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
        {isLandscape ? null : (
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
            }}
          >
            <Typography variant="h4">
              Please rotate your device to landscape mode for the best experience.
            </Typography>
          </Box>
        )}

        {showWarning && (
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
            href="/"
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
            Home
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
            backgroundImage: 'url(play.jpg)',
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
                Hit me with flushKardz
              </Typography>
              <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                variant="outlined"
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', mb: 13 }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ 
                  ...buttonStyle,
                  fontSize: '1rem', 
                  px: 2, 
                  py: 1,
                  top: 16,
                  left: '6%',
                  borderRadius: 50, 
                  background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
                  color: 'white',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  transform: 'translateX(-50%)',
                  transition: '0.3s',
                  zIndex: 1200,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0072ff, #00c6ff)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                {isLoading ? 'Shuffling...' : 'Play'}
              </Button>
            </Box>

            <Box sx={{ my: 4 }}>
              <Typography variant="h4" component="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                Community’s flash/flushKardz
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
                        overflow: 'hidden',
                        height: '200px',
                        width: '100%',
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
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                          zIndex: 1,
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
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          border: '2px solid black',
                          borderRadius: '8px',
                          zIndex: 0,
                          display: 'flex',
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
                Your flush cards
              </Typography>
              <Grid container spacing={2} direction="row">
                {renderHand(userHand)}
              </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
                AI’s flush cards
              </Typography>
              <Grid container spacing={2} direction="row">
                {renderHand(artificialIntelligenceHand)}
              </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h3" component="h2" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {winner.message}
              </Typography>
            </Box>

          </Container>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 20,
            width: '20%',
            height: 'auto', // Adjust height as needed
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'flex-start', // Align items to the top within the box
            justifyContent: 'center',
            flexDirection: 'column', // Ensure items stack vertically
            padding: '16px', // Add padding if needed
          }}
        >
          <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>Bought-In</Typography>
          <Typography variant="body1" component="body1" gutterBottom sx={{ color: 'black', fontWeight: 'bold', fontSize: '1rem' }}>
            1. Byl Zhevideos <br/>
            2. Unk Unstoppable <br/>
            3. Avvy Acem <br/>
            4. Elgraphika Jymynyz <br/>
            5. Rian Beawesyt <br/>
            6. Myasuun Socalla <br/>
            7. Izaahn Yahzeen <br/>
            8. Infyna Julioon <br/>
            9. Johonie Royalaflush <br/>
            10. Wyna Wubya <br/>
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 10,
            width: '20%',
            height: 'auto', // Adjust height as needed
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'flex-start', // Align items to the top within the box
            justifyContent: 'center',
            flexDirection: 'column', // Ensure items stack vertically
            padding: '16px', // Add padding if needed
          }}
        >
          <Typography variant="h6" sx={{ color: 'red', fontWeight: 'bold' }}>Signed-In</Typography>
          <Typography variant="body1" component="body1" gutterBottom sx={{ color: 'red', fontWeight: 'bold', fontSize: '1rem' }}>
            1. Yazzyn Yappa <br/>
            2. Sajayya Swifties <br/>
            3. Pharzee Pixela <br/>
            4. Jaaak O’Brainian <br/>
            5. Anjellyca Anucello <br/>
            6. Fayzun Fiersum <br/>
            7. Raaheed Fliashh <br/>
            8. Naeaal Paanoola <br/>
            9. Dyeno Dabot <br/>
            10. Mesix Yujustavansed <br/>
          </Typography>
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
    )
  }
