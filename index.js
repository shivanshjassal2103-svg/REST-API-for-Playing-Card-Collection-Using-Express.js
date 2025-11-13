const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
let cardCollection = [
  { id: 1, name: 'Black Lotus', set: 'Alpha', condition: 'Near Mint' },
  { id: 2, name: 'Charizard', set: 'Base Set', condition: 'Played' },
  { id: 3, name: 'Blue-Eyes White Dragon', set: 'LOB', condition: 'Good' }
];
let nextId = 4; 
app.get('/', (req, res) => {
  res.send('Welcome to the Playing Card Collection API!');
});


 
 
app.post('/cards', (req, res) => {
  const { name, set, condition } = req.body;

  if (!name || !set || !condition) {
    return res.status(400).json({ error: 'Missing required fields: name, set, and condition.' });
  }

  const newCard = {
    id: nextId++,
    name: name,
    set: set,
    condition: condition
  };

  cardCollection.push(newCard);

  // Respond with the newly created card and a 201 (Created) status
  res.status(201).json(newCard);
});

app.get('/cards', (req, res) => {
  res.json(cardCollection);
});

app.get('/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = cardCollection.find(c => c.id === cardId);

  if (!card) {
    return res.status(404).json({ error: 'Card not found.' });
  }

  res.json(card);
});


app.put('/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const index = cardCollection.findIndex(c => c.id === cardId);

  if (index === -1) {
    return res.status(404).json({ error: 'Card not found.' });
  }

  const { name, set, condition } = req.body;

  // Basic validation
  if (!name || !set || !condition) {
    return res.status(400).json({ error: 'Missing required fields: name, set, and condition.' });
  }

  // Update the card
  const updatedCard = {
    id: cardId,
    name: name,
    set: set,
    condition: condition
  };
  cardCollection[index] = updatedCard;

  res.json(updatedCard);
});

/**
 * DELETE: Remove a card from the collection by its ID.
 * Route: DELETE /cards/:id
 */
app.delete('/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const index = cardCollection.findIndex(c => c.id === cardId);

  if (index === -1) {
    return res.status(404).json({ error: 'Card not found.' });
  }

  // Remove the card from the array
  const [deletedCard] = cardCollection.splice(index, 1);

  // Send a 204 (No Content) response, or optionally send back the deleted item
  res.json({ message: 'Card deleted successfully', deletedCard });
});

/**
 * --- Start the Server ---
 * Listen for incoming connections on the specified port.
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
