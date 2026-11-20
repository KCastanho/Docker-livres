
const express = require('express');
const mongoose = require('mongoose');
const booksRouter = require('./routes/books');

const app = express();

const PORT = Number(process.env.PORT || 3000);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/livresdb';

// Middleware pour lire les données JSON
app.use(express.json());

// Route d'accueil
app.get('/', (req, res) => {
  res.json({
    message: 'API Livres opérationnelle',
    endpoint: '/books'
  });
});

// Routes des livres
app.use('/books', booksRouter);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === 11000) {
    return res.status(409).json({ error: 'Cet ID existe déjà' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Connexion à MongoDB et démarrage du serveur
async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connecté à MongoDB');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API disponible sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Connexion MongoDB impossible :', error.message);
    process.exit(1);
  }
}

start();
