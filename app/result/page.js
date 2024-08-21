// flushKardz/result/page.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ResultPage = () => {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { session_id } = router.query;

      if (!session_id) {
        setError('Session ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/buy?session_id=${session_id}`);
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        } else if (response.status === 404) {
          setError('Session not found or invalid session ID.');
        } else {
          setError('Failed to fetch session details.');
        }
      } catch (err) {
        setError('Error fetching session details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router.query]);

  return (
    <div>
      <h1>Payment Result</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {session && (
        <div>
          <h2>Checkout Session Details</h2>
          <p><strong>Session ID:</strong> {session.id}</p>
          <p><strong>Status:</strong> {session.payment_status}</p>
          <p><strong>Amount Total:</strong> ${session.amount_total / 100}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default ResultPage;
