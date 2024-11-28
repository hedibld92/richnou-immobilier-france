const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import des routes
const authRoutes = require('./routes/auth');
const annonceRoutes = require('./routes/annonces');
const favorisRoutes = require('./routes/favoris');
const searchesRoutes = require('./routes/searches');
const openDataRoutes = require('./routes/opendata');

// Application des routes
app.use('/api/auth', authRoutes);
app.use('/api/annonces', annonceRoutes);
app.use('/api/favoris', favorisRoutes);
app.use('/api/searches', searchesRoutes);
app.use('/api/opendata', openDataRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});