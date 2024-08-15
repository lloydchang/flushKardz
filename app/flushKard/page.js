import { Card, CardContent, Typography } from '@mui/material'
import { getCardColor } from '../../utils'

const CardComponent = ({ card }) => (
  <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', border: '2px solid black', borderRadius: '8px' }}>
    <CardContent sx={{ color: 'black' }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: getCardColor(card.suit) }}>
        {card.rank} {card.suit}
      </Typography>
    </CardContent>
  </Card>
)

export default CardComponent
