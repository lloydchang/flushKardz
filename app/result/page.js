// flushKardz/app/result/page.js

/* Copyright (C) 2024 Lloyd Chang - All Rights Reserved
 * You may use, distribute and modify this code under the
 * terms of the AGPLv3 license.
 *
 * You should have received a copy of the AGPLv3 license with
 * this file. If not, please visit: https://www.gnu.org/licenses/agpl-3.0.html
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Box, Typography, Button, CircularProgress } from '@mui/material';

// Function to fetch session data
async function fetchSessionData(sessionId) {
  console.log('Fetching session data for sessionId:', sessionId);

  try {
    const response = await fetch(`/api/session?session_id=${encodeURIComponent(sessionId)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch session data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched session data:', data);

    return data;
  } catch (error) {
    console.error('Error fetching session data:', error);
    return null;
  }
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchSessionData(sessionId).then(data => {
        setSessionData(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const handleRetry = () => {
    if (sessionId) {
      setLoading(true);
      fetchSessionData(sessionId).then(data => {
        setSessionData(data);
        setLoading(false);
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout Result
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : sessionData ? (
        <Box>
          <Typography variant="h6">Session ID: {sessionData.id}</Typography>
          <Typography variant="body1">Payment Status: {sessionData.payment_status}</Typography>
          <Box sx={{ mt: 2 }}>
            <img
              src={sessionData.metadata?.product_image || 'https://flushkardz.vercel.app/flushKardz.jpg'}
              alt="Product"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetry}
            sx={{ mt: 2 }}
          >
            Retry Fetch
          </Button>
        </Box>
      ) : (
        <Typography variant="body1">No session data found or invalid session ID.</Typography>
      )}
    </Container>
  );
}
