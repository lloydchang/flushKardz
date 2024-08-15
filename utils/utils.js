export const createDeck = () => {
    const suits = ['♠', '♦', '♣', '♥'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return suits.flatMap(suit => ranks.map(rank => ({ suit, rank })));
  };
  
  export const shuffleDeck = (deck) => {
    let shuffledDeck = [...deck];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
  };
  
  export const dealHand = (deck, numCards) => deck.splice(0, numCards);
  
  export const getCardColor = (suit) => {
    return ['♠', '♣'].includes(suit) ? 'black' : 'red';
  };
  