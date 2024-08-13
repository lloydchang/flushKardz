const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)
  
    // ... (rest of the component)
  }

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return
      try {
        const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`)
        const sessionData = await res.json()
        if (res.ok) {
          setSession(sessionData)
        } else {
          setError(sessionData.error)
        }
      } catch (err) {
        setError('An error occurred while retrieving the session.')
      } finally {
        setLoading(false)
      }
    }
    fetchCheckoutSession()
  }, [session_id])

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
        <CircularProgress />
        <Typography variant="h6" sx={{mt: 2}}>
          Loading...
        </Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    )
  }
