'use client'

import { useState } from 'react'
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
} from '@mui/material'
import { useUser } from '@clerk/nextjs'
import { doc, collection, getDoc, writeBatch } from 'firebase/firestore'
import db from '../../firebase'

export default function HitMeWithFlushKardz() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [text, setText] = useState('')
  const [flushKardz, setFlushKardz] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

      if (!response.ok) {
        throw new Error('Failed to hit me with flushKardz')
      }

      const data = await response.json()
      setFlushKardz(data)
    } catch (error) {
      console.error('Error generating flushKardz:', error)
      alert('An error occurred when trying to hit me with flushKardz. Please try again.')
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

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        const updatedSets = [...(userData.flushKardSets || []), { name: setName }]
        batch.update(userDocRef, { flushKardSets: updatedSets })
      } else {
        batch.set(userDocRef, { flushKardSets: [{ name: setName }] })
      }

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

  return (
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
        overflow: 'hidden', // Hide scrollbar
      }}
    >
      <Container maxWidth="sm" sx={{ overflow: 'auto', height: '100%', p: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
        <Box sx={{ my: 2 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            hit me with flushKardz
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{
              mb: 2,
              '& input': { 
                color: 'white', 
                fontSize: '1.5rem',  // Adjusted font size
                fontWeight: 'bold'   // Make text bold
              },
              '& .MuiInputLabel-root': { color: 'white', fontSize: '1.5rem', fontWeight: 'bold' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
              },
              '& .MuiInputBase-input::placeholder': { 
                color: 'white', 
                fontSize: '1.5rem',  // Adjusted font size of placeholder
                fontWeight: 'bold'   // Make placeholder text bold
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiFormLabel-root': { color: 'white !important', fontSize: '1.5rem', fontWeight: 'bold' },
              '& .MuiFormLabel-root.Mui-focused': { color: 'white !important' }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            {!isLoading && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{
                  width: '150px',
                  fontSize: '1.2rem', // Adjusted font size for button
                  padding: '8px 16px',
                }}
              >
                go
              </Button>
            )}
          </Box>
          {isLoading && (
            <Typography
              variant="h4"
              sx={{
                mt: 2,
                color: 'white',
                textAlign: 'center',
                animation: 'flash 1s infinite'
              }}
            >
              Please wait…
            </Typography>
          )}
        </Box>

        {flushKardz.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                Save flushKardz
              </Button>
            </Box>
            <Grid container spacing={2}>
              {flushKardz.map((flushKard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    border: '2px solid white',
                    borderRadius: '8px'
                  }}>
                    <CardContent sx={{ color: 'white' }}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 'bold', fontSize: '1.2rem' }} // Adjusted font size for card content
                      >
                        {flushKard.front}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 'bold', fontSize: '1.2rem' }} // Adjusted font size for card content
                      >
                        {flushKard.back}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background
              color: 'white',
            },
          }}
        >
          <DialogTitle sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>
            Save flushKardz
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: 'white' }}>
              Please enter a name for your flushKardz.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              sx={{
                backgroundColor: 'transparent', // Transparent background
                '& input': { 
                  fontSize: '1.5rem',  // Adjusted font size
                  fontWeight: 'bold'   // Make text bold
                },
                '& .MuiInputLabel-root': { color: 'white', fontSize: '1.5rem', fontWeight: 'bold' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                },
                '& .MuiInputBase-input::placeholder': { 
                  color: 'white', 
                  fontSize: '1.5rem',  // Adjusted font size of placeholder
                  fontWeight: 'bold'   // Make placeholder text bold
                },
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiFormLabel-root': { color: 'white !important', fontSize: '1.5rem', fontWeight: 'bold' },
                '& .MuiFormLabel-root.Mui-focused': { color: 'white !important' }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={saveFlushKardz} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}
