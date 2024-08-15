'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Container, Grid, Card, CardActionArea, CardContent, Box, Typography, CircularProgress } from '@mui/material'
import { collection, doc, getDocs } from 'firebase/firestore'
import db from '../../firebase'

export default function FlushKard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flushKardz, setflushKardz] = useState([])
  const [flipped, setFlipped] = useState({})
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const search = searchParams.get('id')

  useEffect(() => {
    async function getflushKard() {
      if (!search || !user) return

      setLoading(true)
      try {
        const colRef = collection(doc(collection(db, 'users'), user.id), search)
        const docs = await getDocs(colRef)
        const flushKardzData = []
        docs.forEach((doc) => {
          flushKardzData.push({ id: doc.id, ...doc.data() })
        })
        setflushKardz(flushKardzData)
      } catch (error) {
        console.error('Error fetching flushKardz:', error)
      } finally {
        setLoading(false)
      }
    }
    getflushKard()
  }, [search, user])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flushKardz.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
            No flushKardz found.
          </Typography>
        ) : (
          flushKardz.map((flushKard) => (
            <Grid item xs={12} sm={6} md={4} key={flushKard.id}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(flushKard.id)}>
                  <CardContent>
                    <Box sx={{ position: 'relative', height: 200 }}>
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          transform: flipped[flushKard.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          transition: 'transform 0.6s',
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flushKard.front}
                        </Typography>
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          backfaceVisibility: 'hidden',
                          transform: flipped[flushKard.id] ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                          transition: 'transform 0.6s',
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {flushKard.back}
                        </Typography>
                      </div>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  )
}
