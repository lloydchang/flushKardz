'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Container, Grid, Card, CardContent, CardActionArea, Typography, CircularProgress } from '@mui/material'
import { doc, collection, getDoc, setDoc } from 'firebase/firestore'
import db from '../../firebase'

export default function FlushKard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flushKardz, setflushKardz] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getflushKardz() {
      setLoading(true)
      try {
        if (!user) return
        const docRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const collections = docSnap.data().flushKardz || []
          setflushKardz(collections)
        } else {
          await setDoc(docRef, { flushKardz: [] })
          setflushKardz([])
        }
      } catch (error) {
        console.error('Error fetching flushKardz:', error)
      } finally {
        setLoading(false)
      }
    }

    getflushKardz()
  }, [user])

  const handleCardClick = (id) => {
    router.push(`/flushKard?id=${id}`)
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
        {flushKardz.map((flushKard) => (
          <Grid item xs={12} sm={6} md={4} key={flushKard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flushKard.id)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {flushKard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
