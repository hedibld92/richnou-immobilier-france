const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const annoncesRoutes = require('./routes/annonces');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/immobilier-prestige', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion MongoDB:', err));

// Utilisation des routes
app.use('/api/annonces', annoncesRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'API Immobilier de prestige' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});