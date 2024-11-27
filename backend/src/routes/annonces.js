const express = require('express');
const router = express.Router();

// Importez le contrôleur
const annonceController = require('../controllers/annonceController');

// Définissez les routes
router.get('/', annonceController.getAnnonces);
router.post('/', annonceController.createAnnonce);
router.get('/search', annonceController.searchAnnonces);
router.get('/:id', annonceController.getAnnonceById);
router.put('/:id', annonceController.updateAnnonce);
router.delete('/:id', annonceController.deleteAnnonce);

module.exports = router;